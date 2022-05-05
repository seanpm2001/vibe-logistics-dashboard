import useUserStore from '@/store';

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const role = useUserStore().role;
    const permissionRoles = value;

    return permissionRoles.includes(role);
  } else {
    console.error('need roles! Like v-permission="[\'admin\',\'editor\']"');
    return false;
  }
}
