/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-27 11:04:49
 * @LastEditTime: 2022-06-30 20:32:29
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

    const props = ref({
      foo: 'foo',
      bar: 'bar',
    });
    const onChangePropsDemo1 = () => {
      props.value.foo = 'new-foo';
    };
    const onChangePropsDemo2 = () => {
      props.value.foo = undefined;
    };
    const onChangePropsDemo3 = () => {
      props.value = {
        foo: 'foo',
      };
    };
    return {
      count,
      onClick,
      props,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3,
    };
  },
  render() {
    return h('div', { id: 'root', ...this.props }, [
      h('div', {}, 'count:' + this.count),
      h('button', { onClick: this.onClick }, 'click'),
      h(
        'button',
        { onClick: this.onChangePropsDemo1 },
        'changeProps - 值改变了 -修改'
      ),
      h(
        'button',
        { onClick: this.onChangePropsDemo2 },
        'changeProps - 值变成了undefined -删除'
      ),
      h(
        'button',
        { onClick: this.onChangePropsDemo3 },
        'changeProps - key在新的里面没有了 -删除'
      ),
    ]);
  },
};
