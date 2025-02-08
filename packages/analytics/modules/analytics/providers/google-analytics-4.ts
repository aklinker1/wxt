import { defineAnalyticsProvider } from '../client';
import type { BaseAnalyticsEvent } from '../types';

const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;

export interface GoogleAnalytics4ProviderOptions {
  apiSecret: string;
  measurementId: string;
}

export const googleAnalytics4 =
  defineAnalyticsProvider<GoogleAnalytics4ProviderOptions>(
    (_, config, options) => {
      const send = async (
        data: BaseAnalyticsEvent,
        eventName: string,
        eventProperties: Record<string, string | undefined> | undefined,
      ): Promise<void> => {
        const url = new URL(
          config?.debug ? '/debug/mp/collect' : '/mp/collect',
          'https://www.google-analytics.com',
        );
        if (options.apiSecret)
          url.searchParams.set('api_secret', options.apiSecret);
        if (options.measurementId)
          url.searchParams.set('measurement_id', options.measurementId);

        const userProperties = {
          language: data.meta.language,
          screen: data.meta.screen,
          ...data.user.properties,
        };
        const mappedUserProperties = Object.fromEntries(
          Object.entries(userProperties).map(([name, value]) => [
            name,
            value == null ? undefined : { value },
          ]),
        );

        await fetch(url.href, {
          method: 'POST',
          body: JSON.stringify({
            client_id: data.user.id,
            consent: {
              ad_user_data: 'DENIED',
              ad_personalization: 'DENIED',
            },
            user_properties: mappedUserProperties,
            events: [
              {
                name: eventName,
                params: {
                  session_id: data.meta.sessionId,
                  engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
                  ...eventProperties,
                },
              },
            ],
          }),
        });
      };

      return {
        identify: () => Promise.resolve(), // No-op, user data uploaded in page/track
        page: (event) =>
          send(event, 'page_view', {
            page_title: event.page.title,
            page_location: event.page.location,
          }),
        track: (event) => send(event, event.event.name, event.event.properties),
      };
    },
  );
