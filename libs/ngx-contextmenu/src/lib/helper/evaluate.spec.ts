import { evaluateIfFunction } from './evaluate';

describe('#evaluateIfFunction', () => {
  it('should return the given value if not a function', () => {
    const value = true;
    const result = evaluateIfFunction(value);
    expect(result).toBe(true);
  });

  it('should return the given value if not a function', () => {
    const value = false;
    const result = evaluateIfFunction(value);
    expect(result).toBe(false);
  });

  it('should return the result of the evaluation of value if it is a function', () => {
    const item = { id: 'item' };
    const actualResult = true;
    const testValue = jest.fn();
    const value = (...args: unknown[]) => {
      testValue(...args);
      return actualResult;
    };
    const result = evaluateIfFunction(value, item);
    expect(testValue).toHaveBeenCalledWith(item);
    expect(result).toBe(true);
  });

  it('should return the result of the evaluation of value if it is a function', () => {
    const item = { id: 'item' };
    const actualResult = false;
    const testValue = jest.fn();
    const value = (...args: unknown[]) => {
      testValue(...args);
      return actualResult;
    };
    const result = evaluateIfFunction(value, item);
    expect(testValue).toHaveBeenCalledWith(item);
    expect(result).toBe(false);
  });
});
