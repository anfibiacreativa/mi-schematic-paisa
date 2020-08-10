import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { decamelize } from '@angular-devkit/core/src/utils/strings';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function reconfigurarEstilos(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _context.logger.info('Reconfigurando compiler options y estilos por defecto');

    // make some verifications before moving on
    tree.getDir('/').visit(filePath => {
      if (filePath.includes('node_modules')) {
        return;
      }

      if (!filePath.endsWith('tsconfig.app.json')) {
        return;
      }

      const tsConfigBuffer = tree.read(filePath);
      if (!tsConfigBuffer) {
        return;
      }
      
      // cash the tsconfig file contents in order to update them with our aliases
      const rawTsConfig = JSON.parse(tsConfigBuffer.toString('utf-8'));
      // cash both the paths property as object
      const paths = { ...rawTsConfig['compilerOptions']['paths'] };
      // and create an alias constant that is equal to the dasherized name we pass as options
      const alias = decamelize(_options.name);

      paths[`@${alias}/*`] = ['src/app/styles', 'src/app/styles/abstracts'];
      
      // actually modify the file
      const decoratedTsConfigJSON = {
        ...rawTsConfig,
        compilerOptions: {
          ...rawTsConfig['compilerOptions'],
          paths
        }
      };
      
      // overwrite the tsconfigfile!
      tree.overwrite(filePath, JSON.stringify(decoratedTsConfigJSON, null, 2));
    });

    return tree;
  };
}
