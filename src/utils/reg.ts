
export const toNumber = (val: string): number => {
  return +val.replace(/[^0-9]/gi, '');
};
