/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-28 21:38:02
 * @LastEditTime: 2022-07-01 14:57:40
 * @LastEditors: wsy
 */
import { createRenderer } from '../runtime-core';
export * from '../runtime-core';

function createElement(type: any) {
  return document.createElement(type);
}
function patchProp(el: any, key: string, preVal: any, nextVal: any) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === null || nextVal === undefined) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}
function insert(el: any, parent: any) {
  parent.appendChild(el);
}

function remove(child: any) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}
function setElementText(el: any, text: any) {
  el.textContent = text;
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
});

export function createApp(...args: any[]) {
  return renderer.createApp(...args);
}
