'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceProvider extends Model {
    static associate(models) {
       ServiceProvider.belongsTo(models.User,{
        foreignKey: "user" , as : "service_Provider_Details"
       })
    }
  }
  ServiceProvider.init({
    company_name: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty:true,
        notNull:true
      }
    },
    address: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty:true,
        notNull:true
      }
    },
    contact: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty:true,
        notNull:true,
        len:[10,10]
      }
    },
    reg_number: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty:true,
        notNull:true
      }
    },
    contact_person: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty:true,
        notNull:true
      }
    },
    geo_lat: {
      type  :DataTypes.FLOAT
    },
    geo_lng: {
      type  :DataTypes.FLOAT
    },
    rating: {
      type  :DataTypes.FLOAT
    },
  }, {
    sequelize,
    modelName: 'ServiceProvider',
  });
  return ServiceProvider;
};