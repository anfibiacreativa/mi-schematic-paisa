import { Rule, SchematicContext, Tree, move, chain, schematic, noop } from '@angular-devkit/schematics';
import { normalize, join } from 'path';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function reimportarEstilos(_options: any): Rule {
  return chain([
    schematic('normalizar-estructura', _options),
    (tree: Tree, _context: SchematicContext) => {

      _context.logger.info('Ejecutando schematic reimportar estilos');

      _options.styleFilePath = `/src/styles.scss`;
      const name = _options.name;
      
      const currentPath = _options.styleFilePath;
      const finalPath = join(_options.path, name, `styles`, `styles.scss`);
      const abstractsPath = `abstracts`;
      
      const imports = `@import '${abstractsPath}';`;

      tree.getDir('/').visit(filePath => {
        // let's not look for the file in the node modules!
        if (filePath.includes('node_modules')) {
          return;
        } 
        // let's not do anything if it's not our style file
        if (!filePath.endsWith(currentPath)) {
          return;
        }
        // let's buffer the contents of it
        const styleBuffer = tree.read(currentPath);
        if (!styleBuffer) {
          return;
        }
        // we stringify the buffer or add an alternative comment
        const styleContent = styleBuffer ? styleBuffer.toString() : '// No content found';

        // finally we overwrite the file with the imports
        const isMoved = tree.exists(finalPath);

        // let's verify is not movd yet
        if (!isMoved) {
          tree.create(finalPath, `${imports}\n ${styleContent}`);
          tree.delete(currentPath);
        } else {
          _context.logger.info('File already exists!');
          return;
        }
      });    
      return tree;
    }
  ]);
}
