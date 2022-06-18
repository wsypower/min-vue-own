/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-14 13:26:28
 * @LastEditTime: 2022-06-18 22:14:12
 * @LastEditors: wsy
 */
export const extend = Object.assign;
export const isObject = (obj: any): boolean => {
  return obj !== null && typeof obj === 'object';
};
export const hasChanged = (newVlaue: any, oldValue: any) => {
  return !Object.is(newVlaue, oldValue);
};
