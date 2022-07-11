import { baseParse } from '../src/parse';
import { transform } from '../src/transform';
import { NodeTypes } from '../src/ast';
/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-10 23:14:09
 * @LastEditTime: 2022-07-10 23:37:54
 * @LastEditors: wsy
 */
describe('transform', () => {
  it('happy path', () => {
    const ast = baseParse('<div>hi,{{ message }}</div>');
    const plugin = (node: any) => {
      if (node.type === NodeTypes.TEXT) {
        node.content = node.content + 'mini-vue';
      }
    };
    transform(ast, {
      nodeTransforms: [plugin],
    });
    const nodeText = ast.children[0].children[0];
    expect(nodeText.content).toBe('hi,mini-vue');
  });
});
