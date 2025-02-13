/**
 * @type {import('@commitlint/types').UserConfig}
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [
      0,
      'always',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
  },
};
