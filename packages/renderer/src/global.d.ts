export {}

declare global {
	interface Window {
		// Expose some Api through preload script
		fs: typeof import('fs')
		ipcRenderer: import('electron').IpcRenderer
		removeLoading: () => void
	}

	interface IDescItem {
		name: string
		icon: any //ForwardRefExoticComponent<P>;
	}
}
