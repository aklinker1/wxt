<script lang="ts" setup>
import useBlogDate from '../composables/useBlogDate';

const props = defineProps<{
  post: {
    title: string;
    description?: string;
    date: Date;
    url: string;
    authors: Array<{ name: string; github: string }>;
  };
}>();

const date = useBlogDate(() => props.post.date);
</script>

<template>
  <li class="blog-list-item">
    <a :href="post.url">
      <div class="vp-doc">
        <h3 class="title" v-html="post.title" />
        <p class="description" v-html="post.description" />
        <p class="meta">
          {{ post.authors.map((author) => author.name).join(', ') }}
          &bull;
          {{ date }}
        </p>
      </div>
    </a>
  </li>
</template>

<style scoped>
li {
  padding: 0;
  margin: 0;
}

p {
  margin: 0;
}
h3 {
  margin: 0;
  padding: 0;
  border: none;
}

li > a > div {
  display: flex;
  flex-direction: column;
  margin: 0 -16px;
  padding: 16px;
  border-radius: 16px;
}
li > a > div:hover {
  background: var(--vp-c-default);
}
li .title {
  color: var(--vp-c-text);
  margin-bottom: 12px;
}
li .description {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}
li .meta {
  font-weight: 400;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
