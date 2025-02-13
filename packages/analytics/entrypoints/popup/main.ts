import { analytics } from '#analytics';

declare const enabledCheckbox: HTMLInputElement;

analytics.autoTrack(document);

enabledCheckbox.oninput = () => {
  void analytics.setEnabled(enabledCheckbox.checked);
};
