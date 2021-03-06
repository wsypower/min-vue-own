/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-12 11:24:30
 * @LastEditTime: 2022-07-12 20:44:04
 * @LastEditors: wsy
 */
import { NodeTypes } from '../ast';

/*
 * @Description:
 * @Author: wsy
 */
export function transformExpression(node: any) {
  if (node.type === NodeTypes.INTERPOLATION) {
    node.content = processExpression(node.content);
  }
}
function processExpression(node: any) {
  node.content = `_ctx.${node.content}`;
  return node;
}
