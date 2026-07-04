/*************************************************
 * NEXT LEVEL API
 * Categories.gs
 *************************************************/

function getCategories(){

    const categories=[

        ...new Set(

            getProducts()

            .map(p=>p.categoria)

        )

    ];

    categories.sort();

    return categories;

}
