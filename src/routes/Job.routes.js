import { Op } from 'sequelize';
import { getProfile } from '../middleware/getProfile';

const getUnpaidJobs = async (req, res) => {
  const { Contract, Profile, Job } = req.app.get('models');

  const profile = req.profile;

  const jobs = await Job.findAll({
    where: {
      [Op.or]: [{ '$Contract->Client.id$': profile.id }, { '$Contract->Contractor.id$': profile.id }],
      '$Contract.status$': 'in_progress',
      paid: { [Op.not]: true },
    },
    include: {
      model: Contract,
      include: [
        { model: Profile, as: 'Client' },
        { model: Profile, as: 'Contractor' },
      ],
    },
  });

  if (jobs.length === 0) {
    return res.status(404).json(jobs).end();
  }

  res.status(200).json(jobs).end();
};

const contractRoutes = (app) => {
  app.get('/jobs/unpaid', getProfile, getUnpaidJobs);
};

export default contractRoutes;
