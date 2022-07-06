/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-27 11:04:49
 * @LastEditTime: 2022-07-06 21:42:19
 * @LastEditors: wsy
 */
import { h, ref } from '../../lib/guide-mini-vue.esm.js';

export default {
  name: 'App',
  setup() {
    const count = ref(1);
    function onClick() {
      for (let i = 0; i < 100; i++) {
        console.log('update');
        count.value = i;
      }
    }
    return {
      count,
      onClick,
    };
  },
  render() {
    const button = h('button', { onClick: this.onClick }, 'update');
    const p = h('p', {}, `count: ${this.count}`);
    return h('div', {}, [p, button]);
  },
};
