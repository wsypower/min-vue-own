/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:19:56
 * @LastEditTime: 2022-06-19 22:39:57
 * @LastEditors: wsy
 */
export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
  };
  return component;
}

export function setupComponent(instance: any) {
  //TODO
  // initProps()
  // initSlots()
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  const { setup } = Component;
  if (setup) {
    // function Object
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  instance.render = Component.render;
}
