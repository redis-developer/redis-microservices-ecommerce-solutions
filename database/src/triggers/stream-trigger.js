#!js name=StreamTriggers api_version=1.0

redis.registerStreamTrigger(
    "calculateStats", // trigger name
    "TRANSACTION_STREAM", // Detects new data added to the stream 
    function (client, data) {
        // data = JSON.stringify(
        //     data,
        //     (key, value) => (typeof value === "bigint" ? value.toString() : value) //id conversion
        // );

        // data = JSON.parse(data);

        var streamEntry = {};
        for (let i = 0; i < data.record?.length; i++) {
            streamEntry[data.record[i][0]] = data.record[i][1];
        }

        streamEntry.transactionPipeline = JSON.parse(streamEntry.transactionPipeline);
        streamEntry.orderDetails = JSON.parse(streamEntry.orderDetails);

        if (streamEntry.transactionPipeline?.length == 1
            && streamEntry.transactionPipeline[0] == "PAYMENT_PROCESSED"
            && streamEntry.orderDetails) {

            //log
            client.call("XADD", "TRIGGER_LOGS_STREAM", "*", "message", `${streamEntry.transactionPipeline}`, "orderId", `orders:orderId:${streamEntry.orderDetails.orderId}`, "function", "calculateStats");

            const orderAmount = parseInt(streamEntry.orderDetails.orderAmount); //remove decimal
            const products = streamEntry.orderDetails.products;

            // sales 
            client.call("INCRBY", "statsTotalPurchaseAmount", orderAmount.toString());

            for (let product of products) {
                const totalProductAmount = parseInt(product.qty) * parseInt(product.productPrice);

                // trending products
                client.call("ZINCRBY", "statsProductPurchaseQtySet", product.qty.toString(), product.productId);

                // category wise purchase interest 
                const category = (product.productData.masterCategory_typeName + ":"
                    + product.productData.subCategory_typeName).toLowerCase();
                client.call("ZINCRBY", "statsCategoryPurchaseAmountSet", totalProductAmount.toString(), category);

                // largest brand purchases
                const brand = product.productData.brandName;
                client.call("ZINCRBY", "statsBrandPurchaseAmountSet", totalProductAmount.toString(), brand);
            }

        }
    },
    {
        isStreamTrimmed: false, //whether the stream should be trimmed automatically after the data is processed by the consumer.
        window: 1,
    }
);
