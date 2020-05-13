const jsx = require('@babel/plugin-syntax-jsx').default;
const evaluateSimple = require('babel-helper-evaluate-path');
const compiler = require('./compile');
const extractor = require('./extractor');

module.exports = function stylemugBabelPlugin(babel) {
  const t = babel.types;

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
          return;
        }
        sheet = compiler.compileSchema(sheet.value, extractor);

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
};
