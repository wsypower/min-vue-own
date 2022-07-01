import { createComponentInstance, setupComponent } from './component';
import { EMPTY_PBJ, isObject } from '../shared/index';
import { ShapeFlags } from '../shared/ShapeFlags';
import { Fragment, Text } from './vnode';
import { createAppApi } from './createApp';
import { effect } from '../reactivity/effect';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:13:31
 * @LastEditTime: 2022-07-01 15:23:00
 * @LastEditors: wsy
 */

export function createRenderer(options: any) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vnode: any, container: Element) {
    patch(null, vnode, container, null);
  }
  function patch(
    oldVnode: any,
    vnode: any,
    container: Element,
    parentComponent: any
  ) {
    const { shapeFlag, type } = vnode;
    switch (type) {
      case Fragment:
        processFragment(oldVnode, vnode, container, parentComponent);
        break;
      case Text:
        processText(oldVnode, vnode, container);
        break;
      default:
        // TODO vnode 是否是一个element
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(oldVnode, vnode, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(oldVnode, vnode, container, parentComponent);
        }
        break;
    }
  }

  function processComponent(
    oldVnode: any,
    vnode: any,
    container: any,
    parentComponent: any
  ) {
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
    effect(() => {
      if (!instance.isMounted) {
        console.log('init');
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance);
        initialVnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log('update');
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const preSubTree = instance.subTree;
        instance.subTree = subTree;
        patch(preSubTree, subTree, container, instance);
      }
    });
  }

  function processElement(
    oldVnode: any,
    vnode: any,
    container: Element,
    parentComponent: any
  ) {
    if (!oldVnode) {
      mountElement(vnode, container, parentComponent);
    } else {
      patchElement(oldVnode, vnode, container, parentComponent);
    }
  }
  function patchElement(
    oldVnode: any,
    vnode: any,
    container: any,
    parentComponent: any
  ) {
    //更新对比
    console.log('patchElement');
    const oldPros = oldVnode.props || EMPTY_PBJ;
    const newPros = vnode.props || EMPTY_PBJ;
    const el = (vnode.el = oldVnode.el);
    patchChildren(oldVnode, vnode, el, parentComponent);
    patchProps(el, oldPros, newPros);
  }

  function patchChildren(
    oldVnode: any,
    vnode: any,
    container: any,
    parentComponent: any
  ) {
    // throw new Error('Function not implemented.');
    const prevShapeFlap = oldVnode.shapeFlag;
    const { shapeFlag } = vnode;
    const vnodeChildren = vnode.children;
    const oldVnodeChildren = oldVnode.children;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlap & ShapeFlags.ARRAY_CHILDREN) {
        // 把老的 children 清空
        unmountedChildren(oldVnode.children);
      }
      if (oldVnodeChildren !== vnodeChildren) {
        // 设置text
        hostSetElementText(container, vnodeChildren);
      }
    } else {
      if (prevShapeFlap & ShapeFlags.TEXT_CHILDREN) {
        // 把老的 text 清空
        hostSetElementText(container, '');
        mountChildren(vnodeChildren, container, parentComponent);
      }
    }
  }
  function unmountedChildren(children: any) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      hostRemove(el);
    }
  }

  function patchProps(el: any, oldPros: any, newPros: any) {
    if (oldPros !== newPros) {
      for (const key in newPros) {
        const prevProp = oldPros[key];
        const nextProp = newPros[key];
        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }
      if (oldPros !== EMPTY_PBJ) {
        for (const key in oldPros) {
          if (!(key in newPros)) {
            hostPatchProp(el, key, oldPros[key], null);
          }
        }
      }
    }
  }

  function mountElement(vnode: any, container: Element, parentComponent: null) {
    const element = (vnode.el = hostCreateElement(vnode.type));
    const { children, shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // array_children
      mountChildren(vnode.children, element, parentComponent);
    } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text_children
      element.textContent = children;
    }

    if (vnode.props) {
      for (const key in vnode.props) {
        const val = vnode.props[key];
        // const isOn = (key: string) => /^on[A-Z]/.test(key);
        // if (isOn(key)) {
        //   const event = key.slice(2).toLowerCase();
        //   element.addEventListener(event, val);
        // } else {
        //   element.setAttribute(key, val);
        // }
        hostPatchProp(element, key, null, val);
      }
    }
    // container.appendChild(element);
    hostInsert(element, container);
  }
  function mountChildren(children: any, element: any, parentComponent: any) {
    children.forEach((child: any) => {
      patch(null, child, element, parentComponent);
    });
  }

  function processFragment(
    oldVnode: any,
    vnode: any,
    container: Element,
    parentComponent: any
  ) {
    mountChildren(vnode.children, container, parentComponent);
  }
  function processText(oldVnode: any, vnode: any, container: Element) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.appendChild(textNode);
  }
  return {
    createApp: createAppApi(render),
  };
}
