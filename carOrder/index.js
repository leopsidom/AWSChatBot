'use strict';

function elicitModel(sessionAttributes, make) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName: "CarOrder",
            slots: {
               makes: make,
               models: null,
            },
            slotToElicit: "models",
        },
    };
}

function elicitMake(sessionAttributes) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName: "CarOrder",
            slots: {
               makes: null,
               models: null,
            },
            slotToElicit: "makes",
        },
    };
}
     
// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}
 
// --------------- Events -----------------------
 
function dispatch(intentRequest, callback) {
    console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const sessionAttributes = intentRequest.sessionAttributes;
    const slots = intentRequest.currentIntent.slots;
    const make = slots.makes;
    const model = slots.models;

    console.log(`makes is ${make} and models is ${model}`)
    // var message = close(sessionAttributes, 'Fulfilled',
    // {'contentType': 'PlainText', 'content': `Okay, I have ordered your ${size} ${pizzaKind} pizza on ${crust} crust`});
    if (make === null) {
        callback(elicitMake(sessionAttributes))
    } else if (model === null) {
        callback(elicitModel(sessionAttributes, make))
    } else {
        callback(close(sessionAttributes, 'Fulfilled',
                 {'contentType': 'PlainText', 'content': `Okay, I have ordered ${make} ${model} for you!`}))
    }
}
 
// --------------- Main handler -----------------------
 
// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
};