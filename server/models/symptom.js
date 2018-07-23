'use strict';
module.exports = (sequelize, DataTypes) => {
  var Symptom = sequelize.define('Symptom', {
    name: DataTypes.STRING
  }, {});
  Symptom.associate = function(models) {
    Symptom.hasMany(models.Incident,{
      foreignKey: 'symptomId',
      onDelete: 'CASCADE',
    });
  };
  return Symptom;
};