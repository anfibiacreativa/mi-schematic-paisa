import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { normalize } from 'path';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function miSchematicPaisa(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const path = _options.path;
    
    _context.logger.info('Estamos ejecutando el schematic');

    if (_options.show) {
      _context.logger.info('Debo mostrar este mensaje');
    }
    
    tree.create(normalize(`${path}.txt`), 'Hola Medellín');
    
    return tree;
  };
}
