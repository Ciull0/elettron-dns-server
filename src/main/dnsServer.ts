import { Straightforward, middleware } from 'straightforward';
import { BrowserWindow, ipcMain } from 'electron';

export default class DnsServer {
  static #instance: DnsServer;
  mainWindow: BrowserWindow;

  private constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.start();
  }

  public async start() {
    try {
      // Start proxy server
      const sf = new Straightforward();
      await sf.listen(9191);
      console.log(`Proxy listening on http://localhost:9191`);
      // Log http requests

      // Log connect (https) requests
      sf.onConnect.use(async ({ req }, next) => {
        const formattedHeaders = {};
        for (let i = 0; i < req.rawHeaders.length; i = i + 2) {
          formattedHeaders[req.rawHeaders[i]] = req.rawHeaders[i + 1];
        }
        this.mainWindow.webContents.send('request:new', {
          method: req.method,
          statusCode: req.statusCode,
          url: req.url,
          headers: formattedHeaders,
          host: req.locals.urlParts.host,
        });
        return next();
      });

      // Use built-in middleware to mock responses for all http requests
      sf.onRequest.use(middleware.echo);

      this.mainWindow.webContents.on('newRedirect', (...args) => {
        console.log('data', args);
      });
    } catch (error) {
      console.log('error', error);
    }
  }
}
