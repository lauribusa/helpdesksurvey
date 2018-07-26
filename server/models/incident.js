'use strict';
module.exports = (sequelize, DataTypes) => {
  var Incident = sequelize.define('Incident', {
    time: DataTypes.STRING,
  }, {});
  Incident.associate = function(models) {
    Incident.belongsTo(models.Client,{
      foreignKey: 'clientId',
      as: 'clients'
    })
    Incident.belongsTo(models.Solution,{
      foreignKey: 'solutionId',
      as: 'solutions',
    }),
    Incident.belongsTo(models.Issue,{
      foreignKey: 'issueId',
      as: 'issues',
    }),
    Incident.belongsTo(models.Symptom, {
      foreignKey: 'symptomId',
      as: 'symptoms',
    })
  };
  return Incident;
};