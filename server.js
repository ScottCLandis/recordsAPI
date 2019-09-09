var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

var dbConn = mysql.createConnection({
    host: "mysql.scottclandis.com",
    user: "vinylrecords",
    password: "Gordan24",
    database: "vinyl_records"
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// default route
app.get('/', function (req, res) {
    return res.send({
        error: false,
        message: 'hello'
    })
});
// connection configurations

// connect to database
dbConn.connect();


// Retrieve all users 
app.get('/records', function (req, res) {
    dbConn.query('SELECT * FROM records', function (error, results, fields) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: 'users list.'
        });
    });

});

//Add a new record
app.post('/records', function (req, res) {

    var records = [
        req.body.albumName,
        req.body.artistName,
        req.body.albumSize,


        ];
    console.log(records)
    // let dataEncoded = JSON.stringify(records);
    // console.log(dataEncoded)
    //    if (!records) {
    //        return res.status(400).send({
    //            error: true,
    //            message: 'Please provide record'
    //        }); 
    //    }

    dbConn.query("INSERT INTO records (albumName, artistName, albumSize) VALUES ( ? )", [records],
        function (error, results) {
            if (error) throw error;
            return res.send({
                error: false,
                data: results,
                message: 'New records has been created successfully.'
            });
        });
});


// set port
app.listen(process.env.PORT || 3000
    function () {
        console.log('Node app is running on port 3000');
    });

module.exports = app;
