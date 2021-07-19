'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usergame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Usergame.init({

    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    userpwd: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usergame',
  });
  return Usergame;
};