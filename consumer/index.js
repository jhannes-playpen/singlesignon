const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')

const axios = require("axios");

const app = express();


app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: "sdgknsdlgndg", cookie: {}, resave: false, saveUninitialized: false}));


const redirect_uri = "http://consumer.local:4000/token";
const client_id = "c622ed63-30b6-4a77-b6af-71fefa4b5f64";
const client_secret = "a0071e49-d6ef-4748-8abd-bf2fd45c6ab5";


app.get("/token", (req, res) => {
    axios.post("http://account.local:3000/oauth2/token", {
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

const port = parseInt(process.argv[2] || 4000);

app.listen(port, function() {
    console.log("Server started on port " + port);
});
