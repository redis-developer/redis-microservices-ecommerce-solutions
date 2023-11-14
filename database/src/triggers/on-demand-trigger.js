#!js name=OnDemandTriggers api_version=1.0

redis.registerAsyncFunction("resetInventory", async function (client) {
    let cursor = "0";
    const DEFAULT_PRODUCT_QTY = 25;
    const PRODUCT_IN_MAX_STORES = 5;
    const MAX_PRODUCT_QTY_IN_STORE = Math.floor(DEFAULT_PRODUCT_QTY / PRODUCT_IN_MAX_STORES);

    redis.log("resetInventory");
    do {
        client.block((client) => {
            let res = client.call("scan", cursor, "match", "products:productId:*");
            cursor = res[0];
            let keys = res[1];
            keys.forEach((key) => {
                if (!key.match("index:hash")) {
                    client.call("JSON.SET", key, "$.stockQty", DEFAULT_PRODUCT_QTY.toString());
                }
            });
        });
    } while (cursor != "0");

    cursor = "0";
    do {
        client.block((client) => {
            let res = client.call("scan", cursor, "match", "storeInventory:storeInventoryId:*");
            cursor = res[0];
            let keys = res[1];
            keys.forEach((key) => {
                if (!key.match("index:hash")) {
                    client.call("JSON.SET", key, "$.stockQty", MAX_PRODUCT_QTY_IN_STORE.toString());
                }
            });
        });
    } while (cursor != "0");

    return "resetInventory completed !";
});

//TFCALLASYNC OnDemandTriggers.resetInventory 0
