// import { store } from '/@/stores';
// import { getCookie, setCookie } from '/@/utils/auth';

// export const app = {
//   id: 'app',
//   namespaced: true,
//   state: {
//     sidebar: {
//       opened: getCookie('sidebarStatus') ? !!+getCookie('sidebarStatus') : true,
//       withoutAnimation: false
//     },
//     device: 'desktop',
//     size: getCookie('size') || 'medium'
//   },
//   getters: {
//     getDevice: state => state.device,
//   },
//   mutations: {
//     TOGGLE_SIDEBAR: state => {
//       state.sidebar.opened = !state.sidebar.opened;
//       state.sidebar.withoutAnimation = false;
//       if (state.sidebar.opened) {
//         setCookie('sidebarStatus', 1);
//       } else {
//         setCookie('sidebarStatus', 0);
//       }
//     },
//     CLOSE_SIDEBAR: (state, withoutAnimation) => {
//       setCookie('sidebarStatus', 0);
//       state.sidebar.opened = false;
//       state.sidebar.withoutAnimation = withoutAnimation;
//     },
//     TOGGLE_DEVICE: (state, device) => {
//       state.device = device;
//     },
//     SET_SIZE: (state, size) => {
//       state.size = size;
//       setCookie('size', size);
//     }
//   },
//   actions: {
//     toggleSideBar({ commit }) {
//       commit('TOGGLE_SIDEBAR');
//     },
//     closeSideBar({ commit }, { withoutAnimation }) {
//       commit('CLOSE_SIDEBAR', withoutAnimation);
//     },
//     toggleDevice({ commit }, device) {
//       commit('TOGGLE_DEVICE', device);
//     },
//     setSize({ commit }, size) {
//       commit('SET_SIZE', size);
//     }
//   }
// };
