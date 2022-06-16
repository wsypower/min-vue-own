/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-14 13:26:28
 * @LastEditTime: 2022-06-16 22:31:03
 * @LastEditors: wsy
 */
export const extend = Object.assign;
export const isObject = (obj: any): boolean => {
  return obj !== null && typeof obj === 'object';
};
