#!js name=KeySpaceTriggers api_version=1.0
redis.registerKeySpaceTrigger(
  "updateProductStockQty",
  "orders:orderId:",
  function (client, data) {
    const errors = [];

    try {
      if (client && data?.event == "json.set" && data?.key != "orders:orderId:index:hash") {

        const orderId = data.key;
        let result = client.call("JSON.GET", orderId);
        result = result ? JSON.parse(result) : '';
        const order = Array.isArray(result) ? result[0] : result;

        if (order?.products?.length && !order.triggerProcessed) {

          try {
            //create a log stream for triggers 
            client.call("XGROUP", "CREATE", "TRIGGER_LOGS_STREAM", "TRIGGER_LOGS_GROUP", "$", "MKSTREAM");
          }
          catch (streamConErr) {
            // errors.push(streamConErr); // if consumer already exists
          }

          for (const product of order.products) {
            let decreaseQtyBy = (-1 * product.qty).toString();
            client.call("JSON.NUMINCRBY", `products:productId:${product.productId}`, ".stockQty", decreaseQtyBy);

            //log
            client.call("XADD", "TRIGGER_LOGS_STREAM", "*", "message", `For productId ${product.productId}, stockQty ${decreaseQtyBy}`, "orderId", orderId, "function", "updateProductStockQty");
          }

          client.call("JSON.SET", orderId, ".triggerProcessed", "1");

        }
      }
    }
    catch (generalErr) {
      generalErr = JSON.stringify(generalErr, Object.getOwnPropertyNames(generalErr));
      errors.push(generalErr);
    }

    if (errors.length) {
      //log
      client.call("XADD", "TRIGGER_LOGS_STREAM", "*", "message", JSON.stringify(errors), "orderId", data.key, "function", "updateProductStockQty");
    }
    // return errors;
  }
);