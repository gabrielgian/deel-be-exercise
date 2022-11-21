import { Op } from 'sequelize';
import { getProfile } from '../middleware/getProfile';

const MAX_DEPOSIT_AMOUNT_PERCENTAGE = 0.25;

const postDepositBalance = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');

  const { userId } = req.params;
  const client = await Profile.findOne({
    where: { id: userId, type: 'client' },
  });

  console.log('caddeeee', userId, client);

  if (!client) {
    res.status(404).json().end();
  }

  const { depositAmount } = req.body;
  const sumJobPrice = await Job.sum('price', {
    where: { paid: { [Op.not]: true } },
    include: {
      model: Contract,
      include: { model: Profile, as: 'Client', where: { id: client.id } },
      status: { [Op.not]: 'terminated' },
    },
  });

  const canDepositAmount = () => {
    if (!depositAmount || !parseFloat(depositAmount, 10)) {
      return false;
    }

    const maxDepositAmount = sumJobPrice * MAX_DEPOSIT_AMOUNT_PERCENTAGE;
    if (depositAmount > maxDepositAmount) {
      return false;
    }

    return true;
  };

  if (!canDepositAmount()) {
    res.status(403).json().end();
  }

  try {
    const newClient = await sequelize.transaction(async (transaction) => {
      const newBalance = client.balance + depositAmount;
      return await client.update({ balance: newBalance }, { transaction });
    });

    res.status(200).json(newClient).end();
  } catch (ex) {
    res.status(500).json().end();
  }
};

const contractRoutes = (app) => {
  app.post('/balances/deposit/:userId', getProfile, postDepositBalance);
};

export default contractRoutes;
