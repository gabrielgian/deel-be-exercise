import sequelize from './sequelize';

export { default as Contract } from './Contract.model';
export { default as Job } from './Job.model';
export { default as Profile } from './Profile.model';

(function () {
  const { Contract, Job, Profile } = sequelize.models;

  console.log(Contract, Job, Profile);

  Contract.belongsTo(Profile, { as: 'Contractor' });
  Contract.belongsTo(Profile, { as: 'Client' });
  Contract.hasMany(Job);

  Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
  Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });

  Job.belongsTo(Contract);
})();

export default sequelize;
