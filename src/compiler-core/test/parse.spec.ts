import { baseParse } from '../src/parse';
import { NodeTypes } from '../src/ast';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-07 11:16:52
 * @LastEditTime: 2022-07-07 14:49:00
 * @LastEditors: wsy
 */
describe.only('Parse', () => {
  it('simple interpolation', () => {
    const ast = baseParse('{{ message  }}');
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.INTERPOLATION,
      content: {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content: 'message',
      },
    });
  });
});
