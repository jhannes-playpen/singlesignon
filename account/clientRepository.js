const CLIENTS = {
    "c622ed63-30b6-4a77-b6af-71fefa4b5f64": {
        redirectUris: [
            "http://consumer.local:4000/token"
        ],
        clientSecrets: [
            "a0071e49-d6ef-4748-8abd-bf2fd45c6ab5"
        ]
    }
};


exports.get = function(clientId) {
    return CLIENTS[clientId.toLowerCase()];
};
