const config = require('./config.json');
const Promise = require('bluebird');
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const db = require('./db')(Sequelize, config);
const Op = Sequelize.Op;

module.exports = db;

async function main()
{
    await Promise.all([db.fleets.sync({force: false}), db.motions.sync({force: false}), db.vehicles.sync({force: false}),
                          db.managers.sync({force: false})]);
    const app = express();
    app.use('/api', require('./api/api'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static('public'));

    app.listen(3000, () =>
    {
        console.log('Example app listening on port 3000!');
    });
}

main();

