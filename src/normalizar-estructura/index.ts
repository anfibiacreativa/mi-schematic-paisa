import { 
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  chain,
  template,
  mergeWith,
  move,
  branchAndMerge,
  SchematicsException,
  forEach,
  FileEntry
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { normalize, basename, dirname } from 'path';
import { NormalizeOptions } from './normalizeOptions.model';
import { getWorkspace } from '@schematics/angular/utility/config';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function normalizarEstructura(_options: NormalizeOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // get the project name from the workspace config
    const workspace = getWorkspace(tree);
    _options.projectName = Object.keys(workspace.projects)[0];

    const projectName = _options.projectName;

    const path: string  = normalize(_options.path);
    const name: string = _options.name;

    // read current angular configuration (the one OOTB when generating a new project with CLi)
    const angularJSONBuffer = tree.read('/angular.json');
    _context.logger.info('Estamos ejecutando el schematic' + ' ' + name);
    if (!angularJSONBuffer) {
      throw new SchematicsException('No estamos en un proyecto Angular. ¡Adiós amigos!');
    }

    const source = apply(url('./files'), [
      forEach((file: FileEntry) => {
        let dir = dirname(file.path);
        let pathName = basename(dir);
        _options.folderName = pathName;
        _context.logger.info(`Estamos leyendo en árbol virtual -> ${pathName}`);
        return file;
      }),
      template({
        ...strings,
        ..._options,
        addProjectInfo
      }),
      move(path)
    ]);

    function addProjectInfo(): string {
      return `Este es el readme file para el proyecto ${projectName}. Encontrarás más información en [este enlace](https://www.angular.io)`
    }

    const chained = chain([branchAndMerge(chain([mergeWith(source)]))]);
    return chained(tree, _context);
  };
}
