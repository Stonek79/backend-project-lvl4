// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

/**
 * @param {Object} app
 */

export default (app) => ({
  /**
   * @param {String} name
   */
  route(name) {
    return app.reverse(name);
  },
  /**
   * @param {String} key
   */
  t(key) {
    return i18next.t(key);
  },
  /**
   * @param {Object} app
   */
  _,
  /**
   * @param {String} type
   */
  getAlertClass(type) {
    switch (type) {
      // case 'failure':
      //   return 'danger';
      case 'error':
        return 'danger';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        throw new Error(`Unknown flash type: '${type}'`);
    }
  },
  /**
   * @param {String} str
   */
  formatDate(str) {
    const date = new Date(str);
    return date.toLocaleString();
  },
});
