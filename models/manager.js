const bcrypt =  require('bcryptjs');

module.exports = (Sequelize, sequelize) => {
    return sequelize.define('manager', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email:{
            type: Sequelize.STRING(100),
            validate:{
                isEmail: true
            },
            unique: true
        },
        password:{
            type: Sequelize.STRING(100)
        },
        fleetId:{
            type: Sequelize.INTEGER
        },
        super:{
            type: Sequelize.BOOLEAN,
            default: false
        }
    })
};