const opcua = require('node-opcua');
const async = require('async');
const colors = require('colors');

const client = new opcua.OPCUAClient();
const endpointUrl = 'opc.tcp://14.37.152.185:4840';

let the_subscription, the_session;

async.series([
    function(callback) {
    client.connect(endpointUrl, (err) => {
        if (err) {
            console.log('cannot connect to endpoint:', endpointUrl);
        } else {
            console.log('connected !');
        }
        callback(err);
    });
    },
    function(callback) {
    client.createSession(null, (err, session) => {
        if (!err) {
            the_session = session;
        }
        callback(err);
    });
    },
    function(callback) {
        const browsePath = [
            opcua.makeBrowsePath("RootFolder", "/Objects/Server.ServerStatus.BuildInfo.ProductName"),
        ];

        let productNameNodeId;
        the_session.translateBrowsePath(browsePath, function (err, results) {
            if (!err) {
                console.log(results[0].value.toString());
                productNameNodeId = results[0].targets[0].targetId;
            }
        });

    /*the_subscription = new opcua.ClientSubscription(this_session, {
        requestedPublishingInterval: 2000,
        requestedMaxKeepAliveCount: 2000,
        requestedLifetimeCount: 6000,
        maxNotificationsPerPublish: 1000,
        publishingEnabled: true,
        priority: 10
    });
    the_subscription.on('started', () => {
        console.log('subscription started');
        callback();
    }).on('keepalive', () => {
        console.log('keepalive');
    }).on('terminated', () => {
        console.log('TERMINATED ----------------------->')
    });
    const monitoredItem = the_subscription.monitor({
        nodeId: ,
        attributeId: 13
    }, {
        samplingInterval: 100,
        discardOldest: true,
        queueSize: 100
    });
    monitoredItem.on('changed', (dataValue) => {
        console.log(dataValue.value.value.toString());
    });*/
    },
    function(callback) {
    the_session.close((err) => {
        if (err) {
            console.log('session closed error');
        }
        callback();
    });
    }
    ], (err) => {
    if (err) {
        console.log('failure', err);
    } else {
        console.log('done!');
    }
    client.disconnect(() => {});
});