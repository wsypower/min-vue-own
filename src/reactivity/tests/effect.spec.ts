/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-10 10:23:41
 * @LastEditTime: 2022-06-13 01:11:53
 * @LastEditors: wsy
 */

import { effect } from '../effect';
import { reactive } from '../reactive';

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    user.age++;
    expect(nextAge).toBe(12);
  });
});
