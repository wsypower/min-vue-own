import { isReactive, shallowReadonly, isReadonly } from '../reactive';
/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-17 10:38:05
 * @LastEditTime: 2022-06-17 11:28:57
 * @LastEditors: wsy
 */
describe('shallowReadonly', () => {
  it('happy path', () => {
    const original = { foo: 1, n: { a: 1 } };
    const observed = shallowReadonly(original);

    // expect(observed).not.toBe(original);
    expect(isReadonly(observed)).toBe(true);
    expect(isReadonly(observed.n)).toBe(false);
  });
  it('warm then call set', () => {
    console.warn = jest.fn();
    const user = shallowReadonly({
      age: 10,
      foo: {
        a: 1,
      },
    });
    user.age = 11;
    user.foo.a;
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
