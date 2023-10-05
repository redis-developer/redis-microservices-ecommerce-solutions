#!js name=ManualTriggers api_version=1.0

redis.registerAsyncFunction("resetInventory", async function (async_client) {
    var cursor = "0";
    const DEFAULT_QTY = 25;
    redis.log("resetInventory");
    do {
        async_client.block((client) => {
            var res = client.call("scan", cursor, "match", "products:productId:*");
            cursor = res[0];
            var keys = res[1];
            keys.forEach((key) => {
                //redis.log(key);
                if (!key.match("index:hash")) {
                    client.call("JSON.SET", key, "$.stockQty", DEFAULT_QTY.toString());
                }
            });
        });
    } while (cursor != "0");
    return "resetInventory completed !";
});

//TFCALLASYNC ManualTriggers.resetInventory 0
