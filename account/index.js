

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')

const clientRepository = require("./clientRepository");

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: "sdgknsdlgndg", cookie: {}, resave: false, saveUninitialized: false}));

function encode(object) {
    // TODO: Run through crypto!
    return new Buffer(JSON.stringify(object)).toString('base64');
}

function decode(cyphertext) {
    // TODO: Run through crypto!
    return JSON.parse(Buffer.from(cyphertext, "base64"));
}

app.get('/users/me', (req, resp) => {
    resp.header('Access-Control-Allow-Origin', '*');
    resp.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    resp.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!req.session.user) {
        resp.sendStatus(401);
    } else {
        resp.send(req.session.user);        
    }
});

app.put('/users/me', (req, resp) => {
    req.session.user.fullname = req.body.fullname;
    resp.sendStatus(200);
});

app.post('/loginSession', (req, resp) => {
    const {client_id, redirect_uri} = req.body;

    let accessCode = null;
    if (client_id) {
        const client = clientRepository.get(client_id);
        if (!client) {
            return resp.status(400).send("Unknown client_id");
        }
        if (client.redirectUris.indexOf(redirect_uri) === -1) {
            return resp.status(400).send("Unknown redirect_uri");
        }
        accessCode = encode({username: req.body.username, client_id});
    }

    let {user} = req.session;
    if (!user) {
        user = req.session.user = {};
    }
    user.username = req.body.username;
    user.fullname = req.session.user.fullname || req.session.user.username.toUpperCase();
    resp.send({accessCode, user});
});

app.post("/oauth2/token", (req, res) => {
    const {client_id, redirect_uri, client_secret, code} = req.body;
    const client = clientRepository.get(client_id);
    if (!client) {
        return resp.status(401).send("Unknown client_id");
    }
    if (client.clientSecrets.indexOf(client_secret) === -1) {
        return resp.status(401).send("Invalid client_secret");        
    }
    if (client.redirectUris.indexOf(redirect_uri) === -1) {
        return resp.status(403).send("Unknown redirect_uri");
    }

    const codeValues = decode(code);
    if (codeValues.client_id !== client_id) {
        return res.status(400).send("Code issues to different client");        
    }

    const expires_in = 3600;
    const expire_time = new Date().getTime() + expires_in * 1000;
    res.send({access_token: encode({username: codeValues.username, client_id, expire_time}), expires_in});
});

app.delete("/loginSession", (req, resp) => {
    req.session.destroy();
    resp.sendStatus(200);
});

app.listen(3000, function() {
    console.log("Server started");
});
