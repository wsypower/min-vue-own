import { createVNode } from './vnode';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:36:53
 * @LastEditTime: 2022-06-28 21:48:29
 * @LastEditors: wsy
 */
export function createAppApi(render: any) {
  return function createApp(rootComponent: any) {
    return {
      mount(rootContainer: Element) {
        const vnode = createVNode(rootComponent);
        render(vnode, rootContainer);
      },
    };
  };
}
