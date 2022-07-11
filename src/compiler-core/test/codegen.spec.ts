import { generate } from '../src/codegen';
import { baseParse } from '../src/parse';
import { transform } from '../src/transform';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-11 00:21:29
 * @LastEditTime: 2022-07-11 01:45:14
 * @LastEditors: wsy
 */
describe('codegen', () => {
  it('string ', () => {
    const ast = baseParse('hi');
    transform(ast);
    const { code } = generate(ast);
    console.log(code);
    expect(code).toMatchSnapshot();
  });
  it('interpolation', () => {
    const ast = baseParse('{{message}}');
    transform(ast);
    const { code } = generate(ast);
    console.log(code);
    expect(code).toMatchSnapshot();
  });
});
