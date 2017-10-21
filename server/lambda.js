'use strict';

const AWS = require('aws-sdk');
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
            leaveRoom(event.spotifyId, event.pin, callback);
            break;
    }
};

function createRoom(spotifyId, callback) {

    const pin = Math.random().toString(36).substr(2, 5);
    
    const params = {
        TableName: 'room',
        Item: {
            'spotifyId': spotifyId,
            'pin': pin,
            'guestIds': [spotifyId]
        }
    };
    
    const dynamo = new doc.DynamoDB();

    dynamo.putItem(params, (err, data) => {
        if (err) {
            callback('Unable to add item', JSON.stringify(err, null, 2));
        } else {
            callback(null, pin);
        }
    });
}

function endRoom(spotifyId, pin, callback) {
    
    const params = {
        TableName: 'room',
        Key: { 'pin': pin }
    };
    
    
    const dynamo = new doc.DynamoDB();
    dynamo.deleteItem(params, (err, data) => {
        if (err) {
            callback("Unable to end the room", JSON.stringify(err, null, 2));
        } else {
            callback(null, "Success");
        }
    });

}

function joinRoom(spotifyId, pin, callback) {
    
    const params = {
        TableName: 'room',
        Key: { 'pin': pin },
        UpdateExpression: 'set guestIds = list_append(guestIds, :id)',
        ExpressionAttributeValues: {
            ':id': [spotifyId]
        }
    }

    const dynamo = new doc.DynamoDB();
    dynamo.updateItem(params, (err, data) => {
        if (err) {
            callback('Unable to join room', JSON.stringify(err, null, 2));
        } else {
            callback(null, 'Success');
        }
    });

}

function leaveRoom(spotifyId, callback) {

}
