/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 20:22:42
 * @LastEditTime: 2022-07-14 01:25:01
 * @LastEditors: wsy
 */
export * from './runtime-dom';
export * from './reactivity';

import { baseCompile } from './compiler-core/src';
import * as runtimeDom from './runtime-dom';
import { registerRuntimeCompiler } from './runtime-dom';
function compileToFunction(template: string) {
  const { code } = baseCompile(template);
  const render = new Function('Vue', code)(runtimeDom);
  return render;
}

registerRuntimeCompiler(compileToFunction);
