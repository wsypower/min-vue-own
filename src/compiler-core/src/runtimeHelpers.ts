/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-12 13:04:42
 * @LastEditTime: 2022-07-12 21:19:42
 * @LastEditors: wsy
 */
export const TO_DISPLAY_STRING = Symbol('to_display');
export const CREATE_ELEMENT_VNODE = Symbol('createElementVNode');
export const helperMapName: any = {
  [TO_DISPLAY_STRING]: 'toDisplayString',
  [CREATE_ELEMENT_VNODE]: 'createElementVNode',
};
