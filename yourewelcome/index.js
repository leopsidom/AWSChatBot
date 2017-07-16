exports.handler = (event, context, callback) => {
    // TODO implement
    callback(null, {
        "dialogAction": {
            "type": "Close",
            "fulfillmentState": "Fulfilled",
            "message": {
              "contentType": "PlainText",
              "content": "You're welcome"
            }
        }
    });
};