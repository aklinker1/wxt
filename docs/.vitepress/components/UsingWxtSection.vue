<script lang="ts" setup>
import { computed } from 'vue';
import useListExtensionDetails, {
  ChromeExtension,
} from '../composables/useListExtensionDetails';

// Add extension IDs here. Order doesn't matter, will be sorted by a combination of weekly active users and rating.
// Change the commit message or PR title to: "docs: Added "[extension name]" to the homepage"
const chromeExtensionIds = [
  'ocfdgncpifmegplaglcnglhioflaimkd', // GitHub: Better Line Counts
  'mgmdkjcljneegjfajchedjpdhbadklcf', // Anime Skip Player
  'bfbnagnphiehemkdgmmficmjfddgfhpl', // UltraWideo
  'elfaihghhjjoknimpccccmkioofjjfkf', // StayFree - Website Blocker & Web Analytics
  'okifoaikfmpfcamplcfjkpdnhfodpkil', // Doozy: Ai Made Easy
  'lknmjhcajhfbbglglccadlfdjbaiifig', // tl;dv - Record, Transcribe & ChatGPT for Google Meet
  'oglffgiaiekgeicdgkdlnlkhliajdlja', // Youtube中文配音
  'agjnjboanicjcpenljmaaigopkgdnihi', // PreMiD
  'aiakblgmlabokilgljkglggnpflljdgp', // Markdown Sticky Notes
  'nomnkbngkijpffepcgbbofhcnafpkiep', // DocVersionRedirector
  'ceicccfeikoipigeghddpocceifjelph', // Plex Skipper
  'aelkipgppclpfimeamgmlonimflbhlgf', // GitHub Custom Notifier
  'djnlaiohfaaifbibleebjggkghlmcpcj', // Fluent Read
  'nhclljcpfmmaiojbhhnkpjcfmacfcian', // Facebook Video Controls
  'mblkhbaakhbhiimkbcnmeciblfhmafna', // ElemSnap - Quick capture of webpage elements and conversion to images,
  'oajalfneblkfiejoadecnmodfpnaeblh', // MS Edge TTS (Text to Speech)
  'nedcanggplmbbgmlpcjiafgjcpdimpea', // YTBlock - Block any content from YouTube™
  'oadbjpccljkplmhnjekgjamejnbadlne', // demo.fun - Interactive product demos that convert
  'iopdafdcollfgaoffingmahpffckmjni', // SmartEReply: Elevate Your LinkedIn™ Engagement with AI 🚀📈
  'khjdmjcmpolknpccmaaipmidphjokhdf', // WorkFlowy MultiFlow
  'fencadnndhdeggodopebjgdfdlhcimfk', // 香草布丁🌿🍮- https://github.com/Xdy1579883916/vanilla-pudding
  'bnacincmbaknlbegecpioobkfgejlojp', // MaxFocus: Link Preview
  'bcpgdpedphodjcjlminjbdeejccjbimp', // 汇率转换-中文版本
  'loeilaonggnalkaiiaepbegccilkmjjp', // Currency Converter Plus
  'npcnninnjghigjfiecefheeibomjpkak', // Respond Easy
  'cfkdcideecefncbglkhneoflfnmhoicc', // mindful - stay focused on your goals
  'lnhejcpclabmbgpiiomjbhalblnnbffg', // 1Proompt
  'fonflmjnjbkigocpoommgmhljdpljain', // NiceTab - https://github.com/web-dahuyou/NiceTab
  'fcffekbnfcfdemeekijbbmgmkognnmkd', // Draftly for LinkedIn
  'nkndldfehcidpejfkokbeghpnlbppdmo', // YouTube Summarized - Summarize any YouTube video
  'dbichmdlbjdeplpkhcejgkakobjbjalc', // 社媒助手 - https://github.com/iszhouhua/social-media-copilot
  'opepfpjeogkbgeigkbepobceinnfmjdd', // Dofollow Links for SEO
  'pdnenlnelpdomajfejgapbdpmjkfpjkp', // ChatGPT Writer: Use AI on Any Site (GPT-4o, Claude, Gemini, and More)
  'jobnhifpphkgoelnhnopgkdhbdkiadmj', // discord message translator
  'ncokhechhpjgjonhjnlaneglmdkfkcbj', // Habit Tracker app widget for daily habit tracking
  'lnjaiaapbakfhlbjenjkhffcdpoompki', // Catppuccin for GitHub File Explorer Icons
  'cpaedhbidlpnbdfegakhiamfpndhjpgf', // WebChat: Chat with anyone on any website
  'fcphghnknhkimeagdglkljinmpbagone', // YouTube Auto HD + FPS
  'lpomjgbicdemjkgmbnkjncgdebogkhlb', // MultiViewer Companion
  'ggiafipgeeaaahnjamgpjcgkdpanhddg', // Sync Watch - Watch videos together on any site
  'nmldnjcblcihmegipecakhmnieiofmgl', // Keyword Rank Checker
  'gppllamhaciichleihemgilcpledblpn', // YouTube Simple View - Hide distractions & more
  'pccbghdfdnnkkbcdcibchpbffdgednkf', // Propbar - Property Data Enhancer
  'lfknakglefggmdkjdfhhofkjnnolffkh', // Text Search Pro - Search by case and whole-word match!
  'mbenhbocjckkbaojacmaepiameldglij', // Invoice Generator
  'phlfhkmdofajnbhgmbmjkbkdgppgoppb', // Monthly Bill Tracker
  'macmkmchfoclhpbncclinhjflmdkaoom', // Wandpen - Instantly improve your writing with AI
  'lhmgechokhmdekdpgkkemoeecelcaonm', // YouTube Hider - Remove Comments By Keywords, Usernames & Tools
  'imgheieooppmahcgniieddodaliodeeg', // QA Compass - Record standardized bug reports easily
  'npgghjedpchajflknnbngajkjkdhncdo', // aesthetic Notion, styled
  'hmdcmlfkchdmnmnmheododdhjedfccka', // Eye Dropper
  'eihpmapodnppeemkhkbhikmggfojdkjd', // Cursorful - Screen Recorder with Auto Zoom
  'hjjkgbibknbahijglkffklflidncplkn', // Show IP – Live View of Website IPs for Developers
  'ilbikcehnpkmldojkcmlldkoelofnbde', // Strong Password Generator
  'ocllfkhcdopiafndigclebelbecaiocp', // ZenGram: Mindful Instagram, Your Way
  'odffpjnpocjfcaclnenaaaddghkgijdb', // Blync: Preview Links, Selection Search, AI Assistant
  'kofbbilhmnkcmibjbioafflgmpkbnmme', // HTML to Markdown - Convert webpages to markdown
  'boecmgggeigllcdocgioijmleimjbfkg', // Walmart WFS Profit Calculator
  'dlnjcbkmomenmieechnmgglgcljhoepd', // Youtube Live Chat Fullscreen
  'keiealdacakpnbbljlmhfgcebmaadieg', // Python Code Runner
];

