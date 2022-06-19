import { render } from './render';
import { createVNode } from './vnode';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:36:53
 * @LastEditTime: 2022-06-19 18:13:37
 * @LastEditors: wsy
 */
export function createApp(rootComponent: any) {
  return {
    mount(rootContainer: Element) {
      const vnode = createVNode(rootComponent);
      render(vnode, rootContainer);
    },
  };
}