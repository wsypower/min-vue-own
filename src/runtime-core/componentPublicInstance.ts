/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-22 00:22:09
 * @LastEditTime: 2022-06-24 23:35:04
 * @LastEditors: wsy
 */

import { hasOwn } from '../shared/index';

const publicPropertiesMap: Record<string, any> = {
  $el: (i: any) => i.vnode.el,
};
export const PublicInstanceProxyHandlers = {
  get({ _: instance }: Record<string, any>, key: string) {
    const { setupState, props } = instance;
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }
    const publicGetter: any = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter();
    }
  },
};
