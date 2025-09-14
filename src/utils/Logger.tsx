/* eslint-disable no-console */

import type { Debugger } from 'debug';

import Debug from 'debug';

export default class Logger {
  #debug: Debugger;
  #warn: Debugger;
  #error: Debugger;

  constructor(private readonly namespace: string) {
    if (!namespace.startsWith('server:')) {
      throw new Error("Logger namespace must start with 'server:'");
    }

    this.#debug = Debug(namespace);
    this.#debug.log = console.info.bind(console);

    this.#warn = Debug(namespace + ':warn');
    this.#warn.log = console.warn.bind(console);
    this.#warn.enabled = true;

    this.#error = Debug(namespace + ':error');
    this.#error.log = console.error.bind(console);
    this.#error.enabled = true;
  }

  debug(formatter: string, ...args: unknown[]) {
    this.#debug(formatter, ...args);
  }

  warn(formatter: string, ...args: unknown[]) {
    this.#warn(formatter, ...args);
  }

  error(formatter: string, ...args: unknown[]) {
    this.#error(formatter, ...args);
  }
}
