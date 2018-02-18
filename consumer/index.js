const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')

const axios = require("axios");

const app = express();


app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: "sdgknsdlgndg", cookie: {}, resave: false, saveUninitialized: false}));

const login_url = "http://account.local:3000";
const redirect_uri = "http://consumer.local:4000/token";
const client_id = "c622ed63-30b6-4a77-b6af-71fefa4b5f64";
const client_secret = "a0071e49-d6ef-4748-8abd-bf2fd45c6ab5";
const sso_frame_url = `${login_url}/id.html?origin=consumer`;

app.get("/config.js", (req, res) => {
    res.setHeader('content-type', 'text/javascript');
    res.write("const config = " + JSON.stringify({login_url, client_id, redirect_uri, sso_frame_url}) + ";");
    res.end();
});

app.get("/token", (req, res) => {
    axios.post(login_url + "/oauth2/token", {
        grant_type: "authorization_code",
        redirect_uri,
        code: req.query.accessCode,
        client_id,
        client_secret
    }).then(resp => {
        req.session.access_token = resp.data.access_token;
        res.redirect("/");
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

app.get("/api/consumer/me", (req, res) => {
    const {access_token} = req.session;
    axios.get(login_url + "/users/me", {
        headers: { "Authorization": `Bearer ${access_token}` }
    }).then(resp => {
        res.send(resp.data);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

app.post("/api/consumer/me", (req, res) => {
    const {access_token} = req.session;
    axios.put(login_url + "/users/me", {
        fullname: req.body.fullname
    }, {
        headers: { "Authorization": `Bearer ${access_token}` },
    }).then(resp => {
        res.send(resp.data);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});


const port = parseInt(process.argv[2] || 4000);

app.listen(port, function() {
    console.log("Server started on port " + port);
});
