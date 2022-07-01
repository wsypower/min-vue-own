/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-01 10:54:22
 * @LastEditTime: 2022-07-01 11:26:12
 * @LastEditors: wsy
 */
// 老的是一个数组
// 新的是一个文本
import { h, ref } from '../../lib/guide-mini-vue.esm.js';

const nextChildren = 'newChildren';
const prevChildren = [h('div', {}, 'A'), h('div', {}, 'B')];

export default {
  name: 'ArrayToText',
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;
    return {
      isChange,
    };
  },
  render() {
    const self = this;
    return self.isChange === true
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren);
  },
};
