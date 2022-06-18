import { computed } from '../computed';
import { reactive } from '../reactive';

/*
 * @Description:computed.spec.ts
 * @Author: wsy
 * @Date: 2022-06-19 03:05:11
 * @LastEditTime: 2022-06-19 03:32:30
 * @LastEditors: wsy
 */
describe('computed', () => {
  it('happy path', () => {
    const user = reactive({ age: 1 });
    const age = computed(() => user.age);
    expect(age.value).toBe(1);
  });
  it('should computed lazily', () => {
    const value = reactive({ foo: 1 });
    const getter = jest.fn(() => value.foo);
    const cValue = computed(getter);

    // lazily
    expect(getter).not.toHaveBeenCalled();
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
