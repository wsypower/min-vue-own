import { ShapeFlags } from '../shared/ShapeFlags';
/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:41:46
 * @LastEditTime: 2022-07-14 01:34:33
 * @LastEditors: wsy
 */

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

export function createVNode(
  type: any,
  props?: Record<string, any>,
  children?: any[]
) {
  const vnode = {
    type,
    props,
    children,
    component: null,
    el: null,
    shapeFlag: getShapeFlag(type),
    key: props?.key,
  };
  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }

  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN;
    }
  }
  return vnode;
}

function getShapeFlag(type: any) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}

export function createTextVNode(text: any) {
  return createVNode(Text, {}, text);
}
export { createVNode as createElementVNode };
