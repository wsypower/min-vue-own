/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-25 14:30:52
 * @LastEditTime: 2022-06-25 21:20:31
 * @LastEditors: wsy
 */
export function emit(instance: any, event: any, ...arg: any[]) {
  console.log(event);
  const { props } = instance;
  const camelize = (str: string) => {
    return str.replace(/-(\w)/g, (all, letter) => {
      return letter ? letter.toUpperCase() : '';
    });
  };
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const toHandlerKey = (key: string) => {
    return key ? 'on' + capitalize(key) : '';
  };
  const handlerName = toHandlerKey(event);
  const handler = props[camelize(handlerName)];
  handler && handler(...arg);
}
