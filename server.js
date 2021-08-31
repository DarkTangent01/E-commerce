const express = require('express');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const cors = require('cors');
const bodyparser = require('body-parser');
const httpLogger = require('./httpLogger/httplogger');
const fs = require('fs');
const app = express();
const connectDB = require('./config/db');


// HTTPS Private key and certificate
const PrivateKey = fs.readFileSync('certificates/key.pem', 'utf8');
const certificate = fs.readFileSync('certificates/cert.pem', 'utf8');
const credentials = {key: PrivateKey, cert: certificate};


require('dotenv').config({
    path: './config/index.env'
});

// MongoDB
connectDB();

// app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(httpLogger);

// routes
app.use('/api/user', require('./routes/authroute'));
app.use('/api/category', require('./routes/categoryroute'));
app.use('/api/product', require('./routes/productroute'));
app.use('/api/products', require('./routes/allProduct.route'));

app.get('/', (req, res) => {
    res.send("Project is under development......");
});


// page not found
app.use((req, res) => {
    res.status(404).json({
        msg: "page not found"
    });
});

const PORT = process.env.PORT;
const SSL_PORT = process.env.SSL_PORT;
const IP_ADDRESS = process.env.IP_ADDRESS;

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);


httpServer.listen(PORT, () => {
    console.log(`Server is running on http://${IP_ADDRESS}:${PORT}/`);
});

httpsServer.listen(SSL_PORT, () => {
    console.log(`Server is running on https://${IP_ADDRESS}:${SSL_PORT}/`);
});