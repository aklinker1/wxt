/**
 * @type {import('@commitlint/types').UserConfig}
 */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [
      0,
      'always',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
  },
};

module.exports = config;
