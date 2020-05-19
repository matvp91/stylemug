import jsx from '@babel/plugin-syntax-jsx';
import evaluateSimple from 'babel-helper-evaluate-path';
import { compileSchema } from 'stylemug-compiler';

export function babelPlugin(babel) {
  const t = babel.types;

  function wrapReports(path, reports) {
    if (!Array.isArray(reports)) {
      reports = [reports];
    }
    if (!reports.length) {
      return;
    }

    const node = t.cloneDeep(path.node);
    const objectChilds = [
      t.objectProperty(
        t.identifier('sourceLinesRange'),
        t.stringLiteral(
          'In lines ' + node.loc.start.line + ' to ' + node.loc.end.line
        )
      ),
      t.objectProperty(
        t.identifier('messages'),
        t.arrayExpression(
          reports.map((report) => t.stringLiteral(report.message))
        )
      ),
    ];
    if (path.hub.file.opts.filename) {
      objectChilds.push(
        t.objectProperty(
          t.identifier('fileName'),
          t.stringLiteral(path.hub.file.opts.filename || 'unknown')
        )
      );
    }

    node.arguments[1] = t.objectExpression(objectChilds);
    path.replaceWith(node);
  }

  return {
    name: 'stylemug/babel',
    inherits: jsx,
    visitor: {
      ImportDeclaration(path) {
        const specifier = path.get('specifiers').find((specifier) => {
          return (
            specifier.isImportDefaultSpecifier() &&
            specifier.parent.source.value === 'stylemug'
          );
        });

        if (!specifier) {
          return;
        }

        const references = path.scope.getBinding(specifier.node.local.name)
          .referencePaths;

        // Collect each stylemug.create({}) reference.
        references.forEach((reference) => {
          const local = reference.parentPath.parentPath;

          const sheet = evaluateSimple(local.get('arguments')[0]);
          if (!sheet.confident) {
            wrapReports(local, {
              message:
                'Failed to evaluate the following stylesheet: \n\n' +
                local.toString() +
                '\n\n' +
                'Make sure your stylesheet is statically defined.',
            });
            return;
          }

          const { result, reports } = compileSchema(sheet.value);
          wrapReports(local, reports);

          const nextLocal = t.cloneDeep(local.node);
          nextLocal.arguments[0] = t.objectExpression(
            Object.entries(result).map(([name, rules]) => {
              return t.objectProperty(
                t.identifier(name),
                t.objectExpression(
                  Object.entries(rules).map(([hash, rule]) => {
                    return t.objectProperty(
                      t.identifier(rule.keyId),
                      t.stringLiteral(hash)
                    );
                  })
                )
              );
            })
          );

          local.replaceWith(nextLocal);
        });
      },
    },
  };
}
