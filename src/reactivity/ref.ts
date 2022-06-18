import { hasChanged } from '../shared';
import { isObject } from '../shared/index';
import {
  ReactiveEffect,
  trackEffects,
  triggerEffects,
  isTracking,
} from './effect';
import { reactive } from './reactive';
/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-18 21:22:27
 * @LastEditTime: 2022-06-19 03:20:04
 * @LastEditors: wsy
 */

class RefImpl {
  private _value: any;
  public dep!: Set<ReactiveEffect>;
  private _rawValue!: any;
  public __v_isRef: boolean = true;
  constructor(value: any) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(value: any) {
    if (hasChanged(value, this._rawValue)) {
      this._value = convert(value);
      this._rawValue = value;
      triggerEffects(this.dep);
    }
  }
}

function trackRefValue(ref: RefImpl) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

function convert(value: any) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value: any) {
  return new RefImpl(value);
}

export function isRef(raw: any) {
  return !!raw['__v_isRef'];
}

export function unRef(raw: any) {
  return isRef(raw) ? raw.value : raw;
}

export function proxyRefs(raw: any) {
  return new Proxy(raw, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value): any {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
