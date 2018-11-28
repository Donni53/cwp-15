const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('./db').db;

router.post('/register', function(req, res, next){
    let manager = db.managers.build({password: req.body.password, email: req.body.email});
    manager.validate()
        .then(async (result)=>{
            await bcrypt.hash(manager.password, 10, function(err, encrypted) {
                db.managers.create({password: encrypted, email: manager.email})
                    .then(result => res.json(result))
                    .catch(errors=> {
                        return next({errors: errors});
                    });
            });

        })
});

router.post('/login', async function(req, res, next){
    let manager = await db.managers.find({where: {email: req.body.email}});
    if ((manager) && (bcrypt.compareSync(req.body.password, manager.password))) {
        console.log(manager.id);
        res.end(jwt.sign({
            id: manager.id,
            email: req.body.email
        }, "secret", {expiresIn: 60*5}));
    }else{
        next({err: 'Invalid email/password combination'});
    }
});

module.exports = router;