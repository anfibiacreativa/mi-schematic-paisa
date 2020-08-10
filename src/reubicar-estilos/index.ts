import { Rule, SchematicContext, Tree, move, chain, schematic } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function reubicarEstilos(_options: any): Rule {
  return chain([
    schematic('normalizar-estructura', _options),
    (tree: Tree, _context: SchematicContext) => {

      _options.styleFilePath = `/src/styles.scss`;
      
      const alias = _options.name;
      const currentPath = _options.styleFilePath;
      const abstractsPath = `abstracts`;
      
      const imports = `@import '${abstractsPath}';`;
      
      // we make sure the file exists
      if(tree.exists(_options.styleFilePath)) {
        // we buffer the contents of it
        const styleBuffer = tree.read(currentPath);
        // we stringify the buffer or add an alternative comment
        const styleContent = styleBuffer ? styleBuffer.toString() : '// No content found';

        // finally we overwrite the file with the imports
        tree.overwrite(_options.styleFilePath, `${imports}\n ${styleContent}`);
      }
      
      return tree;
    }
  ]);
}
