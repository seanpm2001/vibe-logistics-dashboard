// function useMapper(mapper, mapFn) {
//   // 拿到store独享

//   // 获取到对应的对象的functions: {name: function, age: function}
//   const storeStateFns = mapFn(mapper);

//   // 对数据进行转换
//   const storeState = {};
//   Object.keys(storeStateFns).forEach(fnKey => {
//     const fn = storeStateFns[fnKey].bind({$store: store});
//     storeState[fnKey] = computed(fn);
//   });

//   return storeState;
// }

// export function useState(moduleName, mapper) {
//   let mapperFn = mapState;
//   if (typeof moduleName === 'string' && moduleName.length > 0) {
//     mapperFn = createNamespacedHelpers(moduleName).mapState;
//   }

//   return useMapper(mapper, mapperFn);
// }

// export function useGetters(moduleName, mapper) {
//   let mapperFn = mapGetters;
//   if (typeof moduleName === 'string' && moduleName.length > 0) {
//     mapperFn = createNamespacedHelpers(moduleName).mapGetters;
//   }

//   return useMapper(mapper, mapperFn);
// }
