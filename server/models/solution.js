'use strict';
module.exports = (sequelize, DataTypes) => {
  var Solution = sequelize.define('Solution', {
    name: DataTypes.STRING
  }, {});
  Solution.associate = function(models) {
    Solution.hasMany(models.Incident,{
      foreignKey: 'solutionId',
      onDelete: 'CASCADE',
    });
  };
  return Solution;
};