<template>
  <template v-if="!routerItem?.hidden">
    <template v-if="showSidebarItem(routerItem.children, routerItem)">
      <Link
        v-if="onlyOneChild.meta"
        :to="resolvePath(onlyOneChild.path)"
      >
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <MenuItem
            :meta="onlyOneChild.meta || routerItem.meta"
            :is-collapse="isCollapse"
          />
        </el-menu-item>
      </Link>
    </template>
    <el-sub-menu
      v-else
      ref="subMenu"
      :index="resolvePath(routerItem.path)"
      popper-append-to-body
    >
      <template
        v-if="routerItem.meta"
        #title
      >
        <MenuItem
          :meta="routerItem.meta"
          :is-collapse="isCollapse"
        />
      </template>
      <SubMenu
        v-for="child in routerItem?.children"
        :key="child.path"
        :is-nest="true"
        :router-item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup>
import path from 'path';
import Link from './Link.vue';
import MenuItem from './MenuItem.vue';
import { isExternal } from '@/utils';
const props = defineProps({
  //每一个router Item
  routerItem: {
    type: Object,
    required: true
  },
  //用于判断是不是子Item,设置响应的样式
  isNest: {
    type: Boolean,
    default: false
  },
  //基础路径，用于拼接
  basePath: {
    type: String,
    default: ''
  },
  isCollapse: {
    type: Boolean,
    default: false
  }
});

//显示sidebarItem 的情况
const onlyOneChild = ref(null);
const showSidebarItem = (children = [], parent) => {
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false;
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item;
      return true;
    }
  });
  if (showingChildren.length === 1 && !parent?.alwaysShow) {
    return true;
  }
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noChildren: true };
    return true;
  }
  return false;
};
const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  return path.resolve(props.basePath, routePath);
};
</script>
