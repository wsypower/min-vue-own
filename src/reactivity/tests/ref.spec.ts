import { effect, stop } from '../effect';
import { isRef, proxyRefs, ref, unRef } from '../ref';
import { reactive } from '../reactive';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-18 21:19:03
 * @LastEditTime: 2022-06-19 03:16:48
 * @LastEditors: wsy
 */
describe('ref', () => {
  it('happy path', () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });
  it('should be reactive', () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // 相同的值不会触发依赖更新
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  });
  it('scheduler', () => {
    let dummy;
    let run: any;
    const obj = ref(1);
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const runner = effect(
      () => {
        dummy = obj.value;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.value++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });

  it('stop', () => {
    let dummy;
    const obj = ref(1);
    const runner = effect(() => {
      dummy = obj.value;
    });
    obj.value = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.value = 3;
    expect(dummy).toBe(2);
    runner();
    expect(dummy).toBe(3);
  });

  it('onStop', () => {
    const obj = ref(1);
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.value;
      },
      { onStop }
    );
    stop(runner);
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});

describe('is Ref', () => {
  it('isRef', () => {
    const a = ref(1);
    const b = reactive({ a: 1 });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(b)).toBe(false);
  });
});

describe('unRef', () => {
  it('unRef', () => {
    const a = ref(1);
    const b = reactive({ a: 1 });
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  });
});

describe('proxyRefs', () => {
  it('proxyRefs', () => {
    const user = {
      age: ref(10),
      name: 'xiaohong',
    };
    const proxy = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxy.age).toBe(10);
    expect(proxy.name).toBe('xiaohong');

    proxy.age = 20;
    expect(proxy.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxy.age = ref(10);
    expect(proxy.age).toBe(10);
    expect(user.age.value).toBe(10);
  });
});
