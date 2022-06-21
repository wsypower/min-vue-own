import { createComponentInstance, setupComponent } from './component';
import { isObject } from '../shared/index';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:13:31
 * @LastEditTime: 2022-06-21 23:29:36
 * @LastEditors: wsy
 */
export function render(vnode: any, container: Element) {
  patch(vnode, container);
}

function patch(vnode: any, container: Element) {
  // TODO vnode 是否是一个element
  if (typeof vnode.type === 'string') {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  console.log(instance);
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  console.log(subTree);
  patch(subTree, container);
}

function processElement(vnode: any, container: Element) {
  mountElement(vnode, container);
}
function mountElement(vnode: any, container: Element) {
  const element = document.createElement(vnode.type);
  const { children } = vnode;
  if (Array.isArray(children)) {
    mountChildren(vnode, element);
  } else {
    element.textContent = children;
  }

  if (vnode.props) {
    for (const key in vnode.props) {
      const val = vnode.props[key];
      element.setAttribute(key, val);
    }
  }
  container.appendChild(element);
}
function mountChildren(vnode: any, element: any) {
  vnode.children.forEach((child: any) => {
    patch(child, element);
  });
}
