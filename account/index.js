const clientRepository = require("./clientRepository");

const qs = require("qs");

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: "sdgknsdlgndg", cookie: {}, resave: false, saveUninitialized: false}));

const allUsers = {};


function encode(object) {
    // TODO: Run through crypto!
    return new Buffer(JSON.stringify(object)).toString('base64');
}

function decode(cyphertext) {
    // TODO: Run through crypto!
    return JSON.parse(Buffer.from(cyphertext, "base64"));
}

app.get('/config.js', (req, res) => {
    const config = {
        ssoClientOrigins: clientRepository.getOrigins()
    };

    res.setHeader('content-type', 'text/javascript');
    res.write("const config = " + JSON.stringify(config) + ";");
    res.end();    
})

app.get('/users/me', (req, resp) => {
    resp.header('Access-Control-Allow-Origin', '*');
    resp.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    resp.header('Access-Control-Allow-Headers', 'Content-Type');

    const authorization = req.header("Authorization");

    if (authorization && authorization.startsWith("Bearer ")) {
        const access_token = decode(authorization.substr("Bearer ".length));
        const {username} = access_token;
        resp.send(allUsers[username]);
    } else if (req.session.username) {
        resp.send(allUsers[req.session.username]);
    } else {
        resp.sendStatus(401);
    }
});

app.put('/users/me', (req, resp) => {
    const authorization = req.header("Authorization");

    if (authorization && authorization.startsWith("Bearer ")) {
        const access_token = decode(authorization.substr("Bearer ".length));
        const {username} = access_token;
        allUsers[username].fullname = req.body.fullname;

        resp.sendStatus(200);    
    } else {
        const {username} = req.session;
        allUsers[username].fullname = req.body.fullname;
        resp.sendStatus(200);    
    }
});

app.post('/loginSession', (req, resp) => {
    const {client_id, redirect_uri, username} = req.body;

    let code = null;
    if (client_id) {
        const client = clientRepository.get(client_id);
        if (!client) {
            return resp.status(400).send("Unknown client_id");
        }
        if (client.redirectUris.indexOf(redirect_uri) === -1) {
            return resp.status(400).send("Unknown redirect_uri");
        }
        code = encode({username: req.body.username, client_id});
    }

    req.session.username = username;
    if (!allUsers[username]) {
        allUsers[username] = { username, fullname: username.toUpperCase() };
    }
    resp.send({code, user: allUsers[username]});
});

app.get("/oauth2/login", (req, res) => {
    const {client_id, redirect_uri, state} = req.query;

    const client = clientRepository.get(client_id);
    if (!client) {
        return res.status(400).send("Unknown client_id");
    }
    if (client.redirectUris.indexOf(redirect_uri) === -1) {
        return res.status(400).send("Unknown redirect_uri");
    }

    if (req.session.username) {
        const code = encode({username: req.session.username, client_id});
        return res.redirect(redirect_uri + "?" + qs.stringify({code, state}))
    } else {
        return res.redirect("/?" + qs.stringify({client_id, redirect_uri, state}));
    }
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
