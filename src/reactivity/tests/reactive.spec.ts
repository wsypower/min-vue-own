/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-10 11:19:28
 * @LastEditTime: 2022-06-10 13:10:21
 * @LastEditors: wsy
 */

import { reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
  });
});
