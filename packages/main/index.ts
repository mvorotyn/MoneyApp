import electron, { app, BrowserWindow, shell } from 'electron'
import { release } from 'os'
import { join } from 'path'
import './samples/electron-store'
import './samples/node-fetch'
import './samples/execa'

import installExtension, {
	REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer'
// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
	app.quit()
	process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {
	win = new BrowserWindow({
		title: 'Main window',
		webPreferences: {
			preload: join(__dirname, '../preload/index.cjs'),
			nodeIntegration: false,
		},
		width: 1600,
		height: 600,
		icon: join(__dirname, '../../build/icon.ico'),
	})
	// console.log('icon path:', join(__dirname, '../../build/icon.ico'))

	if (app.isPackaged || process.env['DEBUG']) {
		win.loadFile(join(__dirname, '../renderer/index.html'))
		win.removeMenu()
	} else {
		// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
		const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

		win.loadURL(url)
		win.webContents.openDevTools()
		win.removeMenu()

		const options = {
			loadExtensionOptions: { allowFileAccess: true },
		}
		installExtension(REACT_DEVELOPER_TOOLS.id, options)
			.then(name => console.log(`Added Extension:  ${name}`))
			.catch(err => console.log('An error occurred: ', err))
	}

	// Test active push message to Renderer-process
	win.webContents.on('did-finish-load', async () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString())
	})

	// Make all links open with the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url)
		return { action: 'deny' }
	})
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
	win = null
	if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
	if (win) {
		// Focus on the main window if the user tried to open another
		if (win.isMinimized()) win.restore()
		win.focus()
	}
})

app.on('activate', () => {
	const allWindows = BrowserWindow.getAllWindows()
	if (allWindows.length) {
		allWindows[0].focus()
	} else {
		createWindow()
	}
})
