'use strict';
module.exports = (sequelize, DataTypes) => {
  var Client = sequelize.define('Client', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  Client.associate = function(models) {
    Client.hasMany(models.Incident,{
      foreignKey: 'clientId',
      onDelete: 'CASCADE',
    });
  };
  return Client;
};