import DefaultTheme from 'vitepress/theme';
import Icon from '../components/Icon.vue';
import EntrypointPatterns from '../components/EntrypointPatterns.vue';
import UsingWxtSection from '../components/UsingWxtSection.vue';
import ExampleSearch from '../components/ExampleSearch.vue';
import BlogLayout from '../components/BlogLayout.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    ctx.app
      .component('Icon', Icon)
      .component('EntrypointPatterns', EntrypointPatterns)
      .component('UsingWxtSection', UsingWxtSection)
      .component('ExampleSearch', ExampleSearch)
      .component('blog', BlogLayout);
  },
};
