/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-01 10:54:22
 * @LastEditTime: 2022-07-01 10:56:45
 * @LastEditors: wsy
 */
import { createApp } from '../../lib/guide-mini-vue.esm.js';
import App from './App.js';

const rootContainer = document.querySelector('#app');
createApp(App).mount(rootContainer);
