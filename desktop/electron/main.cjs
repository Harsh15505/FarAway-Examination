/**
 * FortisExam Desktop — Electron Main Process
 *
 * Creates kiosk-mode BrowserWindow.
 * Security hardening: no nodeIntegration, contextIsolation enabled,
 * devtools disabled, keyboard shortcuts intercepted.
 */

const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    // --- Kiosk Mode ---
    kiosk: true,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,

    // --- Security Hardening ---
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      devTools: false, // Disable in production
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  // Load the React app
  // In dev: Vite dev server
  // In prod: built files
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5174');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Prevent navigation away from the app
  mainWindow.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });

  // Prevent new windows
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

app.whenReady().then(() => {
  createWindow();

  // --- Block keyboard shortcuts ---
  // TODO: Intercept Ctrl+Shift+I, F12, Alt+Tab, Alt+F4, Ctrl+W
  globalShortcut.register('CommandOrControl+Shift+I', () => {});
  globalShortcut.register('F12', () => {});
  globalShortcut.register('CommandOrControl+W', () => {});
});

app.on('window-all-closed', () => {
  app.quit();
});
