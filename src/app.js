import express from 'express';
import bodyParser from 'body-parser';

import sequelize from './models';

import AdminRoutes from './routes/Admin.routes';
import ContractRoutes from './routes/Contract.routes';
import JobRoutes from './routes/Job.routes';
import ProfileRoutes from './routes/Profile.routes';

const app = express();
app.use(bodyParser.json());

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

AdminRoutes(app);
ContractRoutes(app);
JobRoutes(app);
ProfileRoutes(app);

module.exports = app;
