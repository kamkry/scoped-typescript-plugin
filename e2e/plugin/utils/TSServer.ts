// /* implementation taken from https://github.com/Quramy/ts-graphql-plugin/blob/master/e2e/fixtures/lang-server.js */
import { ChildProcess, fork } from 'child_process';
import { EventEmitter } from 'events';
import path from 'path';

export interface ServerResponse {
  command: string;
  event: string;
  type: string;
  body: any;
}

export interface ServerRequest {
  command?: string;
  event?: string;
  type?: string;
  arguments: any;
}

export class TSServer {
  public responses: ServerResponse[];

  private _responseEventEmitter: NodeJS.EventEmitter;
  private _responseCommandEmitter: NodeJS.EventEmitter;
  private _exitPromise: Promise<string>;
  private _isClosed: boolean;
  private _server: ChildProcess;
  private _seq: number;

  constructor() {
    this._responseEventEmitter = new EventEmitter();
    this._responseCommandEmitter = new EventEmitter();
    const tsserverPath = require.resolve(
      '/Users/jaroslaw.glegola/Documents/Praca/typescript-strict-plugin/e2e/fixtures/default-config/node_modules/typescript/lib/tsserver',
    );

    const server = fork(tsserverPath, {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      cwd: '/Users/jaroslaw.glegola/Documents/Praca/typescript-strict-plugin/e2e/fixtures/default-config',
      env: { TSS_LOG: '-logToFile true -file ./ts.log -level verbose' }, // creates tsserver log from tests
    });
    this._exitPromise = new Promise((resolve, reject) => {
      server.on('exit', (code: string) => resolve(code));
      server.on('error', (reason: string) => reject(reason));
    });
    server.stdout?.setEncoding('utf-8');
    server.stdout?.on('data', (data: string) => {
      const [, , res] = data.split('\n');
      const obj = JSON.parse(res) as ServerResponse;
      console.log('[TSServer.ts:46] -- obj = ', obj);
      if (obj.type === 'event') {
        this._responseEventEmitter.emit(obj.event, obj);
      } else if (obj.type === 'response') {
        this._responseCommandEmitter.emit(obj.command, obj);
      }
      this.responses.push(obj);
    });
    this._isClosed = false;
    this._server = server;
    this._seq = 0;
    this.responses = [];
  }

  send(command: ServerRequest) {
    const seq = ++this._seq;
    const req = JSON.stringify(Object.assign({ seq: seq, type: 'request' }, command)) + '\n';
    this._server.stdin?.write(req);
  }

  close() {
    if (!this._isClosed) {
      this._isClosed = true;
      this._server.stdin?.end();
    }
    return this._exitPromise;
  }

  waitEvent(eventName: string) {
    return new Promise((res) => this._responseEventEmitter.once(eventName, () => res(undefined)));
  }

  waitResponse(eventName: string) {
    return new Promise((res) => this._responseCommandEmitter.once(eventName, () => res(undefined)));
  }
}
