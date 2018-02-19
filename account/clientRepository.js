const CLIENTS = {
    "96c9842a-78b8-43e8-bba8-11b9ebcd5660": {
        name: "master",
        ssoOrigin: "http://account.local:3000"
    }
};

let clients;
try {
    clients = require("./settings.clients." + process.env.PROFILE);
} catch (ex) {
    clients = CLIENTS;
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
