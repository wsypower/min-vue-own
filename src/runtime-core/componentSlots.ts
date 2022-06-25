import { ShapeFlags } from '../shared/ShapeFlags';

/*
 * @Description: slots
 * @Author: wsy
 * @Date: 2022-06-25 16:24:13
 * @LastEditTime: 2022-06-25 19:31:49
 * @LastEditors: wsy
 */
export function initSlots(instance: any, children: any) {
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}

function normalizeObjectSlots(children: any, slots: any) {
  for (const key in children) {
    const value: any = children[key];
    slots[key] = (props: any) => normalizeSlotValue(value(props));
  }
}

function normalizeSlotValue(value: any) {
  return Array.isArray(value) ? value : [value];
}
