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

const postPayJob = async (req, res) => {
  try {
    const { Contract, Job, Profile } = req.app.get('models');
    const sequelize = req.app.get('sequelize');

    const { job_id: jobId } = req.params;
    const job = await Job.findOne({
      where: { id: jobId },
      include: {
        model: Contract,
        include: [
          { model: Profile, as: 'Client' },
          { model: Profile, as: 'Contractor' },
        ],
      },
    });

    if (!job) {
      return res.status(404).json().end();
    }

    const jobCanBePaid = () => {
      if (job.paid) {
        return false;
      }

      if (job.Contract.status === 'terminated') {
        return false;
      }

      if (job.price > job.Contract.Client.balance) {
        return false;
      }

      return true;
    };

    if (!jobCanBePaid()) {
      return res.status(403).json().end();
    }

    const paidJob = await sequelize.transaction(async (transaction) => {
      const newClientBalance = job.Contract.Client.balance - job.price;
      const newContractorBalance = job.Contract.Contractor + job.price;

      await job.Contract.Client.update({ balance: newClientBalance }, { transaction });
      await job.Contract.Contractor.update({ balance: newContractorBalance }, { transaction });
      return await job.update({ paid: true, paymentDate: new Date() }, { transaction });
    });

    res.status(200).json(paidJob).end();

  } catch (error) {
    
    res.status(500).json().end();
  
  }
};

const contractRoutes = (app) => {
  app.get('/jobs/unpaid', getProfile, getUnpaidJobs);
  app.post('/jobs/:job_id/pay', getProfile, postPayJob);
};

export default contractRoutes;
