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
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:41:46
 * @LastEditTime: 2022-07-06 10:33:46
 * @LastEditors: wsy
 */
const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        component: null,
        el: null,
        shapeFlag: getShapeFlag(type),
        key: props === null || props === void 0 ? void 0 : props.key,
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
 * @LastEditTime: 2022-07-03 23:22:56
 * @LastEditors: wsy
 */
const extend = Object.assign;
const isObject = (obj) => {
    return obj !== null && typeof obj === 'object';
};
const hasChanged = (newVlaue, oldValue) => {
    return !Object.is(newVlaue, oldValue);
};
function hasOwn(obj, key) {
    return Reflect.has(obj, key);
}
const EMPTY_PBJ = {};

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-22 00:22:09
 * @LastEditTime: 2022-07-06 10:18:33
 * @LastEditors: wsy
 */
const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => {
        return i.slots;
    },
    $props: (i) => {
        return i.props;
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
let activeEffect;
const targetMap = new Map();
let shouldTrack = false;
class ReactiveEffect {
    constructor(fn, scheduler) {
        this.deps = [];
        this.active = true;
        this._fn = fn;
        this.scheduler = scheduler;
    }
    run() {
        if (!this.active) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        const ret = this._fn();
        shouldTrack = false;
        return ret;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}
function track(target, key) {
    // targetMap => target => key => ReactiveEffect
    if (!isTracking())
        return;
    let depMap = targetMap.get(target);
    if (!depMap) {
        depMap = new Map();
        targetMap.set(target, depMap);
    }
    let dep = depMap.get(key);
    if (!dep) {
        dep = new Set();
        depMap.set(key, dep);
    }
    trackEffects(dep);
}
function trackEffects(dep) {
    if (dep.has(activeEffect)) {
        return;
    }
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
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
function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn);
    extend(_effect, options);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
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
        if (!isReadonly) {
            track(target, key);
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
 * @Date: 2022-06-18 21:22:27
 * @LastEditTime: 2022-06-19 03:20:04
 * @LastEditors: wsy
 */
class RefImpl {
    constructor(value) {
        this.__v_isRef = true;
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(value) {
        if (hasChanged(value, this._rawValue)) {
            this._value = convert(value);
            this._rawValue = value;
            triggerEffects(this.dep);
        }
    }
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function ref(value) {
    return new RefImpl(value);
}
function isRef(raw) {
    return !!raw['__v_isRef'];
}
function unRef(raw) {
    return isRef(raw) ? raw.value : raw;
}
function proxyRefs(raw) {
    return new Proxy(raw, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return (target[key].value = value);
            }
            else {
                return Reflect.set(target, key, value);
            }
        },
    });
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:19:56
 * @LastEditTime: 2022-07-06 10:36:49
 * @LastEditors: wsy
 */
function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        next: null,
        setupState: {},
        el: null,
        emit: () => { },
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
        subTree: null,
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
        console.log(setupResult);
        instance.setupState = proxyRefs(setupResult);
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
 * @Date: 2022-06-27 12:27:20
 * @LastEditTime: 2022-07-06 11:03:37
 * @LastEditors: wsy
 */
function provide(key, value) {
    var _a;
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = (_a = currentInstance.parent) === null || _a === void 0 ? void 0 : _a.provides;
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const { parent } = currentInstance;
        const parentProvides = parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue();
            }
            else {
                return defaultValue;
            }
        }
    }
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:36:53
 * @LastEditTime: 2022-06-28 21:48:29
 * @LastEditors: wsy
 */
function createAppApi(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                const vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            },
        };
    };
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-06 10:55:10
 * @LastEditTime: 2022-07-06 10:56:18
 * @LastEditors: wsy
 */
