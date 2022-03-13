const formatPercentage = (value: number, decimals = 0): number =>
  Number((value * 100).toFixed(decimals));

export default formatPercentage;
