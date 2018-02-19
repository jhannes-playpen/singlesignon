module.exports = {
    "c622ed63-30b6-4a77-b6af-71fefa4b5f64": {
        name: "consumer",
        redirectUris: [
            "https://sso-jhannes-consumer.azurewebsites.net/token"
        ],
        clientSecrets: [
            "a0071e49-d6ef-4748-8abd-bf2fd45c6ab5"
        ],
        ssoOrigin: "https://sso-jhannes-consumer.azurewebsites.net"
    },
    "87aeff1b-dd90-4ff6-929b-aa32220b3f9b": {
        name: "other",
        ssoOrigin: "https://sso-jhannes-other.azurewebsites.net"
    },
    "96c9842a-78b8-43e8-bba8-11b9ebcd5660": {
        name: "master",
        ssoOrigin: "https://sso-jhannes-account.azurewebsites.net"
    }
};
