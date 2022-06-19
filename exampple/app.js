/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:33:38
 * @LastEditTime: 2022-06-19 16:33:49
 * @LastEditors: wsy
 */
export const App = {
  render() {
    return h('div', 'hi,' + this.msg);
  },
  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};
