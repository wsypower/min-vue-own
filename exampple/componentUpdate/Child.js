/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-06 10:15:03
 * @LastEditTime: 2022-07-06 11:04:56
 * @LastEditors: wsy
 */
import { h, ref, inject } from '../../lib/guide-mini-vue.esm.js';
export default {
  name: 'App',
  setup(props, { emit }) {
    const z = inject('z');
    return { z };
  },
  render() {
    return h('div', {}, [
      h('div', {}, 'child - props - msg:' + this.$props.msg),
      h('div', {}, 'child - props - inject:' + this.z),
    ]);
  },
};
