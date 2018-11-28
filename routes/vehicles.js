const express = require('express');
let router = express.Router();
const db = require('./db').db;

router.post('/create', async function(req, res, next){
    let fleetId;
    if(req.manager.super===null || req.manager.super===false) {
        fleetId = req.body.fleetId;
    }else{fleetId = req.manager.fleetId;}
    let vehicle = db.vehicles.build({name: req.body.name, fleetId: fleetId}), fleet;
    vehicle.validate()
        .catch(errors=> {
            return next({errors: errors});
        });
    await db.fleets.findById(fleetId)
        .then((res)=> fleet = res);
    if (fleet === null) return next({message: "No such fleet",status: 403});
    db.vehicles.create(vehicle.dataValues)
        .then(vehicle => res.json(vehicle));
});

router.get('/readall', preFleet, readAll);
router.get('/read/:id', preVechicle, read);
router.post('/update/:id', preVechicle, update);
router.post('/delete/:id', preVechicle, deleteItem);

async function preFleet(req, res, next){
    if(req.manager.super!==null && req.manager.super===true) {
        await db.vehicles.findAll()
            .then((res)=> req.dataPreProc = res||[]);
    }else{
        await db.vehicles.findAll({where:{fleetId: req.manager.fleetId}})
            .then((res)=> {req.dataPreProc = res||[]});
    }
    next();
}

async function preVechicle(req, res, next){
    let reqDBBody;
    if(req.manager.super===null || req.manager.super===false) {
        reqDBBody={where:{id: req.params.id, fleetId: req.manager.fleetId}};
    }else {reqDBBody={where: {id: req.params.id}};}
    await db.vehicles.findOne(reqDBBody)
        .then((res)=> req.dataPreProc = res);
    if (req.dataPreProc  === null) return next({message: "No such item",status: 403});
    next();
}


function read(req, res){
    res.json(req.dataPreProc);
}

function update(req, res){
    let vehicle = {name: req.body.name};
    db.vehicles.update(vehicle,
        {
            where:{
                id: req.params.id
            }
        })
        .then(() => res.json(vehicle));
}

function deleteItem(req, res){
    db.vehicles.destroy({
        where:{
            id: req.params.id,
            deletedAt: null
        }
    })
        .then(fleet => res.json(fleet));
}

function readAll(req, res){
    res.json(req.dataPreProc);
}

module.exports = router;