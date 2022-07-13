import { generate } from '../src/codegen';
import { baseParse } from '../src/parse';
import { transform } from '../src/transform';
import { transformExpression } from '../src/transforms/transformExpression';
import { transformElement } from '../src/transforms/trannsformElement';
import { transformText } from '../src/transforms/transformText';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-11 00:21:29
 * @LastEditTime: 2022-07-13 11:22:28
 * @LastEditors: wsy
 */
describe('codegen', () => {
  it('string ', () => {
    const ast = baseParse('hi');
    transform(ast);
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
  it('interpolation', () => {
    const ast = baseParse('{{message}}');
    transform(ast, {
      nodeTransforms: [transformExpression],
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
  it('element', () => {
    const ast: any = baseParse('<div>hi,{{message}}</div>');
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText],
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
});
