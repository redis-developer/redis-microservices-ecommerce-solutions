#!js name=ManualTriggers api_version=1.0

redis.registerAsyncFunction("resetInventory", async function (async_client) {
    var cursor = "0";
    const DEFAULT_PRODUCT_QTY = 25;
    const PRODUCT_IN_MAX_STORES = 5;
    const MAX_PRODUCT_QTY_IN_STORE = Math.floor(DEFAULT_PRODUCT_QTY / PRODUCT_IN_MAX_STORES);

    redis.log("resetInventory");
    do {
        async_client.block((client) => {
            var res = client.call("scan", cursor, "match", "products:productId:*");
            cursor = res[0];
            var keys = res[1];
            keys.forEach((key) => {
                //redis.log(key);
                if (!key.match("index:hash")) {
                    client.call("JSON.SET", key, "$.stockQty", DEFAULT_PRODUCT_QTY.toString());
                }
            });
        });
    } while (cursor != "0");

    cursor = "0";
    do {
        async_client.block((client) => {
            var res = client.call("scan", cursor, "match", "storeInventory:storeInventoryId:*");
            cursor = res[0];
            var keys = res[1];
            keys.forEach((key) => {
                //redis.log(key);
                if (!key.match("index:hash")) {
                    client.call("JSON.SET", key, "$.stockQty", MAX_PRODUCT_QTY_IN_STORE.toString());
                }
            });
        });
    } while (cursor != "0");

    return "resetInventory completed !";
});

//TFCALLASYNC ManualTriggers.resetInventory 0
