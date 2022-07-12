/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-07 11:26:33
 * @LastEditTime: 2022-07-12 12:58:45
 * @LastEditors: wsy
 */

import { NodeTypes } from './ast';
const enum TagType {
  Start,
  End,
}
export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context, []));
}
function parseChildren(context: any, ancestors: any = []) {
  const nodes = [];
  while (!isEnd(context, ancestors)) {
    let node;
    const s = context.source;
    if (s.startsWith('{{')) {
      node = parseInterpolation(context);
    } else if (s[0] === '<') {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors);
      }
    }
    if (!node) {
      node = parseText(context);
    }
    nodes.push(node);
  }
  return nodes;
}
function isEnd(context: any, ancestors: any) {
  // 1. source 有值的时候
  // 2. 当遇到结束标签的时候
  const s = context.source;
  if (s.startsWith('</')) {
    for (let i = 0; i < ancestors.length; i++) {
      const tag = ancestors[i].tag;
      if (startsWithEndTagOpen(s, tag)) {
        return true;
      }
    }
  }
  return !s;
}
function parseText(context: any): any {
  // 1.获取当前的内容
  // 2.推进到下一个位置
  let endTokens = ['<', '{{'];
  let endIndex = context.source.length;
  for (let i = endTokens.length - 1; i >= 0; i--) {
    const endToken = endTokens[i];
    const index = context.source.indexOf(endToken);
    if (index !== -1 && index < endIndex) {
      endIndex = index;
    }
  }

  const content = parseTextData(context, endIndex);
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

function parseElement(context: any, ancestors: any = []) {
  /**
   * 1. 解析tag
   * 2. 删除处理完成的代码
   */
  const element: any = parseTag(context, TagType.Start);
  ancestors.push(element);
  element.children = parseChildren(context, ancestors);
  ancestors.pop();
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End);
  } else {
    throw new Error('unclosed tag');
  }

  return element;
}
function startsWithEndTagOpen(source: any, tag: any) {
  return (
    source.startsWith('</') &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag
  );
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
  advanceBy(context, closeDelimiter.length);
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
    type: NodeTypes.ROOT,
    children,
  };
}

function createParserContext(content: any) {
  return {
    source: content,   
  };
}
