/*************************************************
 * Lyon Wear API
 * Code.gs
 *************************************************/

function doGet(e){

    if(e.parameter.action){

        return api(e);

    }

    return HtmlService
        .createHtmlOutput("Lyon Wear API");

}

function doPost(e){

    return error("Método no soportado.");

}
