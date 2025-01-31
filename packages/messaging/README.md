# WXT Messaging

Allows sending and receiving messages between different contexts in a Web Extension.

## Usage

Install the package:

```sh
npm i --save-dev @wxt-dev/messaging
pnpm i -D @wxt-dev/messaging
yarn add --dev @wxt-dev/messaging
bun i -D @wxt-dev/messaging
```

util/counter.ts

```ts
import { registerRpcService } from '@wxt-dev/messaging';

export class CounterService {
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }

  getCount() {
    return this.count;
  }
}
```

### background.ts

```ts
import { CounterService } from './util/counter.js';
import { registerRpcService } from '@wxt-dev/messaging';

export default defineBackground(() => {
  registerRpcService('counter', new CounterService());
});
```

### content.ts

```ts
import type { CounterService } from './util/counter.js';
import { createMessageBridge } from '@wxt-dev/messaging';

export default defineContentScript({
  matches: ['*://*/*'],
  async main() {
    const counter = createRpcProxy<CounterService>('counter');

    await counter.increment();
    console.log(await counter.getCount());
  },
});
```
