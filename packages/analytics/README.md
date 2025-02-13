# WXT Analytics

Report analytics events from your web extension extension.

## Supported Analytics Providers

- [Google Analytics 4 (Measurement Protocol)](#google-analytics-4-measurement-protocol)
- [Umami](#umami)

## Install With WXT

1. Install the NPM package:
   ```bash
   pnpm i @wxt-dev/analytics
   ```
2. In your `wxt.config.ts`, add the WXT module:
   ```ts
   export default defineConfig({
     modules: ['@wxt-dev/analytics/module'],
   });
   ```
3. In your `<srcDir>/app.config.ts`, add a provider:

   ```ts
   // <srcDir>/app.config.ts
   import { umami } from '@wxt-dev/analytics/providers/umami';

   export default defineAppConfig({
     analytics: {
       debug: true,
       providers: [
         // ...
       ],
     },
   });
   ```

4. Then use the `#analytics` module to report events:

   ```ts
   import { analytics } from '#analytics';

   await analytics.track('some-event');
   await analytics.page();
   await analytics.identify('some-user-id');
   analytics.autoTrack(document.body);
   ```

## Install Without WXT

1. Install the NPM package:
   ```bash
   pnpm i @wxt-dev/analytics
   ```
2. Create an `analytics` instance:

   ```ts
   // utils/analytics.ts
   import { createAnalytics } from '@wxt-dev/analytics';

   export const analytics = createAnalytics({
     providers: [
       // ...
     ],
   });
   ```

3. Import your analytics module in the background to initialize the message listener:
   ```ts
   // background.ts
   import './utils/analytics';
   ```
4. Then use your `analytics` instance to report events:

   ```ts
   import { analytics } from './utils/analytics';

   await analytics.track('some-event');
   await analytics.page();
   await analytics.identify('some-user-id');
   analytics.autoTrack(document.body);
   ```

## Providers

### Google Analytics 4 (Measurement Protocol)

The [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4) is an alternative to GTag for reporting events to Google Analytics for MV3 extensions.

> [Why use the Measurement Protocol instead of GTag?](https://developer.chrome.com/docs/extensions/how-to/integrate/google-analytics-4#measurement-protocol)

Follow [Google's documentation](https://developer.chrome.com/docs/extensions/how-to/integrate/google-analytics-4#setup-credentials) to obtain your credentials and put them in your `.env` file:

```dotenv
WXT_GA_API_SECRET='...'
```

Then add the `googleAnalytics4` provider to your `<srcDir>/app.config.ts` file:

```ts
import { googleAnalytics4 } from '@wxt-dev/analytics/providers/google-analytics-4';

export default defineAppConfig({
  analytics: {
    providers: [
      googleAnalytics4({
        apiSecret: import.meta.env.WXT_GA_API_SECRET,
        measurementId: '...',
      }),
    ],
  },
});
```

### Umami

[Umami](https://umami.is/) is a privacy-first, open source analytics platform.

In Umami's dashboard, create a new website. The website's name and domain can be anything. Obviously, an extension doesn't have a domain, so make one up if you don't have one.

After the website has been created, save the website ID and domain to your `.env` file:

```dotenv
WXT_UMAMI_WEBSITE_ID='...'
WXT_UMAMI_DOMAIN='...'
```

Then add the `umami` provider to your `<srcDir>/app.config.ts` file:

```ts
import { umami } from '@wxt-dev/analytics/providers/umami';

export default defineAppConfig({
  analytics: {
    providers: [
      umami({
        apiUrl: 'https://<your-umami-instance>/api',
        websiteId: import.meta.env.WXT_UMAMI_WEBSITE_ID,
        domain: import.meta.env.WXT_UMAMI_DOMAIN,
      }),
    ],
  },
});
```

### Custom Provider

If your analytics platform is not supported, you can provide an implementation of the `AnalyticsProvider` type in your `app.config.ts` instead:

```ts
import { defineAnalyticsProvider } from '@wxt-dev/analytics/client';

interface CustomAnalyticsOptions {
  // ...
}

const customAnalytics = defineAnalyticsProvider<CustomAnalyticsOptions>(
  (analytics, analyticsConfig, providerOptions) => {
    // ...
  },
);

export default defineAppConfig({
  analytics: {
    providers: [
      customAnalytics({
        // ...
      }),
    ],
  },
});
```

Example `AnalyticsProvider` implementations can be found at [`./modules/analytics/providers`](https://github.com/wxt-dev/wxt/tree/main/packages/analytics/modules/analytics/providers).

## User Properties

User ID and properties are stored in `browser.storage.local`. To change this or customize where these values are stored, use the `userId` and `userProperties` config:

```ts
// app.config.ts
import { storage } from 'wxt/storage';

export default defineAppConfig({
  analytics: {
    userId: storage.defineItem('local:custom-user-id-key'),
    userProperties: storage.defineItem('local:custom-user-properties-key'),
  },
});
```

To set the values at runtime, use the `identify` function:

```ts
await analytics.identify(userId, userProperties);
```

Alternatively, a common pattern is to use a random string as the user ID. This keeps the actual user information private, while still providing useful metrics in your analytics platform. This can be done very easily using WXT's storage API:

```ts
// app.config.ts
import { storage } from 'wxt/storage';

export default defineAppConfig({
  analytics: {
    userId: storage.defineItem('local:custom-user-id-key', {
      init: () => crypto.randomUUID(),
    }),
  },
});
```

If you aren't using `wxt` or `@wxt-dev/storage`, you can define custom implementations for the `userId` and `userProperties` config:

```ts
const analytics = createAnalytics({
  userId: {
    getValue: () => ...,
    setValue: (userId) => ...,
  }
})
```

## Auto-track UI events

Call `analytics.autoTrack(container)` to automatically track UI events so you don't have to manually add them. Currently it:

- Tracks clicks to elements inside the `container`

In your extension's HTML pages, you'll want to call it with `document`:

```ts
analytics.autoTrack(document);
```

But in content scripts, you usually only care about interactions with your own UI:

```ts
const ui = createIntegratedUi({
  // ...
  onMount(container) {
    analytics.autoTrack(container);
  },
});
ui.mount();
```

## Enabling/Disabling

By default, **analytics is disabled**. You can configure how the value is stored (and change the default value) via the `enabled` config:

```ts
// app.config.ts
import { storage } from 'wxt/storage';

export default defineAppConfig({
  analytics: {
    enabled: storage.defineItem('local:analytics-enabled', {
      fallback: true,
    }),
  },
});
```

At runtime, you can call `setEnabled` to change the value:

```ts
analytics.setEnabled(true);
```
