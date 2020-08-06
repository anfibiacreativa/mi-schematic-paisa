import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { normalize } from 'path';
import { PaisaOptions } from './paisaOptions.model';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function miSchematicPaisa(_options: PaisaOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const path = _options.path;
    const fileName = classify(path);
    const extPath = `${fileName}.txt`;
    const isFile = tree.exists(extPath);
    
    _context.logger.info('Estamos ejecutando el schematic');

    if (_options.showMessage) {
      _context.logger.info('Debo mostrar este mensaje');
    }
    
    if (!isFile) {
      tree.create(normalize(extPath), 'Hola Medellín');
    } else {
      _context.logger.info('¡Ese fichero ya existe!');
    }
    
    return tree;
  };
}
