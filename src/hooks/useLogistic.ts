import { useLogisticStore } from '@/store';

export const useQueryHook = (listQuery, pageName, fetchListFn) => {
  console.log('listQuery: ', listQuery);
  const logisticStore = useLogisticStore();
  onMounted(() => {
    Object.assign(listQuery.value, logisticStore.listQuery[pageName]);
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
