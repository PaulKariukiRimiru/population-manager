import helloRoutes from './location/routes';

const routes = [helloRoutes];

export default routes.reduce((allRoutes, moduleRoutes) => allRoutes.concat(moduleRoutes));
