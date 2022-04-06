import { change, changeFrom, changeValue } from './converter';

const USD = 1;
const EUR = 0.8; // fake dollar rate
const BTC = 0.01; // fake dollar rate

describe('change', () => {
  it('returns `amount * (1 / dollarRate)`', () => {
    expect(change(EUR)(5)).toBeCloseTo(5 / 0.8);
  });
});

describe('changeFrom', () => {
  it('returns `amount / (fromDollarRate / toDollarRate)`', () => {
    expect(changeFrom(USD)(USD)).toBeCloseTo(1);
    expect(changeFrom(EUR)(EUR)).toBeCloseTo(1);
    expect(changeFrom(USD)(EUR)).toBeCloseTo(1.25);
    expect(changeFrom(USD)(BTC)).toBeCloseTo(100);
    expect(changeFrom(EUR)(USD)).toBeCloseTo(0.8);
    expect(changeFrom(BTC)(USD)).toBeCloseTo(0.01);
    expect(changeFrom(EUR)(BTC)).toBeCloseTo(80);
    expect(changeFrom(BTC)(EUR)).toBeCloseTo(0.0125);
  });
});

describe('changeValue', () => {
  it('returns `amount * (fromDollarRate / toDollarRate)`', () => {
    expect(changeValue(USD)(USD)(1)).toBeCloseTo(1);
    expect(changeValue(EUR)(EUR)(1)).toBeCloseTo(1);
    expect(changeValue(USD)(EUR)(1)).toBeCloseTo(0.8);
    expect(changeValue(EUR)(USD)(1)).toBeCloseTo(1.25);
    expect(changeValue(USD)(USD)(100)).toBeCloseTo(100);
    expect(changeValue(EUR)(USD)(100)).toBeCloseTo(125);
    expect(changeValue(EUR)(BTC)(100)).toBeCloseTo(1.25);
    expect(changeValue(BTC)(EUR)(100)).toBeCloseTo(8000);
  });
});
