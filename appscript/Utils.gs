/*************************************************
 * NEXT LEVEL API
 * Utils.gs
 *************************************************/

function image(id){

  if(!id) return "";

  const value = String(id).trim();

  // La celda ya trae una URL completa: se usa tal cual
  if(value.startsWith("http")) return value;

  return CONFIG.DRIVE_URL + value + CONFIG.IMAGE_SIZE;

}

function yes(value){

  return String(value).toUpperCase()=="SI";

}
