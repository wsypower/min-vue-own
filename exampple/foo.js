/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-24 23:05:58
 * @LastEditTime: 2022-06-27 01:56:39
 * @LastEditors: wsy
 */
import {
  h,
  renderSlots,
  createTextVNode,
  getCurrentInstance,
} from '../lib/guide-mini-vue.esm.js';
export const Foo = {
  name: 'foo',
  setup(props, { emit }) {
    console.log(props);
    const instance = getCurrentInstance();
    console.log(instance);
    const emitAdd = () => {
      console.log('emitAdd---->');
      emit('addFoo');
    };
    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      'button',
      {
        onClick: this.emitAdd,
      },
      'emitAdd'
    );
    const foo = h('p', { class: 'foo' }, [createTextVNode('这是一个文本节点')]);
    const age = '我18岁了';
    return h('div', { class: 'foo' }, [
      renderSlots(this.$slots, 'header', { age }),
      // createTextVNode('这是一个文本节点'),
      foo,
      btn,
      renderSlots(this.$slots, 'footer'),
    ]);
  },
};
