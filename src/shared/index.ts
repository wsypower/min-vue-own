/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-14 13:26:28
 * @LastEditTime: 2022-07-12 21:42:45
 * @LastEditors: wsy
 */
export const extend = Object.assign;
export const isObject = (obj: any): boolean => {
  return obj !== null && typeof obj === 'object';
};
export const hasChanged = (newVlaue: any, oldValue: any) => {
  return !Object.is(newVlaue, oldValue);
};
export function hasOwn(obj: any, key: string) {
  return Reflect.has(obj, key);
}

export const EMPTY_PBJ = {};

export function isString(val: any) {
  return typeof val === 'string';
}
