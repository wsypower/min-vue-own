/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-28 21:38:02
 * @LastEditTime: 2022-06-28 21:55:24
 * @LastEditors: wsy
 */
import { createRenderer } from '../runtime-core/index';
function createElement(type: any) {
  return document.createElement(type);
}
function patchProp(el: any, key: string, val: any) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, val);
  } else {
    el.setAttribute(key, val);
  }
}
function insert(el: any, parent: any) {
  parent.appendChild(el);
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
});

export function createApp(...args: any[]) {
  return renderer.createApp(...args);
}

export * from '../runtime-core/index';
