/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-24 20:11:22
 * @LastEditTime: 2022-06-25 19:30:58
 * @LastEditors: wsy
 */
export enum ShapeFlags {
  ELEMENT = 1, // 01 -> 0001
  STATEFUL_COMPONENT = 1 << 1, // 10 -> 0010
  TEXT_CHILDREN = 1 << 2, // 100 ->0100
  ARRAY_CHILDREN = 1 << 3, // 1000  ->1000
  SLOTS_CHILDREN = 1 << 4, // 10000 ->10000
}
