/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-07 11:26:33
 * @LastEditTime: 2022-07-07 21:13:47
 * @LastEditors: wsy
 */

import { NodeTypes } from './ast';
const enum TagType {
  Start,
  End,
}
export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}
function parseChildren(context: any) {
  const nodes = [];
  let node;
  const s = context.source;
  if (s.startsWith('{{')) {
    node = parseInterpolation(context);
  } else if (s.startsWith('<')) {
    if (/[a-z]/i.test(s[1])) {
      console.log('parse element');
      node = parseElement(context);
    }
  }
  if (!node) {
    node = parseText(context);
  }
  nodes.push(node);
  return nodes;
}
function parseText(context: any): any {
  // 1.获取当前的内容
  // 2.推进到下一个位置
  const content = parseTextData(context, context.source.length);
  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function parseTextData(context: any, length: number) {
  const content = context.source.slice(0, length);
  advanceBy(context, content.length);
  return content;
}

function parseElement(context: any) {
  /**
   * 1. 解析tag
   * 2. 删除处理完成的代码
   */
  const element = parseTag(context, TagType.Start);
  parseTag(context, TagType.End);
  return element;
}
function parseTag(context: any, TagType: any) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  const tag = match[1];
  advanceBy(context, match[0].length);
  advanceBy(context, 1);
  if (TagType === TagType.End) {
    return;
  }
  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
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
  const rawContent = parseTextData(context, rawContentLength);
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
