const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db').db;
let router = express.Router();

function parseHeaders(headers){
    let authHeader = headers['authorization'];
    if(authHeader!==undefined){
        return authHeader.split(' ');
    }else{
        return null
    }
}

router.all('/*', function(req, res, next){
    let arr = parseHeaders(req.headers);
    if(arr===null){return next({message: 'No authorization header', status: 401});}
    jwt.verify(arr[1], 'secret', async function(err, info){
        if(info!==undefined) {
            await (db.managers.findOne({where: {id: info.id}}))
                .then((res) => {
                    if (res === undefined) {next({message: 'Not valid user'})}
                    req.manager = res.dataValues;
                    next();
                })
        }else{return next({message: 'Not valid user', status: 403});}
    });
});

module.exports = router;