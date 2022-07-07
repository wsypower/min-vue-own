import { baseParse } from '../src/parse';
import { NodeTypes } from '../src/ast';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-07 11:16:52
 * @LastEditTime: 2022-07-07 21:09:43
 * @LastEditors: wsy
 */
describe('Parse', () => {
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

describe('Element', () => {
  it('simple element div', () => {
    const ast = baseParse('<div></div>');
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
    });
  });
});

describe('Text', () => {
  it('simple Text', () => {
    const ast = baseParse('some text');
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.TEXT,
      content: 'some text',
    });
  });
});
