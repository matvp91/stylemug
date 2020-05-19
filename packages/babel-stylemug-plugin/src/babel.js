import jsx from '@babel/plugin-syntax-jsx';
import evaluateSimple from 'babel-helper-evaluate-path';
import { compileSchema, save } from 'stylemug-compiler';

export function babelPlugin(babel) {
  const t = babel.types;

  function defineError(path, msg) {
    // TODO: Insert an entry type instead of an ugly trimmed css string.
    save(
      'stylemug-error',
      `
        background-color: rgba(255, 0, 0, .3);
        outline: 3px solid rgba(255, 0, 0, .6);
        position: relative;
      `.trim()
    );
    save(
      'stylemug-error:hover::before',
      `
        opacity: 1;
        pointer-events: all;
      `.trim()
    );
    save(
      'stylemug-error:before',
      `
        content: "${msg.replace(/"/g, '\\"').replace(/\n/g, '\\00000a')}";
        position: absolute;
        right: 0;
        top: 100%;
        font-size: 10px;
        font-weight: normal;
        font-family: courier;
        text-align: right;
        pointer-events: none;
        opacity: 0;
        margin-left: 25px;
        background-color: rgba(255, 0, 0, .8);
        margin-top: 3px;
      `.trim()
    );

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

        const references = path.scope.getBinding(specifier.node.local.name)
          .referencePaths;

        // Collect each stylemug.create({}) reference.
        references.forEach((reference) => {
          const local = reference.parentPath.parentPath;

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

          try {
            sheet = compileSchema(sheet.value);
          } catch (error) {
            defineError(
              local,
              'An error occured when compiling stylesheet\n\n' +
                error.toString()
            );
            return;
          }

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
        });
      },
    },
  };
}
