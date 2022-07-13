/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-13 13:01:23
 * @LastEditTime: 2022-07-13 13:01:25
 * @LastEditors: wsy
 */
import { NodeTypes } from './ast';
export function isText(node: any) {
  return node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION;
}
