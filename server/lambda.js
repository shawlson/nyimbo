'use strict';

const AWS = require("aws-sdk");
const doc = require('dynamodb-doc');

exports.handler = (event, context, callback) => {

    AWS.config.update({
        region: process.env.region,
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    })
  
    switch(event.request) {
        case 'host':
            createRoom(event.spotifyId, callback);
            break;
        case 'end':
            endRoom(event.spotifyId, callback);
            break;
        case 'join':
            joinRoom(event.spotifyId, event.pin, callback);
            break;
        case 'leave':
            leaveRoom(event.spotifyId, callback);
            break;
    }
};

function createRoom(spotifyId, callback) {

    const pin = Math.random().toString(36).substr(2, 5);
    
    const params = {
        TableName: 'room',
        Item: {
            "spotifyId": spotifyId,
            "pin": pin,
            "guestIds": [spotifyId]
        }
    };
    
    const dynamo = new doc.DynamoDB();

    console.log("Adding a new item...");
    dynamo.putItem(params, (err, data) => {
        if (err) {
            callback("Unable to add item", JSON.stringify(err, null, 2));
        } else {
            callback(null, pin);
        }
    });
}

function endRoom(spotifyId, callback) {

}

function joinRoom(spotifyId, pin, callback) {

}

function leaveRoom(spotifyId, callback) {

}
