require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routes
const smartPeriodicSell = require('./routes/smartPeriodicSell');
const smartSell = require('./routes/smartSell');

// Use Routes
app.use('/smartPeriodicSell', smartPeriodicSell)
app.use('/smartSell', smartSell)

module.exports = app;
