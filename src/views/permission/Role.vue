<template>
  <div class="app-container">
    <el-button type="primary" @click="handleaddRoleAPI">New Role</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Role Key" width="220">
        <template v-slot:scope>
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template v-slot:scope>
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template v-slot:scope>
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template v-slot:scope>
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>

// import { resolve } from '@/utils/path';
// import { deepClone } from '@/utils/index';
// import { getRoutesAPI, getRolesAPI, addRoleAPI, deleteRoleAPI, updateRoleAPI } from '@/api/role';

// const { proxy } = getCurrentInstance();
// const refs = proxy.$refs;

// const defaultRole = {
//   key: '',
//   name: '',
//   description: '',
//   routes: []
// };

// const role = ref(Object.assign({}, defaultRole));
// const routes = ref([]);
// const rolesList = ref([]);
// const dialogVisible = ref(false);
// const dialogType = ref('new');
// const checkStrictly = ref(false);
// const serviceRoutes = ref(null);

// // eslint-disable-next-line no-undef
// const props = defineProps({
//   children: {
//     type: Object,
//   },
//   label: {
//     type: String,
//   },
// });

// const routesData = computed(() => routes.value);

// const getRoutesAPIFn = async () => {
//   const res = await getRoutesAPI();
//   serviceRoutes.value = res.data;
//   routes.value = generateRoutes(res.data);
// };

// // Reshape the routes structure so that it looks the same as the sidebar
// const generateRoutes = (routes, basePath = '/') => {
//   const res = [];

//   for (let route of routes) {
//     // skip some route
//     if (route.hidden) { continue }

//     const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route);

//     if (route.children && onlyOneShowingChild && !route.alwaysShow) {
//       route = onlyOneShowingChild;
//     }

//     const data = {
//       path: resolve(basePath, route.path),
//       title: route.meta && route.meta.title

//     };

//     // recursive child routes
//     if (route.children) {
//       data.children = generateRoutes(route.children, data.path);
//     }
//     res.push(data);
//   }
//   return res;
// };


// const getRolesAPIFn = async () => {
//   const res = await getRolesAPI();
//   rolesList.value = res.data;
// };

// // Mock: get all routes and roles list from server
// getRoutesAPIFn();
// getRolesAPIFn();

// const generateArr = routes => {
//   let data = [];
//   routes.forEach(route => {
//     data.push(route);
//     if (route.children) {
//       const temp = this.generateArr(route.children);
//       if (temp.length > 0) {
//         data = [...data, ...temp];
//       }
//     }
//   });
//   return data;
// };

// const handleaddRoleAPI = () => {
//   role.value = Object.assign({}, defaultRole);
//   if (this.$refs.tree) {
//     this.$refs.tree.setCheckedNodes([]);
//   }
//   dialogType.value = 'new';
//   dialogVisible.value = true;
// };

// const handleEdit = scope => {
//   dialogType.value = 'edit';
//   dialogVisible.value = true;
//   checkStrictly.value = true;
//   role.value = deepClone(scope.row);
//   proxy.$nextTick(() => {
//     const routes = this.generateRoutes(role.value.routes);
//     this.$refs.tree.setCheckedNodes(this.generateArr(routes));
//     // set checked state of a node not affects its father and child nodes
//     checkStrictly.value = false;
//   });
// };

// const handleDelete = ({ $index, row }) => {
//   // proxy.$confirm('Confirm to remove the role?', 'Warning', {
//   //   confirmButtonText: 'Confirm',
//   //   cancelButtonText: 'Cancel',
//   //   type: 'warning'
//   // })
//   //   .then(async() => {
//   //     await deleteRoleAPI(row.key);
//   //     rolesList.value.splice($index, 1);
//   //   })
//   //   .catch(err => { console.error(err) });
// };

// const generateTree = (routes, basePath = '/', checkedKeys) => {
//   const res = [];

//   for (const route of routes) {
//     const routePath = resolve(basePath, route.path);

//     // recursive child routes
//     if (route.children) {
//       route.children = this.generateTree(route.children, routePath, checkedKeys);
//     }

//     if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
//       res.push(route);
//     }
//   }
//   return res;
// };

// const confirmRole = async () => {
//   const isEdit = dialogType.value === 'edit';

//   const checkedKeys = refs.tree.getCheckedKeys();
//   role.value.routes = this.generateTree(deepClone(serviceRoutes), '/', checkedKeys);

//   if (isEdit) {
//     await updateRoleAPI(role.value.key, role);
//     for (let index = 0; index < rolesList.value.length; index++) {
//       if (rolesList[index].key === role.value.key) {
//         rolesList.value.splice(index, 1, Object.assign({}, role));
//         break;
//       }
//     }
//   } else {
//     const { data } = await addRoleAPI(role);
//     role.value.key = data.key;
//     rolesList.value.push(role);
//   }

//   // const { description, key, name } = role
//   dialogVisible.value = false;
//   // this.$notify({
//   //   title: 'Success',
//   //   dangerouslyUseHTMLString: true,
//   //   message: `
//   //       <div>Role Key: ${key}</div>
//   //       <div>Role Name: ${name}</div>
//   //       <div>Description: ${description}</div>
//   //     `,
//   //   type: 'success'
//   // })
// };

// // reference: src/view/layout/components/Sidebar/SidebarItem.vue
// const onlyOneShowingChild = (children = [], parent) => {
//   let onlyOneChild = null;
//   const showingChildren = children.filter(item => !item.hidden);

//   // When there is only one child route, the child route is displayed by default
//   if (showingChildren.length === 1) {
//     onlyOneChild = showingChildren[0];
//     onlyOneChild.path = resolve(parent.path, onlyOneChild.path);
//     return onlyOneChild;
//   }

//   // Show parent if there are no child route to display
//   if (showingChildren.length === 0) {
//     onlyOneChild = { ... parent, path: '', noShowingChildren: true };
//     return onlyOneChild;
//   }

//   return false;
// };

</script>

<style lang="sass" scoped>
.app-container
  .roles-table
    margin-top: 30px
  .permission-tree
    margin-bottom: 30px
</style>
