/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-10 13:20:47
 * @LastEditTime: 2022-06-18 21:49:57
 * @LastEditors: wsy
 */
import { extend } from '../shared/index';
let activeEffect: ReactiveEffect;
const targetMap = new Map();
let shouldTrack = false;
export class ReactiveEffect {
  public _fn!: () => any;
  public deps: any[] = [];
  public active: Boolean = true;
  public onStop?: () => void;
  public scheduler?: () => void;
  constructor(fn: () => any) {
    this._fn = fn;
  }
  run() {
    if (!this.active) {
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this;
    const ret = this._fn();
    shouldTrack = false;
    return ret;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

export function track(target: Record<string, any>, key: string | symbol) {
  // targetMap => target => key => ReactiveEffect
  if (!isTracking()) return;

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
  trackEffects(dep);
}

export function trackEffects(dep: Set<ReactiveEffect>) {
  if (dep.has(activeEffect)) {
    return;
  }
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target: Record<string, any>, key: string | symbol) {
  const depMap = targetMap.get(target);
  const dep = depMap.get(key);
  triggerEffects(dep);
}

export function triggerEffects(dep: Set<ReactiveEffect>) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn: () => any, options: any = {}): any {
  const _effect = new ReactiveEffect(fn);
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner: any) {
  runner.effect.stop();
}

const a = { 1: 'a' };

const s = new Set();
