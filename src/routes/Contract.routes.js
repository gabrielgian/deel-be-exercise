import { getProfile } from '../middleware/getProfile';

const getContractById = async (req, res) => {
  console.log(123);
  const { Contract, Profile } = req.app.get('models');

  const { id } = req.params;
  const profile = req.profile;

  const contract = await Contract.findOne({
    where: { id },
    include: [
      {
        model: Profile,
        as: 'Client',
      },
      {
        model: Profile,
        as: 'Contractor',
      },
    ],
  });

  if (!contract) {
    return res.status(404).end();
  }

  if (contract.Client?.id !== profile.id && contract.Contractor?.id !== profile.id) {
    return res.status(403).end();
  }

  res.status(200).json(contract).end();
};

const contractRoutes = (app) => {
  app.get('/contracts/:id', getProfile, getContractById);
};

export default contractRoutes;
