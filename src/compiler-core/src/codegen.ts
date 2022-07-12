import {
  helperMapName,
  TO_DISPLAY_STRING,
  CREATE_ELEMENT_VNODE,
} from './runtimeHelpers';
import { NodeTypes } from './ast';
import { isString } from '../../shared/index';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-11 00:24:29
 * @LastEditTime: 2022-07-12 22:20:45
 * @LastEditors: wsy
 */
export function generate(ast: any) {
  const context = createCodegenContext();
  const { push } = context;
  genFunctionPreamble(ast, context);
  push('return ');
  const functionName = 'render';
  const args = ['_ctx', '_cache'];
  const signature = args.join(', ');
  push(`function ${functionName}(${signature}){`);
  push(`return `);
  genNode(ast.codegenNode, context);
  push(`}`);
  return {
    code: context.code,
  };
}
function genNode(node: any, context: any) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context);
      break;
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context);
      break;
    case NodeTypes.ELEMENT:
      genElement(node, context);
      break;
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpressions(node, context);
      break;
    default:
      break;
  }
}

function genCompoundExpressions(node: any, context: any) {
  const { push } = context;
  const { children } = node;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (isString(child)) {
      push(child);
    } else {
      genNode(child, context);
    }
  }
}

function genElement(node: any, context: any) {
  const { push, helper } = context;
  const { tag, children } = node;

  push(`_${helper(CREATE_ELEMENT_VNODE)}("${tag}", null,`);
  genNode(children, context);
  push(')');
}
function genText(node: any, context: any) {
  const { push } = context;
  push(`'${node.content}'`);
}

function genInterpolation(node: any, context: any) {
  const { push } = context;
  push(`_${context.helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(')');
}

function genExpression(node: any, context: any) {
  const { push } = context;
  push(`${node.content}`);
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source: string) {
      context.code += source;
    },
    helper(key: any) {
      return `${helperMapName[key]}`;
    },
  };
  return context;
}

function genFunctionPreamble(ast: any, context: any): void {
  const { push } = context;
  const VueBindings = `Vue`;
  const aliasHelper = (s: string) => `${helperMapName[s]}:_${helperMapName[s]}`;
  if (ast.helpers.length > 0) {
    push(
      `const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBindings}`
    );
  }

  push('\n ');
}
