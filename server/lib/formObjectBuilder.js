// @ts-check

import _ from 'lodash';

/**
 * @param {Object} object
 * @param {Object} errors
 */
export const buildFromObj = (object, errors = {}) => ({
  init: false,
  name: 'authenticate',
  form: object,
  errors: _.groupBy(errors, 'path'),
});

/**
 * @param {Object} object
 * @param {Object} errors
 */
export const buildFromModel = (object, errors = {}) => ({
  init: true,
  name: 'authenticate',
  form: Object.keys(object).reduce((acc, field) => ({ ...acc, [field]: '' }), {}),
  errors,
});
