/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-27 11:04:49
 * @LastEditTime: 2022-07-06 11:05:23
 * @LastEditors: wsy
 */
import { h, ref, provide } from '../../lib/guide-mini-vue.esm.js';
import Child from './Child.js';
export default {
  name: 'App',
  setup() {
    const z = ref(0);
    provide('z', z);
    const msg = ref('123');
    const count = ref(1);
    window.msg = msg;
    const changeProvide = () => {
      z.value++;
    };
    const changeChildProps = () => {
      msg.value = '456';
    };

    const changeCount = () => {
      count.value++;
    };
    return {
      msg,
      changeChildProps,
      changeProvide,
      changeCount,
      count,
    };
  },
  render() {
    return h('div', {}, [
      h('div', {}, '你好'),
      h('button', { onClick: this.changeChildProps }, 'change child props'),
      h('button', { onClick: this.changeProvide }, 'change child provide'),
      h(Child, { msg: this.msg }),
      h('button', { onClick: this.changeCount }, 'change self count'),
      h('p', {}, 'count' + this.count),
    ]);
  },
};
