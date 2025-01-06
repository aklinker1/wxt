import { defineContentScript } from '../../../../../utils/define-content-script';
import { faker } from '@faker-js/faker';

export default defineContentScript({
  matches: [faker.string.nanoid()],
  main() {},
});
