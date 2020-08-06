import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { normalize } from 'path';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function miSchematicPaisa(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const path = _options.path;
    const fileName = classify(path);
    _context.logger.info('Estamos ejecutando el schematic');
    tree.create(normalize(`${fileName}.txt`), 'Hola Medellín');
    
    return tree;
  };
}
