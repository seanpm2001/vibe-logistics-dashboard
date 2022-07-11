import { useLogisticStore } from '@/store';

export const useQueryHook = (listQuery, pageName, fetchListFn) => {
  const logisticStore = useLogisticStore();
  onMounted(() => {
    const perPage = listQuery.value.perPage; // 保留原设置的perPage
    Object.assign( listQuery.value, logisticStore.listQuery[pageName], { perPage });
    fetchListFn();
  });
  onBeforeUnmount(() => {
    logisticStore.setListQuery({
      query: listQuery.value,
      pageName: pageName,
    });
  });
};

export const useWarehouseEnumHook = () => {
  const logisticStore = useLogisticStore();

  if (JSON.stringify(logisticStore.warehouseEnum) === '{}') {
    logisticStore.setWarehouseEnum();
  }
};
