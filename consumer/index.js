const express = require('express');
const bodyParser     = require('body-parser');
var session = require('express-session')

const app = express();


app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: "sdgknsdlgndg", cookie: {}, resave: false, saveUninitialized: false}));


const port = parseInt(process.argv[2] || 4000);

app.listen(port, function() {
    console.log("Server started on port " + port);
});
