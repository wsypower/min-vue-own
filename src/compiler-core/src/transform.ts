/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-12 08:13:02
 * @LastEditTime: 2022-07-13 11:14:51
 * @LastEditors: wsy
 */
import { NodeTypes } from './ast';
import { TO_DISPLAY_STRING } from './runtimeHelpers';

interface Options {
  nodeTransforms?: any[];
}

function createTransformsContext(root: any, options?: Options) {
  const context = {
    root,
    nodeTransforms: options?.nodeTransforms ?? [],
    helpers: new Map(),
    helper(k: string) {
      context.helpers.set(k, 1);
    },
  };
  return context;
}

function traverseNode(node: any, context: any) {
  const nodeTransforms = context.nodeTransforms;
  const exitFns: any = [];
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    const onExit = transform(node, context);
    if (onExit) {
      exitFns.push(onExit);
    }
  }
  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      transformChildren(node, context);
    default:
      break;
  }
  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}

function transformChildren(node: any, context: any) {
  const children = node.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      traverseNode(child, context);
    }
  }
}

export function transform(root: any, options?: Options) {
  const context = createTransformsContext(root, options);
  traverseNode(root, context);
  createRootCodegen(root);
  root.helpers = [...context.helpers.keys()];
}

function createRootCodegen(root: any) {
  const child = root.children[0];
  if (child.type === NodeTypes.ELEMENT) {
    root.codegenNode = child.codegenNode;
  } else {
    root.codegenNode = root.children[0];
  }
}
