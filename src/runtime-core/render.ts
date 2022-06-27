import { createComponentInstance, setupComponent } from './component';
import { isObject } from '../shared/index';
import { ShapeFlags } from '../shared/ShapeFlags';
import { Fragment, Text } from './vnode';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:13:31
 * @LastEditTime: 2022-06-27 14:16:21
 * @LastEditors: wsy
 */
export function render(vnode: any, container: Element, parentComponent: any) {
  patch(vnode, container, parentComponent);
}

function patch(vnode: any, container: Element, parentComponent: any) {
  const { shapeFlag, type } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      // TODO vnode 是否是一个element
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent);
      }
      break;
  }
}

function processComponent(vnode: any, container: any, parentComponent: any) {
  mountComponent(vnode, container, parentComponent);
}

function mountComponent(
  initialVnode: any,
  container: any,
  parentComponent: any
) {
  const instance = createComponentInstance(initialVnode, parentComponent);
  setupComponent(instance);
  setupRenderEffect(instance, initialVnode, container);
}

function setupRenderEffect(instance: any, initialVnode: any, container: any) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container, instance);
  initialVnode.el = subTree.el;
}

function processElement(vnode: any, container: Element, parentComponent: any) {
  mountElement(vnode, container, parentComponent);
}
function mountElement(vnode: any, container: Element, parentComponent: null) {
  const element = (vnode.el = document.createElement(vnode.type));
  const { children, shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // array_children
    mountChildren(vnode, element, parentComponent);
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
      } else {
        element.setAttribute(key, val);
      }
    }
  }
  container.appendChild(element);
}
function mountChildren(vnode: any, element: any, parentComponent: any) {
  vnode.children.forEach((child: any) => {
    patch(child, element, parentComponent);
  });
}

function processFragment(vnode: any, container: Element, parentComponent: any) {
  mountChildren(vnode, container, parentComponent);
}
function processText(vnode: any, container: Element) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.appendChild(textNode);
}
