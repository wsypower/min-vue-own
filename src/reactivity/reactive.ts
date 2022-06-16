/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-10 12:48:59
 * @LastEditTime: 2022-06-16 21:43:32
 * @LastEditors: wsy
 */

import { mutableHandles, readonlyHandles } from './baseHandlers';

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function reactive(raw: Record<string, any>) {
  return createActiveObject(raw, mutableHandles);
}

export function readonly(raw: Record<string, any>) {
  return createActiveObject(raw, readonlyHandles);
}

export function isReactive(raw: Record<string, any>) {
  return !!raw[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(raw: Record<string, any>) {
  return !!raw[ReactiveFlags.IS_READONLY];
}

function createActiveObject(raw: any, basieHandles: any) {
  return new Proxy(raw, basieHandles);
}
