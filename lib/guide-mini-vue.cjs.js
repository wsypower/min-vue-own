'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:19:56
 * @LastEditTime: 2022-06-19 22:39:57
 * @LastEditors: wsy
 */
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    //TODO
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        // function Object
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-14 13:26:28
 * @LastEditTime: 2022-06-18 22:14:12
 * @LastEditors: wsy
 */
const isObject = (obj) => {
    return obj !== null && typeof obj === 'object';
};

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:13:31
 * @LastEditTime: 2022-06-20 00:26:05
 * @LastEditors: wsy
 */
function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // TODO vnode 是否是一个element
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    patch(subTree, container);
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const element = document.createElement(vnode.type);
    const { children } = vnode;
    if (Array.isArray(children)) {
        mountChildren(vnode, element);
    }
    else {
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
function mountChildren(vnode, element) {
    vnode.children.forEach((child) => {
        patch(child, element);
    });
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:41:46
 * @LastEditTime: 2022-06-19 18:11:31
 * @LastEditors: wsy
 */
function createVNode(type, props, children) {
    const vnode = { type, props, children };
    return vnode;
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:36:53
 * @LastEditTime: 2022-06-19 18:13:37
 * @LastEditors: wsy
 */
function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        },
    };
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 22:12:57
 * @LastEditTime: 2022-06-19 22:15:26
 * @LastEditors: wsy
 */
function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
