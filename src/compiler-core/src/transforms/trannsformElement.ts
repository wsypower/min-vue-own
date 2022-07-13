/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-12 20:42:51
 * @LastEditTime: 2022-07-13 12:59:46
 * @LastEditors: wsy
 */

import { NodeTypes, createVNodeCall } from '../ast';
import { CREATE_ELEMENT_VNODE } from '../runtimeHelpers';

export function transformElement(node: any, context: any): any {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      // 中间处理层
      const vnodeTag = `'${node.tag}'`;
      // props
      let vnodeProps;
      const children = node.children;
      let vnodeChildren = children[0];

      node.codegenNode = createVNodeCall(
        context,
        vnodeTag,
        vnodeProps,
        vnodeChildren
      );
    };
  }
}
