/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-10 13:20:47
 * @LastEditTime: 2022-06-13 01:34:09
 * @LastEditors: wsy
 */
let activeEffect: ReactiveEffect;
const targetMap = new Map();

class ReactiveEffect {
  public _fn!: () => any;
  constructor(fn: () => any) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    this._fn();
  }
}

export function track(target: Record<string, any>, key: string | symbol) {
  // targetMap => target => key => ReactiveEffect
  let depMap = targetMap.get(target);
  if (!depMap) {
    depMap = new Map();
    targetMap.set(target, depMap);
  }
  let dep = depMap.get(key);
  if (!dep) {
    dep = new Set();
    depMap.set(key, dep);
  }
  dep.add(activeEffect);
}

export function trigger(target: Record<string, any>, key: string | symbol) {
  const depMap = targetMap.get(target);
  const dep = depMap.get(key);
  for (const effect of dep) {
    effect.run();
  }
}
export function effect(fn: () => any): any {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
