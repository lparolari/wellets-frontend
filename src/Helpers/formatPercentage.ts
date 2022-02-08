const formatPercentage = (value: number, decimals = 0): number => {
  return Number((value * 100).toFixed(decimals));
};

export default formatPercentage;
