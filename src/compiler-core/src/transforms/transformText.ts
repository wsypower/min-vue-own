import { NodeTypes } from '../ast';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-12 21:28:48
 * @LastEditTime: 2022-07-12 22:05:48
 * @LastEditors: wsy
 */
export function transformText(node: any) {
  function isText(node: any) {
    return (
      node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION
    );
  }
  if (node.type === NodeTypes.ELEMENT) {
    const { children } = node;
    let currentContainer;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (isText(child)) {
        for (let j = i + 1; j < children.length; j++) {
          const next = children[j];
          if (isText(next)) {
            if (!currentContainer) {
              currentContainer = children[i] = {
                type: NodeTypes.COMPOUND_EXPRESSION,
                children: [child],
              };
            }
            currentContainer.children.push('+');
            currentContainer.children.push(next);
            children.splice(j, 1);
            j--;
          } else {
            currentContainer = undefined;
            break;
          }
        }
      }
    }
  }
}
