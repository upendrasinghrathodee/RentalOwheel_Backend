'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VehicleMaster extends Model {
    static associate(models) {
      // define association here
    }
  }
  VehicleMaster.init({
    model:{
      type :  DataTypes.STRING,
      allowNull : false
    },
    type: {
      type :  DataTypes.STRING,
      allowNull : false
    },
    image: {
      type :  DataTypes.STRING,
      allowNull : false
    },
    capacity_seats: {
      type : DataTypes.INTEGER
    },
    capacity_tons:  {
      type : DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'VehicleMaster',
  });
  return VehicleMaster;
};