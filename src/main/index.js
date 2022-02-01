import url from 'url';
import path from 'path';
import { app, BrowserWindow } from 'electron';
import * as remoteMain from '@electron/remote/main';

remoteMain.initialize();

const isDev = process.env.NODE_ENV !== 'production';

/**
 * @type {import('electron').BrowserWindow | null} win
 */
let win = null;

const installExtensions = async () => {
  const { default: installer, others } = await import('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = (process.env.EXTENSIONS ?? '').split(',').map((name) => others[name]);

  installer(extensions, forceDownload).catch(console.log);
};

const createWindow = async () => {
  if (isDev) {
    await installExtensions();
  }

  win = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 1024,
    minHeight: 728,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  remoteMain.enable(win.webContents);

  win.loadURL(
    isDev
      ? 'http://localhost:8080'
      : url.format({
          protocol: 'file',
          slashes: true,
          pathname: path.resolve(__dirname, 'index.html'),
        }),
  );

  win.on('ready-to-show', () => {
    if (!win) {
      throw new Error('"win" is not defined');
    }

    win.show();
  });

  win.on('closed', () => {
    win = null;
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on('activate', () => {
      if (!win) createWindow();
    });
  })
  .catch(console.log);
