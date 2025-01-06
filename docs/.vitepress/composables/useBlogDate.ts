import { computed, toValue, MaybeRefOrGetter } from 'vue';

const MONTH_FORMATTER = new Intl.DateTimeFormat(
  globalThis?.navigator?.language,
  {
    month: 'long',
  },
);

export default function (date: MaybeRefOrGetter<Date | string>) {
  return computed(() => {
    const d = new Date(toValue(date));
    return `${MONTH_FORMATTER.format(d)} ${d.getDate()}, ${d.getFullYear()}`;
  });
}
