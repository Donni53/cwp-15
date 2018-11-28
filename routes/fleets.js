const express = require('express');
let router = express.Router();
const db = require('./db').db;

router.get('/readall', function(req, res, next){
    if(req.manager.super!==null && req.manager.super===true){
        db.fleets.findAll()
            .then(fleets=> res.json(fleets));
    }else{next({message: 'No super manager',status: 403});}
});

router.post('/create', function (req, res, next){
    let fleet = db.fleets.build({name: req.body.name});
    fleet.validate()
        .then((result)=>{
        db.fleets.create(result.dataValues,
            {
                where:{
                    id: req.params.id
                }
            }).then(result => res.json(result))
        })
        .catch(errors=> {
            return next({errors: errors});
        })
});
router.get('/read', preRes, read);
router.post('/update/:id', checkSuperManager, update);
router.post('/delete/:id', checkSuperManager, deleteItem);

function checkSuperManager(req, res, next){
    if(req.manager.super!==null && req.manager.super===true){
        preRes(req, res, next);
    }else{
        next({message: 'error'});
    }
}

async function preRes(req, res, next){
    let fleetId;
    if(req.manager.super===null || req.manager.super===false){
        fleetId = req.manager.fleetId;
    }else{fleetId = req.params.id}
    await db.fleets.findOne({where:{id:fleetId}})
        .then((fleets)=> req.dataPreProc = fleets);
    if (req.dataPreProc === null) return next({message: "No such item",status: 403});
    return next();
}

function read(req, res){
    res.json(req.dataPreProc);
}

function update(req, res, next){
    let fleet = {name: req.body.name};
    db.fleets.update(fleet,
        {
            where:{
                id: req.params.id
            }
        }).then(() => res.json(fleet));
}

function deleteItem(req, res){
    db.fleets.destroy({
        where:{
            id: req.params.id,
            deletedAt: null
        }
    })
        .then(fleet => res.json(fleet));
}

module.exports = router;