/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-10 10:16:59
 * @LastEditTime: 2022-06-10 10:19:49
 * @LastEditors: wsy
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
};
