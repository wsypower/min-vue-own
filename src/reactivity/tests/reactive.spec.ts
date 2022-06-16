/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-10 11:19:28
 * @LastEditTime: 2022-06-16 21:42:59
 * @LastEditors: wsy
 */

import { reactive, isReactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
  });
  it('isReactive', () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(observed)).not.toBe(false);
  });
});
