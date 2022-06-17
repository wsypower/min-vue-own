import { extend, isObject } from '../shared';
import { track, trigger } from './effect';
import { reactive, ReactiveFlags, readonly } from './reactive';
/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-16 21:07:42
 * @LastEditTime: 2022-06-17 11:05:23
 * @LastEditors: wsy
 */

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly: boolean = false, shallow = false): any {
  return function get(target: Record<string, any>, key: string) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const res = Reflect.get(target, key);

    if (shallow) {
      return res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target: Record<string, any>, key: string, value: any) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}

export const mutableHandles = {
  get,
  set,
};

export const readonlyHandles = {
  get: readonlyGet,
  set(target: Record<string, any>, key: string, value: any) {
    console.warn(`key ${key} is readonly`);
    return true;
  },
};

export const shallowReadonlyHandles = extend({}, readonlyHandles, {
  get: shallowReadonlyGet,
});
