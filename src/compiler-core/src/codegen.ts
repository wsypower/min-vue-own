import { NodeTypes } from './ast';

/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-11 00:24:29
 * @LastEditTime: 2022-07-11 02:11:57
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
      const { push } = context;
      push(`${node.content}`);
      break;

    default:
      break;
  }
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source: string) {
      context.code += source;
    },
  };
  return context;
}

function genFunctionPreamble(ast: any, context: any): void {
  const { push } = context;
  const VueBindings = `Vue`;
  const aliasHelper = (s: string) => `${s}:_${s}`;
  push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBindings}`);
  push('\n ');
}
