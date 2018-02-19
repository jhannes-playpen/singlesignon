const qs = require("qs");
const uuid = require('uuid');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const axios = require("axios");

const app = express();

// TODO
// 401 - missing access token
// 401 - session expired/invalid


app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: "sdgknsdlgndg", cookie: {}, resave: false, saveUninitialized: false}));

let settings;
try {
    settings = require("./settings." + process.env.PROFILE);
    console.log("read config for " + process.env.PROFILE);
} catch (ex) {
    settings = {
        login_url: "http://account.local:3000",
        redirect_uri: "http://consumer.local:4000/token",
        client_id: "c622ed63-30b6-4a77-b6af-71fefa4b5f64",
        client_secret: "a0071e49-d6ef-4748-8abd-bf2fd45c6ab5",
    };
    console.log("using default profile");
}

const {login_url, redirect_uri, client_id, client_secret} = settings;
const sso_frame_url = `${login_url}/id.html?origin=consumer`

app.get("/config.js", (req, res) => {
    res.setHeader('content-type', 'text/javascript');
    res.write("const config = " + JSON.stringify({login_url, client_id, redirect_uri, sso_frame_url}) + ";");
    res.end();
});

app.get("/login", (req, res) => {
    const state = uuid();
    res.cookie("redirect_after_login", req.get("Referrer"));
    res.cookie("oauth2_state", state);
    res.redirect(login_url + "/oauth2/login?" + qs.stringify({redirect_uri, client_id, state}));
});

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
});

app.get("/token", (req, res) => {
    if (req.query.state !== req.cookies.oauth2_state) {
        return res.status(400).send("State mismatch");
    }

    const redirect = req.cookies.redirect_after_login || "/";
    axios.post(login_url + "/oauth2/token", {
        grant_type: "authorization_code",
        redirect_uri,
        code: req.query.code,
        client_id,
        client_secret
    }).then(resp => {
        req.session.regenerate(err => {});
        req.session.access_token = resp.data.access_token;
        res.clearCookie('oauth2_state');
        res.clearCookie('redirect_after_login');
        res.redirect(redirect);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

app.get("/api/consumer/me", (req, res) => {
    const {access_token} = req.session;

    if (!access_token) {
        return res.sendStatus(401);
    }

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

    if (!access_token) {
        return res.sendStatus(401);
    }

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
