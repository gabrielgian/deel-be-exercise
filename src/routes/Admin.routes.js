import { Op } from 'sequelize';
import { getProfile } from '../middleware/getProfile';

const getBestProfession = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');

  const { start, end } = req.query;

  if (!start || !end) {
    res.status(404).json().end();
  }

  const profession = await Job.findOne({
    attributes: ['Contract.Contractor.profession', [sequelize.fn('sum', sequelize.col('price')), 'sum_price']],
    include: {
      model: Contract,
      include: {
        model: Profile,
        as: 'Contractor',
      },
    },
    where: {
      paid: true,
      paymentDate: {
        [Op.gte]: start,
        [Op.lte]: end,
      },
    },
    group: 'Contract.Contractor.profession',
    order: [['sum_price', 'DESC']],
    limit: 1,
  });

  res.status(200).json({ profession: profession?.Contract?.Contractor?.profession }).end();
};

const getBestClients = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');

  const { start, end, limit = 2 } = req.query;

  if (!start || !end) {
    res.status(404).json().end();
  }

  const groupedJobsByClient = await Job.findAll({
    attributes: ['Contract.Client.*', [sequelize.fn('sum', sequelize.col('price')), 'sum_price']],
    include: {
      model: Contract,
      include: {
        model: Profile,
        as: 'Client',
      },
    },
    where: {
      paid: true,
      paymentDate: {
        [Op.gte]: start,
        [Op.lte]: end,
      },
    },
    group: 'Contract.Client.id',
    order: [['sum_price', 'DESC']],
    limit,
  });

  const clients = groupedJobsByClient.map((client) => client.Contract?.Client);

  res.status(200).json(clients).end();
};

const adminRoutes = (app) => {
  app.get('/admin/best-profession', getProfile, getBestProfession);
  app.get('/admin/best-clients', getProfile, getBestClients);
};

export default adminRoutes;
