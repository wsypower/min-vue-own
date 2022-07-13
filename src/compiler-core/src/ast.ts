import { CREATE_ELEMENT_VNODE } from './runtimeHelpers';
/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-07 14:43:30
 * @LastEditTime: 2022-07-13 12:59:49
 * @LastEditors: wsy
 */
export const enum NodeTypes {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT,
  ROOT,
  COMPOUND_EXPRESSION,
}

export function createVNodeCall(
  context: any,
  tag: any,
  props: any,
  children: any
) {
  context.helper(CREATE_ELEMENT_VNODE);
  return {
    type: NodeTypes.ELEMENT,
    tag,
    props,
    children,
  };
}
