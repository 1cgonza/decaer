import { writeFileSync } from 'fs';

/**
 * Guardar datos localmente en archivo .json
 * @param {Object} json Datos que se quieren guardar en formato JSON.
 * @param {String} nombre Nombre del archivo, resulta en ${nombre}.json
 */
export const guardarJSON = (json: any, nombre: string) => {
  writeFileSync(`../www/estaticos/${nombre}.json`, JSON.stringify(json));
};
