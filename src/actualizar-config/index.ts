import { Rule, SchematicContext, Tree, schematic, chain } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function actualizarConfig(_options: any): Rule {
  return chain([
    schematic('agregar-alias', _options),
    (tree: Tree, _context: SchematicContext) => {


      // since project name is dynamic, we need to retrieve it from the config of the workspace
      const workspace = getWorkspace(tree);
      const project = (Object.keys(workspace.projects)[0]).toString();
      const dir = _options.dir ;
      const folder = _options.folder;
      const styles =  [`./${dir}/${folder}/styles/styles.scss`]; 
      const angularConfigPath = './angular.json';

      _context.logger.info(Object.keys(workspace.projects)[0] + ' workspace');

      if (tree.exists(angularConfigPath)) {
      const angularConfigBuffer = tree.read(angularConfigPath);

      if (!angularConfigBuffer) {
        return;
      }

      // read current angular configuration (the one OOTB when generating a new project with CLi)
      const rawAngularConfig = JSON.parse(angularConfigBuffer.toString('utf8'));

      // cash the necessary object properties, to modify angular.kson later
      const options = { 
        ...rawAngularConfig['projects'][project]['architect']['build']['options'],
      };
      // assign new value to use the new location for default styles
      options['styles'] = styles;

      // produce a new angular.json object, that includes our stylePreprocesor Options
      const updatedAngularConfig = {
        ...rawAngularConfig,
        ...{
          projects: {
            ...rawAngularConfig['projects'],
            [project]: {
              ...rawAngularConfig['projects'][project],
              architect: {
                ...rawAngularConfig['projects'][project]['architect'],
                build: {
                  ...rawAngularConfig['projects'][project]['architect']['build'],
                  options: {
                    ...rawAngularConfig['projects'][project]['architect']['build']['options'],
                    styles
                  }
                }
              }
            }
          }
        }
      }
      // overwrite the angular configuration including the path to our new scss structure
      tree.overwrite(angularConfigPath, JSON.stringify(updatedAngularConfig, null, 2));
      };
      return tree;
    }
  ]);
}
