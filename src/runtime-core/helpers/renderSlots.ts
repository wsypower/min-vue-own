import { createVNode, Fragment } from '../vnode';
/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-25 17:09:30
 * @LastEditTime: 2022-06-26 01:20:54
 * @LastEditors: wsy
 */
export function renderSlots(slots: any, name: string, props: any) {
  const slot = slots[name];
  if (slot) {
    if (typeof slot === 'function') {
      return createVNode(Fragment, {}, slot(props));
    }
  }
  return [];
}
