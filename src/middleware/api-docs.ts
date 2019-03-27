import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import prodSwaggerDocument from '../config/prod-swagger.json';
import swaggerDocument from '../config/swagger.json';

const { NODE_ENV } = process.env;

export const handleAPIDocs = (router: Router) =>
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(NODE_ENV === 'development'
  ? swaggerDocument
  : prodSwaggerDocument,
));
