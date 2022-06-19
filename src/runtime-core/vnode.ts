/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:41:46
 * @LastEditTime: 2022-06-19 18:11:31
 * @LastEditors: wsy
 */
export function createVNode(
  type: any,
  props?: Record<string, any>,
  children?: any[]
) {
  const vnode = { type, props, children };
  return vnode;
}
