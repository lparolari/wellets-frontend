const changeFrom =
  (fromDollarRate: number) =>
  (toDollarRate: number): number =>
    fromDollarRate / toDollarRate;

const changeFrom2 = (fromDollarRate: number, toDollarRate: number): number =>
  fromDollarRate / toDollarRate;

const changeValue =
  (fromDollarRate: number) =>
  (toDollarRate: number) =>
  (amount: number): number =>
    (1 / changeFrom(fromDollarRate)(toDollarRate)) * amount;

const change =
  (dollarRate: number) =>
  (amount: number): number =>
    (1 / dollarRate) * amount;

// eslint-disable-next-line import/prefer-default-export
export { change, changeFrom, changeFrom2, changeValue };
