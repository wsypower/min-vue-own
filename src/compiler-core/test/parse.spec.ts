import { baseParse } from '../src/parse';
import { NodeTypes } from '../src/ast';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-07 11:16:52
 * @LastEditTime: 2022-07-08 19:22:13
 * @LastEditors: wsy
 */
describe('Parse', () => {
  describe('Interpolation', () => {
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
        children: [],
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

  test('hello world', () => {
    const ast = baseParse('<div>hi,{{ message }}</div>');
    console.log(JSON.stringify(ast.children[0]));
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeTypes.TEXT,
          content: 'hi,',
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message',
          },
        },
      ],
    });
  });
  test('next element', () => {
    const ast = baseParse('<div><p>hi</p>hi,{{ message }}</div>');
    console.log(JSON.stringify(ast.children[0]));
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: 'p',
          children: [
            {
              type: NodeTypes.TEXT,
              content: 'hi',
            },
          ],
        },
        {
          type: NodeTypes.TEXT,
          content: 'hi,',
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message',
          },
        },
      ],
    });
  });
});
