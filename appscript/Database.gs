/*************************************************
 * NEXT LEVEL API
 * Database.gs
 *************************************************/

function getSheet(name){

  return SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(name);

}

function getObjects(sheet){

    const data=sheet.getDataRange().getValues();

    const headers=data.shift();

    return data.map(row=>{

        let obj={};

        headers.forEach((h,i)=>{

            obj[h]=row[i];

        });

        return obj;

    });

}
