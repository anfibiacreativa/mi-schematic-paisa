import { Rule, SchematicContext, Tree, move, chain, schematic } from '@angular-devkit/schematics';
import { normalize, join } from 'path';
import { MoveOptions } from './moveOptions.model';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function moverEstilos(_options: MoveOptions): Rule {
  return chain([
    schematic('reimportar-estilos', _options),
    (tree: Tree, _context: SchematicContext) => {
      _context.logger.info('Ejecutando schematic mover estilos');

      const finalPath = join(_options.path,`styles`, `styles.scss`);
      const currentPath = normalize(`src/styles.scss`);
      
      move(currentPath, finalPath);

      return tree;
    }
  ]);
}
