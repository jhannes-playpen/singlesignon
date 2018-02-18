const CLIENTS = {
    "c622ed63-30b6-4a77-b6af-71fefa4b5f64": {
        name: "consumer",
        redirectUris: [
            "http://consumer.local:4000/token"
        ],
        clientSecrets: [
            "a0071e49-d6ef-4748-8abd-bf2fd45c6ab5"
        ],
        ssoOrigin: "http://consumer.local:4000"
    },
    "87aeff1b-dd90-4ff6-929b-aa32220b3f9b": {
        name: "other",
        ssoOrigin: "http://other.local:4001"
    }
};


exports.get = function(clientId) {
    return CLIENTS[clientId.toLowerCase()];
};

exports.getOrigins = function() {
    let result = {};
    for (const clientId in CLIENTS) {
        const client = CLIENTS[clientId];
        result[client.name] = client.ssoOrigin;
    }
    return result;
}
