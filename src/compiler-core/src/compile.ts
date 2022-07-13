import { baseParse } from './parse';
import { transform } from './transform';
import { transformExpression } from './transforms/transformExpression';
import { transformElement } from './transforms/trannsformElement';
import { transformText } from './transforms/transformText';
import { generate } from './codegen';
/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-14 00:57:21
 * @LastEditTime: 2022-07-14 00:58:45
 * @LastEditors: wsy
 */
export function baseCompile(template: string) {
  const ast: any = baseParse(template);
  transform(ast, {
    nodeTransforms: [transformExpression, transformElement, transformText],
  });
  return generate(ast);
}
