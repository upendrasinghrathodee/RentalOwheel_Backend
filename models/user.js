'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.ServiceProvider,{
        foreignKey: "user" , as : "sp"
       })
       User.hasMany(models.Vehicles,{
         foreignKey:"provider",as:"vehicles"
       })
    }
  }
  User.init({
    name: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty:true,
        notNull:true
      }
    },
    phone: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty:true,
        notNull:true,
        len:[10,10]
      }
    },
    email:{
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty:true,
        notNull:true,
        isEmail:true
      }
    },
    password:{
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty:true,
        notNull:true
      }
    },
    role: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty:true,
        notNull:true
      }
    },
    status: {
      type : DataTypes.BOOLEAN,
      allowNull : false,
      validate:{
        notEmpty:true,
        notNull:true
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};