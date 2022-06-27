'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-24 23:27:59
 * @LastEditTime: 2022-06-24 23:44:39
 * @LastEditors: wsy
 */
function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-14 13:26:28
 * @LastEditTime: 2022-06-24 23:36:04
 * @LastEditors: wsy
 */
const extend = Object.assign;
const isObject = (obj) => {
    return obj !== null && typeof obj === 'object';
};
function hasOwn(obj, key) {
    return Reflect.has(obj, key);
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-22 00:22:09
 * @LastEditTime: 2022-06-25 16:32:49
 * @LastEditors: wsy
 */
const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => {
        return i.slots;
    },
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-10 13:20:47
 * @LastEditTime: 2022-06-19 03:47:36
 * @LastEditors: wsy
 */
const targetMap = new Map();
function trigger(target, key) {
    const depMap = targetMap.get(target);
    const dep = depMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-16 21:07:42
 * @LastEditTime: 2022-06-17 11:05:23
 * @LastEditors: wsy
 */
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
const mutableHandles = {
    get,
    set,
};
const readonlyHandles = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key ${key} is readonly`);
        return true;
    },
};
const shallowReadonlyHandles = extend({}, readonlyHandles, {
    get: shallowReadonlyGet,
});

function reactive(raw) {
    return createActiveObject(raw, mutableHandles);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandles);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandles);
}
function createActiveObject(raw, basieHandles) {
    if (!isObject(raw)) {
        console.warn('target must be Object');
        return;
    }
    return new Proxy(raw, basieHandles);
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-25 14:30:52
 * @LastEditTime: 2022-06-25 21:20:31
 * @LastEditors: wsy
 */
function emit(instance, event, ...arg) {
    console.log(event);
    const { props } = instance;
    const camelize = (str) => {
        return str.replace(/-(\w)/g, (all, letter) => {
            return letter ? letter.toUpperCase() : '';
        });
    };
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const toHandlerKey = (key) => {
        return key ? 'on' + capitalize(key) : '';
    };
    const handlerName = toHandlerKey(event);
    const handler = props[camelize(handlerName)];
    handler && handler(...arg);
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-24 20:11:22
 * @LastEditTime: 2022-06-25 19:30:58
 * @LastEditors: wsy
 */
var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
    ShapeFlags[ShapeFlags["SLOTS_CHILDREN"] = 16] = "SLOTS_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

/*
 * @Description: slots
 * @Author: wsy
 * @Date: 2022-06-25 16:24:13
 * @LastEditTime: 2022-06-25 19:31:49
 * @LastEditors: wsy
 */
function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        slots[key] = (props) => normalizeSlotValue(value(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:19:56
 * @LastEditTime: 2022-06-27 15:35:33
 * @LastEditors: wsy
 */
function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        el: null,
        emit: () => { },
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
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
let currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:41:46
 * @LastEditTime: 2022-06-27 12:37:13
 * @LastEditors: wsy
 */
const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
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
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        if (typeof children === 'object') {
            vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN;
        }
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string'
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:13:31
 * @LastEditTime: 2022-06-27 14:16:21
 * @LastEditors: wsy
 */
function render(vnode, container, parentComponent) {
    patch(vnode, container, parentComponent);
}
function patch(vnode, container, parentComponent) {
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
            }
            else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                processComponent(vnode, container, parentComponent);
            }
            break;
    }
}
function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent);
}
function mountComponent(initialVnode, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container, instance);
    initialVnode.el = subTree.el;
}
function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent);
}
function mountElement(vnode, container, parentComponent) {
    const element = (vnode.el = document.createElement(vnode.type));
    const { children, shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // array_children
        mountChildren(vnode, element, parentComponent);
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
            else {
                element.setAttribute(key, val);
            }
        }
    }
    container.appendChild(element);
}
function mountChildren(vnode, element, parentComponent) {
    vnode.children.forEach((child) => {
        patch(child, element, parentComponent);
    });
}
function processFragment(vnode, container, parentComponent) {
    mountChildren(vnode, container, parentComponent);
}
function processText(vnode, container) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.appendChild(textNode);
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

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-25 17:09:30
 * @LastEditTime: 2022-06-26 01:20:54
 * @LastEditors: wsy
 */
function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment, {}, slot(props));
        }
    }
    return [];
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-27 12:27:20
 * @LastEditTime: 2022-06-27 14:50:43
 * @LastEditors: wsy
 */
function provide(key, value) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const { provides } = currentInstance;
        provides[key] = value;
    }
}
function inject(key) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const { parent } = currentInstance;
        const parentProvides = parent.provides;
        return parentProvides[key];
    }
}

exports.createApp = createApp;
exports.createTextVNode = createTextVNode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.renderSlots = renderSlots;
