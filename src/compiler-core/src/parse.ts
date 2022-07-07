/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-07 11:26:33
 * @LastEditTime: 2022-07-07 14:49:20
 * @LastEditors: wsy
 */

import { NodeTypes } from './ast';

export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}
function parseChildren(context: any) {
  const nodes = [];
  let node;
  if (context.source.startsWith('{{')) {
    node = parseInterpolation(context);
  }

  nodes.push(node);
  return nodes;
}
function parseInterpolation(context: any) {
  //{{message}}
  const openDelimiter = '{{';
  const closeDelimiter = '}}';
  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );
  advanceBy(context, openDelimiter.length);
  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = context.source.slice(0, rawContentLength);
  const content = rawContent.trim();
  advanceBy(context, rawContentLength + closeDelimiter.length);
  return {
    type: NodeTypes.INTERPOLATION,
    content: { type: NodeTypes.SIMPLE_EXPRESSION, content: content },
  };
}

function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length);
}

function createRoot(children: any) {
  return {
    children,
  };
}

function createParserContext(content: any) {
  return {
    source: content,
  };
}
