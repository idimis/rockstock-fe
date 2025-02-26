export const formatCurrency = (value: number) => {
  return `Rp. ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};
