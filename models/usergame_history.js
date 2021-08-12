'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usergame_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Usergame_history.init({
    roomno : DataTypes.STRING,
    user1 : DataTypes.STRING,
    choice1 : DataTypes.STRING,
    user2: DataTypes.STRING,
    choice2: DataTypes.STRING,
    result:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usergame_history',
  });
  return Usergame_history;
};