const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const hbs = require('express-hbs');
const validator = require('express-validator');
const app = express();
const helpers = require('./helpers');
app.engine('hbs',hbs.express4({
    partialsDir : [`${__dirname}/views/partials`],
    defaultLayout : `${__dirname}/views/index.hbs`
}));
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

helpers.registerHelpers(hbs);
app.use(logger('dev'));
app.use(validator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
require('./server/routes')(app);

module.exports = app;