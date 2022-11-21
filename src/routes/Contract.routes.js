import { getProfile } from '../middleware/getProfile';

const getContractById = async (req, res) => {
  const { Contract, Profile } = req.app.get('models');

  const { id } = req.params;
  const profile = req.profile;

  const contract = await Contract.findOne({
    where: { id },
    include: {
      model: Profile,
      where: {
        id: profile.id,
      },
    },
  });

  if (!contract) {
    return res.status(404).end();
  }

  res.json(contract);
};

const contractRoutes = (app) => {
  app.get('/contracts/:id', getProfile, getContractById);
};

export default contractRoutes;
