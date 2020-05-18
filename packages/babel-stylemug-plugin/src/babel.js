import jsx from '@babel/plugin-syntax-jsx';
import evaluateSimple from 'babel-helper-evaluate-path';
import { compileSchema } from 'stylemug-compiler';

export function babelPlugin(babel) {
  const t = babel.types;

  function defineError(path, msg) {
    const node = t.cloneDeep(path.node);
    node.arguments[1] = t.stringLiteral(msg);
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

        const local = path.scope.getBinding(specifier.node.local.name)
          .referencePaths[0].parentPath.parentPath;

        let sheet = evaluateSimple(local.get('arguments')[0]);
        if (!sheet.confident) {
          defineError(
            local,
            'Failed to evaluate the following stylesheet: \n\n' +
              local.toString() +
              '\n\n' +
              'Make sure your stylesheet is statically defined.'
          );
          return;
        }
        sheet = compileSchema(sheet.value);

        const nextLocal = t.cloneDeep(local.node);
        nextLocal.arguments[0] = t.objectExpression(
          Object.entries(sheet).map(([name, rules]) => {
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
      },
    },
  };
}
