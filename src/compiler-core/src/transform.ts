import { NodeTypes } from './ast';

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
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node);
  }
  transformChildren(node, context);
  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper('toDisplayString');
      break;

    default:
      break;
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
  root.codegenNode = root.children[0];
}
