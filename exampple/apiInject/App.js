/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-27 11:04:49
 * @LastEditTime: 2022-06-27 22:02:36
 * @LastEditors: wsy
 */
// 组件 provide 和 inject 功能
import { provide, inject, h } from '../../lib/guide-mini-vue.esm.js';
const ProviderOne = {
  setup() {
    provide('foo', 'foo');
    provide('bar', 'bar');
  },
  render() {
    return h('div', {}, [h('p', {}, 'providerOne'), h(ProviderTwo)]);
  },
};

const ProviderTwo = {
  setup() {
    // override parent value

    provide('foo', 'fooOverride');
    // provide('baz', 'baz');
    const foo = inject('foo');
    console.log(foo);
    // 这里获取的 foo 的值应该是 "foo"
    // 这个组件的子组件获取的 foo ，才应该是 fooOverride
    return {
      foo,
    };
  },
  render() {
    return h('div', {}, [
      h('p', {}, 'providerTwo-+--' + this.foo),
      h(Consumer),
    ]);
  },
};

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo');
    const bar = inject('bar');
    const baz = inject('baz', 'bazDefault');
    return {
      foo,
      bar,
      baz,
    };
    // const baz = inject('baz');
  },
  render() {
    return h('div', {}, `Consumer-${this.foo}-${this.bar}-${baz}`);
  },
};

export default {
  name: 'App',
  setup() {
    // return () => h('div', {}, [h('p', {}, 'apiInject'), h(ProviderOne)]);
  },
  render() {
    return h('div', {}, [h('p', {}, 'apiInject'), h(ProviderOne)]);
  },
};
