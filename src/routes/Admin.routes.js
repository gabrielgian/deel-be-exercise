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

const adminRoutes = (app) => {
  app.get('/admin/best-profession', getProfile, getBestProfession);
};

export default adminRoutes;
