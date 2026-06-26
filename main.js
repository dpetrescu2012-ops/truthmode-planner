const { app, BrowserWindow, Menu, MenuItem, ipcMain, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

if (process.platform === 'win32') {
  app.setAppUserModelId('com.truthmode.planner');
}

let mainWindow;

function createWindow() {
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: iconPath,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    }
  });

  const startUrl = `file://${path.join(__dirname, 'src', 'index.html')}`;
  mainWindow.once('ready-to-show', () => {
    if (mainWindow) mainWindow.show();
  });

  mainWindow.loadURL(startUrl).catch((err) => {
    dialog.showErrorBox(
      'TRUTHMODE Planner failed to load',
      err && err.message ? err.message : String(err)
    );
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Right-click context menu with cut/copy/paste/select all
  mainWindow.webContents.on('context-menu', (event, params) => {
    const menu = new Menu();
    if (params.isEditable) {
      menu.append(new MenuItem({ role: 'cut',       enabled: params.editFlags.canCut }));
      menu.append(new MenuItem({ role: 'copy',      enabled: params.editFlags.canCopy }));
      menu.append(new MenuItem({ role: 'paste',     enabled: params.editFlags.canPaste }));
      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(new MenuItem({ role: 'selectAll' }));
    } else if (params.selectionText) {
      menu.append(new MenuItem({ role: 'copy' }));
    }
    if (menu.items.length > 0) menu.popup({ window: mainWindow });
  });
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            if (mainWindow) {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'About TRUTHMODE Planner',
                message: 'TRUTHMODE Planner',
                detail: `Version ${app.getVersion()}\nExecutive Planner 2026`
              });
            }
          }
        },
        {
          label: 'Check for Updates...',
          click: () => {
            autoUpdater.checkForUpdates().catch((err) => {
              dialog.showMessageBox(mainWindow, {
                type: 'error',
                title: 'Update Check Failed',
                message: 'Could not check for updates.',
                detail: err && err.message ? err.message : String(err)
              });
            });
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ─── AUTO UPDATE ──────────────────────────────────────────────────────────────
// Electron equivalent of a web app's service-worker auto-update: checks the
// configured "publish" feed (see package.json build.publish) for a newer
// version, downloads it in the background, and prompts to restart once it's
// ready. Unlike a web page, a desktop app can't just reload — restarting is
// required to swap the running binary, so we ask first instead of forcing it.
const UPDATE_CHECK_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours
let updateCheckTimer = null;

function setupAutoUpdater() {
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version);
  });

  autoUpdater.on('update-downloaded', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Ready',
      message: `TRUTHMODE Planner ${info.version} has been downloaded.`,
      detail: 'Restart now to apply it, or it will install automatically next time you quit.',
      buttons: ['Restart Now', 'Later'],
      defaultId: 0,
      cancelId: 1
    }).then(({ response }) => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on('error', (err) => {
    console.error('Auto-update error:', err == null ? 'unknown' : (err.stack || err.message || err));
  });

  // Check shortly after launch, then on a recurring interval while running.
  setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 5000);
  updateCheckTimer = setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), UPDATE_CHECK_INTERVAL_MS);
}

app.on('ready', () => {
  createMenu();
  createWindow();
  setupAutoUpdater();
});

app.on('window-all-closed', () => {
  if (updateCheckTimer) clearInterval(updateCheckTimer);
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC for auto-save
ipcMain.on('save-data', (event, data) => {
  console.log('Data saved:', data);
});
