<template>
  <div ref="tagsViewContainer" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :class="isActive(tag) ? 'is-active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
  </div>
  <ul
    v-show="visible"
    :style="{ left: left + 'px', top: top + 'px' }"
    class="contextmenu"
  >
    <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
    <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
    <li @click="closeOthersTags">Close Others</li>
    <li @click="closeAllTags(selectedTag)">Close All</li>
  </ul>
</template>

<script setup>
import ScrollPane from "./ScrollPane.vue";

import { resolve } from "/@/utils/path";
import { useStore } from "vuex";

const { proxy } = getCurrentInstance();

const store = useStore();
const state = store.state;
const route = useRoute();
const router = useRouter();
const refs = computed(() => proxy.$refs);

const visible = ref(false);
const top = ref(0);
const left = ref(0);
const selectedTag = ref({});
const affixTags = ref([]);

// const setTagsRef = el => {
//   const elPath = el.to.fullPath;
//   !tagsRef.some(item => item.to.fullPath === elPath) && tagsRef.push(el);
// };

const visitedViews = computed(() => state.tagsView.visitedViews);
const routes = computed(() => state.permission.routes);

const isActive = (tag) => {
  return tag.path === route.path;
};

const isAffix = (tag) => {
  return tag.meta && tag.meta.affix;
};

const filterAffixTags = (routes, basePath = "/") => {
  const tags = [];
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = resolve(basePath, route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      });
    }
  });
  return tags;
};

const initTags = () => {
  const affixTagsArr = (affixTags.value = filterAffixTags(router.getRoutes()));
  for (const tag of affixTagsArr) {
    // Must have tag name
    if (tag.name) {
      store.dispatch("tagsView/addVisitedView", tag);
    }
  }
};

function isNewTag() {
  const { path } = route;
  return !visitedViews.value.some((item) => item.path === path);
}

const addTags = () => {
  const { path } = route;

  if (isNewTag()) {
    store.dispatch("tagsView/addView", route);
  }
  return false;
};

const moveToCurrentTag = () => {
  const tags = visitedViews.value;
  proxy.$nextTick(() => {
    for (const tag of tags) {
      if (tag.path === route.path) {
        refs.value.scrollPane.moveToTarget(tag, tags);
        // when query is different then update
        if (tag.fullPath !== route.fullPath) {
          store.dispatch("tagsView/updateVisitedView", route);
        }
        break;
      }
    }
  });
};

const refreshSelectedTag = (view) => {
  // if (view.path === route.path) router.go(0);
  // router.push(view.path);
  store.dispatch("tagsView/delCachedView", view).then(() => {
    const { fullPath } = view;

    proxy.$nextTick(() => {
      router.replace({
        path: "/redirect" + fullPath,
      });
    });
  });
};

const closeSelectedTag = (view) => {
  store.dispatch("tagsView/delView", view).then(({ visitedViews }) => {
    if (isActive(view)) {
      toLastView(visitedViews, view);
    }
    closeMenu();
  });
};

const closeOthersTags = () => {
  router.push(selectedTag.value);
  store.dispatch("tagsView/delOthersViews", selectedTag.value).then(() => {
    moveToCurrentTag();
  });
};

const closeAllTags = (view) => {
  store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
    if (affixTags.value.some((tag) => tag.path === view.path)) {
      return;
    }
    toLastView(visitedViews, view);
  });
};

const toLastView = (visitedViews, view) => {
  const latestView = visitedViews.slice(-1)[0];
  if (latestView) {
    router.push(latestView.fullPath);
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === "Dashboard") {
      // to reload home page
      router.replace({ path: "/redirect" + view.fullPath });
    } else {
      router.push("/");
    }
  }
};

const openMenu = (tag, e) => {
  const menuMinWidth = 105;
  const offsetLeft = refs.value.tagsViewContainer.getBoundingClientRect().left; // container margin left
  const offsetWidth = refs.value.tagsViewContainer.offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const mleft = e.clientX - offsetLeft + 15; // 15: margin right

  if (mleft > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = mleft;
  }

  top.value = e.clientY;
  visible.value = true;
  selectedTag.value = tag;
};

const closeMenu = () => {
  visible.value = false;
};

// const handleScroll = () => {
//   closeMenu();
// };

/* watch */
watchEffect(() => {
  if (visible.value) {
    document.body.addEventListener("click", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
  }
});

watch(
  () => route.path,
  () => {
    if (route.path.indexOf("redirect") > -1) return;
    addTags();
    // moveToCurrentTag();
  }
);

onMounted(() => {
  initTags();
  addTags();
});
</script>

<style lang="sass" scoped>
.tags-view-container
  height: 40px
  width: 100%
  line-height: 40px
  background: #fff
  border-bottom: 1px solid #d8dce5
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04)
  .tags-view-wrapper
    .tags-view-item
      display: inline-block
      position: relative
      cursor: pointer
      height: 26px
      margin-left: 5px
      margin-top: 4px
      padding: 0 8px
      font-size: 12px
      line-height: 26px
      color: #495060
      background: #fff
      border: 1px solid #d8dce5
      border-radius: 2px

      &:first-of-type
        margin-left: 15px

      &:last-of-type
        margin-right: 15px

      &.is-active
        background-color: #42b983
        color: #fff
        border-color: #42b983
        &::before
          content: ''
          background: #fff
          display: inline-block
          width: 8px
          height: 8px
          border-radius: 50%
          position: relative
          margin-right: 2px

.contextmenu
  margin: 0
  background: #fff
  z-index: 3000
  position: absolute
  list-style-type: none
  padding: 5px 0
  border-radius: 4px
  font-size: 12px
  font-weight: 400
  color: #333
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3)
  li
    margin: 0
    padding: 7px 16px
    cursor: pointer
    &:hover
      background: #eee
</style>

<style lang="sass">
//reset element css of el-icon-close
.tags-view-wrapper
  .tags-view-item
    .el-icon-close
      width: 16px
      height: 16px
      vertical-align: 2px
      border-radius: 50%
      text-align: center
      transition: all .3s cubic-bezier(.645, .045, .355, 1)
      transform-origin: 100% 50%
      &:before
        transform: scale(.6)
        display: inline-block
        vertical-align: -3px

      &:hover
        background-color: #b4bccc
        color: #fff
</style>
