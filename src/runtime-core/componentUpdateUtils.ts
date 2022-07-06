/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-06 10:55:10
 * @LastEditTime: 2022-07-06 10:56:18
 * @LastEditors: wsy
 */

export function shouldUpdateComponent(preVnode: any, nextVnode: any) {
  const { props: preProps } = preVnode;
  const { props: nextProps } = nextVnode;
  for (const key in nextProps) {
    if (nextProps[key] !== preProps[key]) {
      return true;
    }
  }
  return false;
}
