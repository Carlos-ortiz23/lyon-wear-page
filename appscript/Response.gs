/*************************************************
 * Lyon Wear API
 * Response.gs
 *************************************************/

function response(data){

  return ContentService
    .createTextOutput(
      JSON.stringify(data)
    )
    .setMimeType(ContentService.MimeType.JSON);

}

function success(data){

  return response({

    success:true,

    ...data

  });

}

function error(message){

  return response({

    success:false,

    message:message

  });

}
