import { Op } from 'sequelize';
import { getProfile } from '../middleware/getProfile';

const getContractById = async (req, res) => {
  const { Contract, Profile } = req.app.get('models');

  const { id } = req.params;
  const profile = req.profile;

  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ '$Client.id$': profile.id }, { '$Contractor.id$': profile.id }],
    },
    include: [
      { model: Profile, as: 'Client' },
      { model: Profile, as: 'Contractor' },
    ],
  });

  if (!contract) {
    return res.status(404).end();
  }

  res.status(200).json(contract).end();
};

const getContracts = async (req, res) => {
  const { Contract, Profile } = req.app.get('models');

  const profile = req.profile;

  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [{ '$Client.id$': profile.id }, { '$Contractor.id$': profile.id }],
      status: { [Op.not]: 'terminated' },
    },
    include: [
      { model: Profile, as: 'Client' },
      { model: Profile, as: 'Contractor' },
    ],
  });

  if (contracts.length === 0) {
    return res.status(404).end();
  }

  res.status(200).json(contracts).end();
};

const contractRoutes = (app) => {
  app.get('/contracts/:id', getProfile, getContractById);
  app.get('/contracts', getProfile, getContracts);
};

export default contractRoutes;