function shouldUpdateComponent(preVnode, nextVnode) {
    const { props: preProps } = preVnode;
    const { props: nextProps } = nextVnode;
    for (const key in nextProps) {
        if (nextProps[key] !== preProps[key]) {
            return true;
        }
    }
    return false;
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-06 22:08:59
 * @LastEditTime: 2022-07-06 22:26:27
 * @LastEditors: wsy
 */
const queue = [];
let isFlushPending = false;
const p = Promise.resolve();
function nextTick(fn) {
    return fn ? p.then(fn) : p;
}
function queueJobs(job) {
    if (!queue.includes(job)) {
        queue.push(job);
    }
    queueFlush();
}
function queueFlush() {
    if (isFlushPending) {
        return;
    }
    isFlushPending = true;
    nextTick(flushJobs);
}
function flushJobs() {
    isFlushPending = false;
    let job;
    while ((job = queue.shift())) {
        job && job();
    }
}

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 18:13:31
 * @LastEditTime: 2022-07-07 11:16:37
 * @LastEditors: wsy
 */
function createRenderer(options) {
    const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert, remove: hostRemove, setElementText: hostSetElementText, } = options;
    function render(vnode, container) {
        patch(null, vnode, container, null);
    }
    function patch(oldVnode, vnode, container, parentComponent, anchor = null) {
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
                }
                else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(oldVnode, vnode, container, parentComponent, anchor);
                }
                break;
        }
    }
    function processComponent(oldVnode, vnode, container, parentComponent, anchor) {
        if (!oldVnode) {
            mountComponent(vnode, container, parentComponent, anchor);
        }
        else {
            updateComponent(oldVnode, vnode);
        }
    }
    function updateComponent(oldVnode, vnode, container, parentComponent, anchor) {
        const instance = (vnode.component = oldVnode.component);
        if (shouldUpdateComponent(oldVnode, vnode)) {
            console.log('-------------组件的更新----------------');
            instance.next = vnode;
            instance.update();
        }
        else {
            console.log('-----------组件不应该更新-------------');
            vnode.el = oldVnode.el;
            instance.vnode = vnode;
        }
    }
    function mountComponent(initialVnode, container, parentComponent, anchor) {
        const instance = (initialVnode.component = createComponentInstance(initialVnode, parentComponent));
        setupComponent(instance);
        setupRenderEffect(instance, initialVnode, container, anchor);
    }
    function setupRenderEffect(instance, initialVnode, container, anchor) {
        instance.update = effect(() => {
            if (!instance.isMounted) {
                console.log('init');
                const { proxy } = instance;
                const subTree = (instance.subTree = instance.render.call(proxy));
                patch(null, subTree, container, instance, anchor);
                initialVnode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
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
        }, {
            scheduler() {
                console.log('scheduler-update');
                queueJobs(instance.update);
            },
        });
    }
    function updateComponentPreRender(instance, nextVnode) {
        instance.vnode = nextVnode;
        instance.next = null;
        instance.props = nextVnode.props;
    }
    function processElement(oldVnode, vnode, container, parentComponent, anchor = null) {
        if (!oldVnode) {
            mountElement(vnode, container, parentComponent, anchor);
        }
        else {
            patchElement(oldVnode, vnode, container, parentComponent, anchor);
        }
    }
    function patchElement(oldVnode, vnode, container, parentComponent, anchor = null) {
        //更新对比
        console.log('patchElement');
        const oldPros = oldVnode.props || EMPTY_PBJ;
        const newPros = vnode.props || EMPTY_PBJ;
        const el = (vnode.el = oldVnode.el);
        patchChildren(oldVnode, vnode, el, parentComponent, anchor);
        patchProps(el, oldPros, newPros);
    }
    function patchChildren(oldVnode, vnode, container, parentComponent, anchor = null) {
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
        }
        else {
            if (prevShapeFlap & ShapeFlags.TEXT_CHILDREN) {
                // 把老的 text 清空
                hostSetElementText(container, '');
                mountChildren(vnodeChildren, container, parentComponent);
            }
            else {
                // 老节点和新节点都是array
                patchKeyedChildren(oldVnodeChildren, vnodeChildren, container, parentComponent, anchor);
            }
        }
    }
    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor = null) {
        let i = 0;
        let e1 = c1.length - 1;
        let e2 = c2.length - 1;
        function isSomeVnodeType(n1, n2) {
            return n1.type === n2.type && n1.key === n2.key;
        }
        // 左侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i];
            if (isSomeVnodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            }
            else {
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
            }
            else {
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
        }
        else if (i > e2) {
            console.log('老节点比新节点长');
            while (i <= e1) {
                hostRemove(c1[i].el);
                i++;
            }
        }
        else {
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
                }
                else {
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
                }
                else {
                    console.log('执行了更新操作');
                    if (newIndex >= maxNewIndexSoFar) {
                        maxNewIndexSoFar = newIndex;
                    }
                    else {
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
                    }
                    else {
                        console.log('等于最长递增子序列索引，不需要移动位置');
                        j--;
                    }
                }
            }
        }
    }
    function unmountedChildren(children) {
        for (let i = 0; i < children.length; i++) {
            const el = children[i].el;
            hostRemove(el);
        }
    }
    function patchProps(el, oldPros, newPros) {
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
    function mountElement(vnode, container, parentComponent, anchor = null) {
        const element = (vnode.el = hostCreateElement(vnode.type));
        const { children, shapeFlag } = vnode;
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // array_children
            mountChildren(vnode.children, element, parentComponent);
        }
        else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
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
    function mountChildren(children, element, parentComponent) {
        children.forEach((child) => {
            patch(null, child, element, parentComponent);
        });
    }
    function processFragment(oldVnode, vnode, container, parentComponent) {
        mountChildren(vnode.children, container, parentComponent);
    }
    function processText(oldVnode, vnode, container) {
        const { children } = vnode;
        const textNode = (vnode.el = document.createTextNode(children));
        container.appendChild(textNode);
    }
    return {
        createApp: createAppApi(render),
    };
}
function getSequence(arr) {
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
                }
                else {
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

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-28 21:38:02
 * @LastEditTime: 2022-07-02 20:07:23
 * @LastEditors: wsy
 */
function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, preVal, nextVal) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, nextVal);
    }
    else {
        if (nextVal === null || nextVal === undefined) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, nextVal);
        }
    }
}
function insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor);
}
function remove(child) {
    const parent = child.parentNode;
    if (parent) {
        parent.removeChild(child);
    }
}
function setElementText(el, text) {
    el.textContent = text;
}
const renderer = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText,
});
function createApp(...args) {
    return renderer.createApp(...args);
}

export { createApp, createRenderer, createTextVNode, getCurrentInstance, h, inject, nextTick, provide, proxyRefs, ref, renderSlots };
