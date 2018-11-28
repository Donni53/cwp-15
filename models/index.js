const Fleet = require('./fleets');
const Motion = require('./motions');
const Vehicle = require('./vehicles');
const Manager  = require('./manager');

module.exports = (Sequelize) => {
    const sequelize = new Sequelize('database', 'username', '',
        {
            host: 'localhost',
            dialect: 'sqlite',
            storage: './lab.sqlite'
        });
    sequelize
        .authenticate()
        .then(function() {
            console.log('Connected');
        })
        .catch(function (err) {
            console.log('Error:', err);
        });
    const fleets = Fleet(Sequelize, sequelize);
    const motions = Motion(Sequelize, sequelize);
    const vehicles = Vehicle(Sequelize, sequelize);
    const managers = Manager(Sequelize, sequelize);

    fleets.hasMany(vehicles, {foreignKey: "fleetId", sourceKey: "id"});
    vehicles.hasMany(motions, {foreignKey: "vehicleId", sourceKey: "id"});
    managers.hasOne(fleets, {foreignKey:"fleetId", sourceKey: "id"});

    return {
        fleets,
        motions,
        vehicles,
        managers,
        sequelize: sequelize,
        Sequelize: Sequelize,
    };
};