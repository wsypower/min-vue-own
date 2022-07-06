import { createComponentInstance, setupComponent } from './component';
import { EMPTY_PBJ, isObject } from '../shared/index';
import { ShapeFlags } from '../shared/ShapeFlags';
import { Fragment, Text } from './vnode';
import { createAppApi } from './createApp';
import { effect } from '../reactivity/effect';
import { shouldUpdateComponent } from './componentUpdateUtils';
import { queueJobs } from './scheduler';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:13:31
 * @LastEditTime: 2022-07-06 22:15:47
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
    parentComponent: any,
    anchor: any = null
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
          processElement(oldVnode, vnode, container, parentComponent, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(oldVnode, vnode, container, parentComponent, anchor);
        }
        break;
    }
  }

  function processComponent(
    oldVnode: any,
    vnode: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    if (!oldVnode) {
      mountComponent(vnode, container, parentComponent, anchor);
    } else {
      updateComponent(oldVnode, vnode, container, parentComponent, anchor);
    }
  }
  function updateComponent(
    oldVnode: any,
    vnode: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    const instance = (vnode.component = oldVnode.component);
    if (shouldUpdateComponent(oldVnode, vnode)) {
      console.log('-------------组件的更新----------------');
      instance.next = vnode;
      instance.update();
    } else {
      console.log('-----------组件不应该更新-------------');
      vnode.el = oldVnode.el;
      instance.vnode = vnode;
    }
  }

  function mountComponent(
    initialVnode: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    const instance = (initialVnode.component = createComponentInstance(
      initialVnode,
      parentComponent
    ));
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container, anchor);
  }

  function setupRenderEffect(
    instance: any,
    initialVnode: any,
    container: any,
    anchor: any
  ) {
    instance.update = effect(
      () => {
        if (!instance.isMounted) {
          console.log('init');
          const { proxy } = instance;
          const subTree = (instance.subTree = instance.render.call(proxy));
          patch(null, subTree, container, instance, anchor);
          initialVnode.el = subTree.el;
          instance.isMounted = true;
        } else {
          console.log('---------update-------------');
          const { next, vnode } = instance;
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next);
          }
          const { proxy } = instance;
          const subTree = instance.render.call(proxy);
          const preSubTree = instance.subTree;
          instance.subTree = subTree;
          patch(preSubTree, subTree, container, instance, anchor);
        }
      },
      {
        scheduler() {
          console.log('scheduler-update');
          queueJobs(instance.update);
        },
      }
    );
  }
  function updateComponentPreRender(instance: any, nextVnode: any) {
    instance.vnode = nextVnode;
    instance.next = null;
    instance.props = nextVnode.props;
  }
  function processElement(
    oldVnode: any,
    vnode: any,
    container: Element,
    parentComponent: any,
    anchor: any = null
  ) {
    if (!oldVnode) {
      mountElement(vnode, container, parentComponent, anchor);
    } else {
      patchElement(oldVnode, vnode, container, parentComponent, anchor);
    }
  }
  function patchElement(
    oldVnode: any,
    vnode: any,
    container: any,
    parentComponent: any,
    anchor: any = null
  ) {
    //更新对比
    console.log('patchElement');
    const oldPros = oldVnode.props || EMPTY_PBJ;
    const newPros = vnode.props || EMPTY_PBJ;
    const el = (vnode.el = oldVnode.el);
    patchChildren(oldVnode, vnode, el, parentComponent, anchor);
    patchProps(el, oldPros, newPros);
  }

  function patchChildren(
    oldVnode: any,
    vnode: any,
    container: any,
    parentComponent: any,
    anchor: any = null
  ) {
    /**
     * 1. 如果新节点是文本节点，旧节点是文本节点，则更新文本节点
     * 2. 如果新节点是文本节点，旧节点是数组节点，移除数组节点，添加文本节点
     * 3. 如果新节点是数组节点，旧节点是文本节点，移除文本节点，添加数组节点
     * 4. 如果新节点是数组节点, 旧节点是文本节点, diff算法
     */
    const prevShapeFlap = oldVnode.shapeFlag;
    const { shapeFlag } = vnode;
    const vnodeChildren = vnode.children;
    const oldVnodeChildren = oldVnode.children;
    // 如果新的节点是文本节点
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
      } else {
        // 老节点和新节点都是array
        patchKeyedChildren(
          oldVnodeChildren,
          vnodeChildren,
          container,
          parentComponent,
          anchor
        );
      }
    }
  }
  function patchKeyedChildren(
    c1: any[],
    c2: any[],
    container: any,
    parentComponent: any,
    parentAnchor: any = null
  ) {
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    function isSomeVnodeType(n1: any, n2: any) {
      return n1.type === n2.type && n1.key === n2.key;
    }
    // 左侧对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSomeVnodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }
    console.log('左侧检测对比完毕', i);
    // 右侧对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSomeVnodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    console.log('右侧检测对比完毕', e1, e2);

    if (i > e1) {
      if (i <= e2) {
        console.log('新的节点比老的节点长');
        const nextPos = e2 + 1;
        const anchor = nextPos < c2.length ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      console.log('老节点比新节点长');
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      /**
       * 中间区间的对比
       * 1.删除
       * 2.移动
       * 3.新建
       */
      console.log('处理两端中间的乱序');
      let s1 = i;
      let s2 = i;
      const toBePatch = e2 - s2 + 1;
      let patched = 0;
      const keyToNewIndexMap = new Map();
      // 映射表
      const newIndexToOldIndexMap = new Array(toBePatch);
      let moved = false;
      let maxNewIndexSoFar = 0;
      // 初始赋值
      for (let i = 0; i < toBePatch; i++) {
        newIndexToOldIndexMap[i] = 0;
      }

      // 1.删除操作
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i];
        keyToNewIndexMap.set(nextChild.key, i);
      }
      for (let i = s1; i <= e1; i++) {
        const preChild = c1[i];
        // 所有的新节点都已经对比过了，后续的就直接删除掉
        if (patched >= toBePatch) {
          hostRemove(preChild.el);
          continue;
        }
        let newIndex;
        if (preChild.key != null) {
          newIndex = keyToNewIndexMap.get(preChild.key);
        } else {
          for (let j = s2; j <= e2; j++) {
            if (isSomeVnodeType(preChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex == null) {
          console.log('执行了删除操作');
          hostRemove(preChild.el);
        } else {
          console.log('执行了更新操作');
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          patch(preChild, c2[newIndex], container, parentComponent, null);
          patched++;
        }
      }
      // 2.移动逻辑
      console.log('newIndexToOldIndexMap映射表', newIndexToOldIndexMap);
      // 最长递增子序列
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : [];
      console.log('最长递增子序列索引', increasingNewIndexSequence);
      // 对比
      let j = increasingNewIndexSequence.length - 1;
      for (let i = toBePatch - 1; i >= 0; i--) {
        const nextIndex = i + s2;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null;
        // 3.创建新节点
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor);
        }
        // 移动的逻辑
        if (moved) {
          if (i !== increasingNewIndexSequence[j]) {
            console.log('不等于最长递增子序列索引，需要移动位置');
            hostInsert(nextChild.el, container, anchor);
          } else {
            console.log('等于最长递增子序列索引，不需要移动位置');
            j--;
          }
        }
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

  function mountElement(
    vnode: any,
    container: Element,
    parentComponent: any,
    anchor: any = null
  ) {
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
    hostInsert(element, container, anchor);
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

function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
