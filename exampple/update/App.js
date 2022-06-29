/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-27 11:04:49
 * @LastEditTime: 2022-06-29 19:18:11
 * @LastEditors: wsy
 */
import { h, ref } from '../../lib/guide-mini-vue.esm.js';

export default {
  name: 'App',
  setup() {
    // return () => h('div', {}, [h('p', {}, 'apiInject'), h(ProviderOne)]);
    const count = ref(0);
    const onClick = () => {
      console.log('按钮被点击了');
      count.value++;
    };
    return {
      count,
      onClick,
    };
  },
  render() {
    return h('div', { id: 'root' }, [
      h('div', {}, 'count:' + this.count),
      h('button', { onClick: this.onClick }, 'click'),
    ]);
  },
};
