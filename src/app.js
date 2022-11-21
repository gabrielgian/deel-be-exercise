import express from 'express';
import bodyParser from 'body-parser';

import sequelize from './models';
import ContractRoutes from './routes/Contract.routes';

const app = express();
app.use(bodyParser.json());

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

ContractRoutes(app);

module.exports = app;
