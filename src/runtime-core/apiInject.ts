import { getCurrentInstance } from './component';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-27 12:27:20
 * @LastEditTime: 2022-06-27 22:16:04
 * @LastEditors: wsy
 */
export function provide(key: any, value: any) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    let { provides } = currentInstance;
    const parentProvides = currentInstance.parent.provides;
    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }

    provides[key] = value;
  }
}
export function inject(key: any, defaultValue: any) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    const { parent } = currentInstance;
    const parentProvides = parent.provides;
    if (key in parentProvides) {
      return parentProvides[key];
    } else if (defaultValue) {
      if (typeof defaultValue === 'function') {
        return defaultValue();
      } else {
        return defaultValue;
      }
    }
  }
}
