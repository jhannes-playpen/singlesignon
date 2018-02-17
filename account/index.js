

const express = require('express');
const bodyParser     = require('body-parser');
var session = require('express-session')

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: "sdgknsdlgndg", cookie: {}, resave: false, saveUninitialized: false}));


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
    if (!req.session.user) {
        req.session.user = {};
    }
    req.session.user.username = req.body.username;
    req.session.user.fullname = req.session.user.fullname || req.session.user.username.toUpperCase();
    resp.sendStatus(200);
});

app.delete("/loginSession", (req, resp) => {
    req.session.destroy();
    resp.sendStatus(200);
});

app.listen(3000, function() {
    console.log("Server started");
});
