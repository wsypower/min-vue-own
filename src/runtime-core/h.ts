import { createVNode } from './vnode';
/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 22:12:57
 * @LastEditTime: 2022-06-19 22:15:26
 * @LastEditors: wsy
 */

export function h(type: any, props?: Record<string, any>, children?: any[]) {
  return createVNode(type, props, children);
}
