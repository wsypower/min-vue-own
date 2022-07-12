/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-12 20:42:51
 * @LastEditTime: 2022-07-12 22:13:17
 * @LastEditors: wsy
 */

import { NodeTypes } from '../ast';
import { CREATE_ELEMENT_VNODE } from '../runtimeHelpers';

export function transformElement(node: any, context: any) {
  if (node.type === NodeTypes.ELEMENT) {
    context.helper(CREATE_ELEMENT_VNODE);
    // 中间处理层
    const vnodeTag = node.tag;
    // props
    let vnodeProps;
    const children = node.children;
    let vnodeChildren = children[0];

    const vnodeElement = {
      type: NodeTypes.ELEMENT,
      tag: vnodeTag,
      props: vnodeProps,
      children: vnodeChildren,
    };
    node.codegenNode = vnodeElement;
  }
}
