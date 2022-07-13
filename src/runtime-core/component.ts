import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublicInstance';
import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmit';
import { initSlots } from './componentSlots';
import { proxyRefs } from '../reactivity/ref';
/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:19:56
 * @LastEditTime: 2022-07-14 01:28:02
 * @LastEditors: wsy
 */
let compiler: any;
export function createComponentInstance(vnode: any, parent: any) {
  const component = {
    vnode,
    type: vnode.type,
    next: null,
    setupState: {},
    el: null,
    emit: () => {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: null,
  };
  component.emit = emit.bind(null, component) as any;
  return component;
}

export function setupComponent(instance: any) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  const { setup } = Component;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  if (setup) {
    setCurrentInstance(instance);
    // function Object
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === 'object') {
    console.log(setupResult);
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  if (compiler && !Component.render) {
    if (Component.template) {
      Component.render = compiler(Component.template);
    }
  }
  instance.render = Component.render;
}

let currentInstance: any = null;
export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentInstance(instance: any) {
  currentInstance = instance;
}

export function registerRuntimeCompiler(_compiler: any) {
  compiler = _compiler;
}
