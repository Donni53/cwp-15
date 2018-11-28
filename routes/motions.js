const express = require('express');
let router = express.Router();
const db = require('./db').db;
const geolib =require('geolib');

router.get('/milage/:id', preProc, getPathLength);

async function preProc(req, res, next){
    if(req.manager.super===null || req.manager.super===false) {
        reqDBBody={id: req.params.id, fleetId: req.manager.fleetId};
    }else {reqDBBody= {id: req.params.id};}
    await db.vehicles.findOne({
        where: reqDBBody,
        include: [
            {model: db.motions}
        ]
    })
        .then((res)=> req.dataPreProc = res);
    if (req.dataPreProc  === null) return next({message: "No motions", status: 403});
    next();
}

function getPathLength(req, res){
    let vMotions = [];
    req.dataPreProc.motions.forEach(function(element){
        vMotions.push(element.latLng);
    });
   res.json({pathLength: (geolib.getPathLength(vMotions))});
}
module.exports = router;