/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-07-06 22:08:59
 * @LastEditTime: 2022-07-06 22:26:27
 * @LastEditors: wsy
 */
const queue: any[] = [];
let isFlushPending = false;
const p = Promise.resolve();
export function nextTick(fn: any) {
  return fn ? p.then(fn) : p;
}

export function queueJobs(job: any) {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  queueFlush();
}

function queueFlush() {
  if (isFlushPending) {
    return;
  }
  isFlushPending = true;
  nextTick(flushJobs);
}

function flushJobs() {
  isFlushPending = false;
  let job: any;
  while ((job = queue.shift())) {
    job && job();
  }
}
