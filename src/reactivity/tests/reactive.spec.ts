/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-10 11:19:28
 * @LastEditTime: 2022-06-18 21:11:18
 * @LastEditors: wsy
 */

import { reactive, isReactive, isProxy } from '../reactive';

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
  it('nested reactive', () => {
    const original = { nested: { foo: 1 }, array: [{ bar: 1 }] };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
  it('is Proxy', () => {
    const original = { nested: { foo: 1 }, array: [{ bar: 1 }] };
    const observed = reactive(original);
    expect(isProxy(observed)).toBeTruthy();
  });
});
