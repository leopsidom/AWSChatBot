function elicitIntention(sessionAttributes, message) {
    if (typeof message === 'undefined'){
        return {
            sessionAttributes,
            dialogAction: {
                type: 'ElicitSlot',
                intentName: "ConversationStarter",
                slots: {
                    intention: null
                },
                slotToElicit: "intention",
            },
        };
    } else {
        return {
            sessionAttributes,
            message: {
                contentType: "PlainText",
                content: message
            },
            dialogAction: {
                type: 'ElicitSlot',
                intentName: "ConversationStarter",
                slots: {
                    intention: null
                },
                slotToElicit: "intention",
            },
        };
    }
}

function close(sessionAttributes, fulfillmentState, text) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message: {
                contentType: "PlainText",
                content: text
            },
        },
    };
}

function dispatch(intentRequest, callback) {
    console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const sessionAttributes = intentRequest.sessionAttributes;
    const intention = intentRequest.currentIntent.slots.intention;
    
    console.log("intention: ", intention);
    
    if (intention === null) {
        callback(elicitIntention(sessionAttributes));
    } else if (intention.toLowerCase().indexOf("question") !== -1) {
        callback(close(sessionAttributes, "Fulfilled", "OK. What questions do you have?"))
    } else if (intention.toLowerCase().indexOf("buy") !== -1) {
        callback(close(sessionAttributes, "Fulfilled", "Cool, What kind of cars do you have in your mind?"))
    } else {
        callback(elicitIntention(sessionAttributes, "Do you have a question or you'd like to buy a car?"));
    }
    
}



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