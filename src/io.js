/* IO monad taken from monet.js */
/*
The MIT License (MIT)
Copyright (c) 2016 Chris Myers
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/* eslint-disable fp/no-this, fp/no-nil, fp/no-mutation, fp/no-throw */
import * as R from 'ramda';


export const IO = (effectFn) => {
  return new IO.fn.init(effectFn)
};

IO.of = (a) => {
  return IO(() => {
    return a;
  })
};

IO.fn = IO.prototype = {
  init: (effectFn) => {
    if (!R.is(Function, effectFn))
      throw 'IO requires a function';
    this.effectFn = effectFn;
  },
  map: (fn) => {
    return IO(function () {
      return fn(this.effectFn());
    })
  },
  bind: (fn) => {
    return IO(() => {
      return fn(this.effectFn())
        .run();
    })
  },
  ap: (ioWithFn) => {
    return ioWithFn.map((fn) => fn(this.effectFn()));
  },
  run: () => this.effectFn()
};

IO.fn.init.prototype = IO.fn;

IO.prototype.perform = IO.prototype.performUnsafeIO = IO.prototype.run;
