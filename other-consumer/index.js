const express = require('express');
const bodyParser     = require('body-parser');
var session = require('express-session')

const app = express();


app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: "sdgknsdlsdgsggndg", cookie: {}, resave: false, saveUninitialized: false}));


const login_url = "http://account.local:3000";
const sso_frame_url = `${login_url}/id.html?origin=other`;

app.get("/config.js", (req, res) => {
    res.setHeader('content-type', 'text/javascript');
    res.write("const config = " + JSON.stringify({sso_frame_url}) + ";");
    res.end();
});

const port = parseInt(process.argv[2] || 4001);

app.listen(port, function() {
    console.log("Server started on port " + port);
});
