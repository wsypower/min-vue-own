/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:31:34
 * @LastEditTime: 2022-06-19 22:37:46
 * @LastEditors: wsy
 */
import { createApp } from '../lib/guide-mini-vue.esm.js';
import { App } from './app.js';
const rootContainer = document.querySelector('#app');
createApp(App).mount(rootContainer);
