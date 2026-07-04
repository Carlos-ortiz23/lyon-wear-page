/*************************************************
 * Lyon Wear API
 * Api.gs
 *************************************************/

function api(e){

  const action=e.parameter.action || "";

  switch(action){

    case "productos":

      return success({

        total:getProducts().length,

        productos:getProducts()

      });

    case "producto":

      const product=getProduct(

        e.parameter.id

      );

      if(!product){

          return error("Producto no encontrado.");

      }

      return success({

        producto:product

      });

    case "destacados":

      return success({

        productos:getFeaturedProducts()

      });

    case "nuevos":

      return success({

        productos:getNewProducts()

      });

    case "categorias":

      return success({

        categorias:getCategories()

      });

    default:

      return error("Acción no encontrada.");

  }

}
