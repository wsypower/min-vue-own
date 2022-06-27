import { getCurrentInstance } from './component';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-27 12:27:20
 * @LastEditTime: 2022-06-27 14:50:43
 * @LastEditors: wsy
 */
export function provide(key: any, value: any) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    const { provides } = currentInstance;
    provides[key] = value;
  }
}
export function inject(key: any) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    const { parent } = currentInstance;
    const parentProvides = parent.provides;
    return parentProvides[key];
  }
}
