import fastify from 'fastify';
import pointOfView from 'point-of-view';
import Pug from 'pug';
import path from 'path';
import fastifyStatic from 'fastify-static';
import i18next from 'i18next';
import ru from './locales/ru.js';
import webpackConfig from '../webpack.config.babel.js';

import getHelpers from './helpers/index.js';

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';
const isDevelopment = mode === 'development';

const setUpViews = (app) => {
  const { devServer } = webpackConfig;
  const devHost = `http://${devServer.host}:${devServer.port}`;
  const domain = isDevelopment ? devHost : '';
  const helpers = getHelpers(app);
  app.register(pointOfView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `${domain}/assets/${filename}`,
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = isProduction
    ? path.join(__dirname, '..', 'public')
    : path.join(__dirname, '..', 'dist', 'public');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setUpLocalization = () => {
  i18next.init({
    lng: 'ru',
    fallbackLng: 'en',
    debug: isDevelopment,
    resources: {
      ru,
    },
  });
};

export default () => {
  const app = fastify({
    logger: true,
  });

  setUpViews(app);
  setUpStaticAssets(app);
  setUpLocalization(app);

  app.get('/', (req, reply) => {
    reply.render('application');
  });

  return app;
};
