'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicles extends Model {
    static associate(models) {
      Vehicles.belongsTo(models.User,{
        foreignKey: "provider" , as : "user"
       })
       Vehicles.belongsTo(models.VehicleMaster,{
        foreignKey: "master" , as : "veh_master"
       })
    }
  }
  Vehicles.init({
    reg_number: {
      type  : DataTypes.STRING,
      allowNull : false
    },
    ispuc: {
      type  : DataTypes.BOOLEAN
    },
    isinsurance: {
      type  : DataTypes.BOOLEAN
    },
    fuel_type: {
      type  : DataTypes.STRING,
      allowNull : false
    },
    price_km: {
      type  : DataTypes.FLOAT
    },
    price_days: {
      type  : DataTypes.FLOAT
    },
    images:{
       type:DataTypes.STRING,
       allowNull:false
    },
    ac_charges: {
      type  : DataTypes.INTEGER,
    },
    status: {
      type  : DataTypes.BOOLEAN,
      allowNull : false
    },
  }, {
    sequelize,
    modelName: 'Vehicles',
  });
  return Vehicles;
};