const { data, err, isLoading } = useListExtensionDetails(chromeExtensionIds);
const sortedExtensions = computed(() => {
  if (!data.value?.length) return [];

  return [...data.value]
    .filter((item) => item != null)
    .map((item) => ({
      ...item,
      // Sort based on the user count weighted by the rating
      sortKey: ((item.rating ?? 5) / 5) * item.weeklyActiveUsers,
    }))
    .filter((item) => !!item)
    .sort((l, r) => r.sortKey - l.sortKey);
});

function getStoreUrl(extension: ChromeExtension) {
  const url = new URL(extension.storeUrl);
  url.searchParams.set('utm_source', 'wxt.dev');
  return url.href;
}
</script>

<template>
  <p v-if="isLoading" style="text-align: center; opacity: 50%">Loading...</p>
  <p
    v-else-if="err || sortedExtensions.length === 0"
    style="text-align: center; opacity: 50%"
  >
    Failed to load extension details.
  </p>
  <ul v-else>
    <li
      v-for="extension of sortedExtensions"
      :key="extension.id"
      class="relative"
    >
      <img
        :src="extension.iconUrl"
        :alt="`${extension.name} icon`"
        referrerpolicy="no-referrer"
      />
      <div class="relative">
        <a
          :href="getStoreUrl(extension)"
          target="_blank"
          :title="extension.name"
          class="extension-name"
          >{{ extension.name }}</a
        >
        <p class="description" :title="extension.shortDescription">
          {{ extension.shortDescription }}
        </p>
      </div>
      <p class="user-count">
        <span>{{ extension.weeklyActiveUsers.toLocaleString() }} users</span
        ><template v-if="extension.rating != null"
          >,
          <span>{{ extension.rating }} stars</span>
        </template>
      </p>
    </li>
  </ul>
  <p class="centered pr">
    <a
      href="https://github.com/wxt-dev/wxt/edit/main/docs/.vitepress/components/UsingWxtSection.vue"
      target="_blank"
      >Open a PR</a
    >
    to add your extension to the list!
  </p>
</template>

<style scoped>
li img {
  width: 116px;
  height: 116px;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--vp-c-default-soft);
}

ul {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  align-items: stretch;
  gap: 16px;
  list-style: none;
  margin: 16px 0;
  padding: 0;
}
@media (min-width: 960px) {
  ul {
    grid-template-columns: repeat(2, 1fr);
  }
}

li {
  margin: 0 !important;
  padding: 16px;
  display: flex;
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
  flex: 1;
  gap: 24px;
  align-items: center;
}

.centered {
  text-align: center;
}

li a,
li .user-count,
li .description {
  padding: 0;
  margin: 0;
}
li .user-count {
  opacity: 70%;
  font-size: small;
  position: absolute;
  bottom: 12px;
  right: 16px;
}

li a {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  margin: 0;
  text-decoration: none;
}
li a:hover {
  text-decoration: underline;
}

li div {
  flex: 1;
}

li .description {
  opacity: 90%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16px;
}

li .extension-name {
  font-size: large;
}

.pr {
  opacity: 70%;
}

.relative {
  position: relative;
}
</style>
