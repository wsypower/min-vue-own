/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-10 12:48:59
 * @LastEditTime: 2022-06-13 01:34:48
 * @LastEditors: wsy
 */

import { track, trigger } from './effect';

export function reactive(raw: Record<string, any>) {
  return new Proxy(raw, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      track(target, key);
      return res;
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return res;
    },
  });
}
