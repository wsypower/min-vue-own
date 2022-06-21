/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-22 00:22:09
 * @LastEditTime: 2022-06-22 00:30:06
 * @LastEditors: wsy
 */

const publicPropertiesMap: Record<string, any> = {
  $el: (i: any) => i.vnode.el,
};
export const PublicInstanceProxyHandlers = {
  get({ _: instance }: Record<string, any>, key: string) {
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }
    const publicGetter: any = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter();
    }
  },
};
