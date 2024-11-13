import { Straightforward, middleware } from 'straightforward';
import { ipcMain } from 'electron';


export default class DnsServer {
  static #instance: DnsServer;
  configuration: Object;
  process: ChildProcess;

  private constructor() {
    this.start();
  }

  public static get instance(): DnsServer {
    if (!DnsServer.#instance) {
      DnsServer.#instance = new DnsServer();
    }

    return DnsServer.#instance;
  }

  public async start() {
    try {
      // Start proxy server
      const sf = new Straightforward();
      await sf.listen(9191);
      console.log(`Proxy listening on http://localhost:9191`);

      // Log http requests
      sf.onRequest.use(async ({ req, res }, next) => {
        console.log(`http request: ${req.url}`);
        ipcMain.emit('request:new', req);
        // Note the common middleware pattern, use `next()`
        // to pass the request to the next handler.
        return next();
      });

      // Log connect (https) requests
      sf.onConnect.use(async ({ req }, next) => {
        console.log(`connect request: ${req.url}`);
        ipcMain.emit('request:new', req);
        return next();
      });

      // Use built-in middleware to mock responses for all http requests
      sf.onRequest.use(middleware.echo);
    } catch (error) {
      console.log('error', error);
    }
  }

  public setConfiguration(configuration: any = {}) {
    this.configuration = configuration;
  }
}
