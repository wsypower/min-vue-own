'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-22 00:22:09
 * @LastEditTime: 2022-06-22 00:30:06
 * @LastEditors: wsy
 */
const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter();
        }
    },
};

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:19:56
 * @LastEditTime: 2022-06-22 00:21:08
 * @LastEditors: wsy
 */
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        el: null,
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
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
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
 * @Date: 2022-06-24 20:11:22
 * @LastEditTime: 2022-06-24 20:36:58
 * @LastEditors: wsy
 */
var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:13:31
 * @LastEditTime: 2022-06-24 23:22:40
 * @LastEditors: wsy
 */
function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    const { shapeFlag } = vnode;
    // TODO vnode 是否是一个element
    if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
    }
    else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVnode, container) {
    const instance = createComponentInstance(initialVnode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, initialVnode, container) {
    console.log(instance);
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    initialVnode.el = subTree.el;
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const element = (vnode.el = document.createElement(vnode.type));
    const { children, shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // array_children
        mountChildren(vnode, element);
    }
    else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // text_children
        element.textContent = children;
    }
    if (vnode.props) {
        for (const key in vnode.props) {
            const val = vnode.props[key];
            const isOn = (key) => /^on[A-Z]/.test(key);
            if (isOn(key)) {
                const event = key.slice(2).toLowerCase();
                element.addEventListener(event, val);
            }
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
 * @LastEditTime: 2022-06-24 20:44:34
 * @LastEditors: wsy
 */
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlag: getShapeFlag(type),
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string'
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT;
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
