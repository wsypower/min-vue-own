import { isReadonly, readonly } from '../reactive';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-16 20:55:27
 * @LastEditTime: 2022-06-16 21:44:59
 * @LastEditors: wsy
 */
describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observed = readonly(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
  });
  it('warm then call set', () => {
    console.warn = jest.fn();
    const user = readonly({
      age: 10,
    });
    user.age = 11;
    expect(console.warn).toBeCalled();
  });
  it('isReadonly', () => {
    const original = { foo: 1 };
    const observed = readonly(original);
    expect(isReadonly(observed)).toBe(true);
    expect(isReadonly(observed)).not.toBe(false);
  });
});
