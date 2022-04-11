import { useUserStore } from '/@/stores';

function checkPermission(el, binding) {
  const { value } = binding;
  const role = useUserStore().role;

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value;

      const hasPermission = permissionRoles.includes(role);

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error('need role! Like v-permission="[\'admin\',\'editor\']"');
  }
}

export default {
  install (app) {
    app.directive('permission', {
      mounted (el, binding) {
        checkPermission(el, binding);
      },
      update(el, binding) {
        checkPermission(el, binding);
      }
    });
  },
};
