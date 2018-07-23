'use strict';
module.exports = (sequelize, DataTypes) => {
  var Issue = sequelize.define('Issue', {
    name: DataTypes.STRING
  }, {});
  Issue.associate = function(models) {
    Issue.hasMany(models.Incident,{
      foreignKey: 'issueId',
      onDelete: 'CASCADE',
    });
  };
  return Issue;
};