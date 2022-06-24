import { createComponentInstance, setupComponent } from './component';
import { isObject } from '../shared/index';
import { ShapeFlags } from '../shared/ShapeFlags';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:13:31
 * @LastEditTime: 2022-06-24 23:24:15
 * @LastEditors: wsy
 */
export function render(vnode: any, container: Element) {
  patch(vnode, container);
}

function patch(vnode: any, container: Element) {
  const { shapeFlag } = vnode;
  // TODO vnode 是否是一个element
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(initialVnode: any, container: any) {
  const instance = createComponentInstance(initialVnode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVnode, container);
}

function setupRenderEffect(instance: any, initialVnode: any, container: any) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);
  initialVnode.el = subTree.el;
}

function processElement(vnode: any, container: Element) {
  mountElement(vnode, container);
}
function mountElement(vnode: any, container: Element) {
  const element = (vnode.el = document.createElement(vnode.type));
  const { children, shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // array_children
    mountChildren(vnode, element);
  } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // text_children
    element.textContent = children;
  }

  if (vnode.props) {
    for (const key in vnode.props) {
      const val = vnode.props[key];
      const isOn = (key: string) => /^on[A-Z]/.test(key);
      if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        element.addEventListener(event, val);
      }
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
