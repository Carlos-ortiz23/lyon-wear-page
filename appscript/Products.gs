/*************************************************
 * NEXT LEVEL API
 * Products.gs
 *************************************************/

function getProducts(){

    const rows=getObjects(
        getSheet(CONFIG.SHEET_PRODUCTS)
    );

    let products=rows
    .filter(p=>yes(p.activo))
    .map(p=>{

        p.imagen1=image(p.imagen1);
        p.imagen2=image(p.imagen2);
        p.imagen3=image(p.imagen3);
        p.imagen4=image(p.imagen4);
        p.imagen5=image(p.imagen5);

        p.precio=Number(p.precio);

        p.stock=Number(p.stock);

        p.orden=Number(p.orden);

        return p;

    });

    products.sort((a,b)=>a.orden-b.orden);

    return products;

}

function getProduct(id){

    const products=getProducts();

    return products.find(p=>p.id==id);

}

function getFeaturedProducts(){

    return getProducts()

    .filter(p=>yes(p.destacado));

}

function getNewProducts(){

    return getProducts()

    .filter(p=>yes(p.nuevo));

}
