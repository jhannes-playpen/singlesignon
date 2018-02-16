const express = require('express');
const bodyParser     = require('body-parser');
var session = require('express-session')

const app = express();


app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: "sdgknsdlgndg", cookie: {}, resave: false, saveUninitialized: false}));


app.get('/users/me', (req, resp) => {
    if (!req.session.user) {
        resp.send({name: "Stranger"});
    } else {
        resp.send(req.session.user);        
    }
});

app.post('/users/me', (req, resp) => {
    if (!req.session.user) {
        req.session.user = {};
    }
    req.session.user.name = req.body.name;
    resp.sendStatus(200);
});

app.listen(4000, function() {
    console.log("Server started");
});
