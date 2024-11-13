import { ChildProcess, spawn, execFile, exec, ExecFileException } from 'child_process';

export default class DnsServer {
  static #instance: DnsServer;
  configuration: any;
  process: ChildProcess;

  private constructor() {
    this.configuration = require('rc')('dnsproxy', {});
    this.start();
  }

  public static get instance(): DnsServer {
    if (!DnsServer.#instance) {
      DnsServer.#instance = new DnsServer();
    }

    return DnsServer.#instance;
  }

  public start() {
    try {
      this.process = execFile(
        'dns-proxy-win.exe',
        {
          cwd: 'src/main/scripts',
        }
      );

      this.process.on('message', (message) => {
        console.log('Message:', message.toString());
      });
      this.process?.stdout.on('data', (message) => {
        console.log('Message:', message.toString());
      });
      this.process.on('close', (code, signal) => {
        console.log('close', code, signal?.toString());
      });
      this.process.on('error', (error) => {
        console.log('error', error);
      });
    } catch (error) {
      console.log('error', error);
    }
  }

  public setConfiguration(configuration: any = {}) {
    this.configuration = configuration;
    require('rc')('dnsproxy', this.configuration);
  }
}
