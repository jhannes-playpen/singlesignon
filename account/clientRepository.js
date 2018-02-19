let clients;
try {
    clients = require("./settings.clients." + process.env.PROFILE);
} catch (ex) {
    clients = require("./settings.clients.local");
}


exports.get = function(clientId) {
    return clients[clientId.toLowerCase()];
};

exports.getOrigins = function() {
    let result = {};
    for (const clientId in clients) {
        const client = clients[clientId];
        result[client.name] = client.ssoOrigin;
    }
    return result;
}
