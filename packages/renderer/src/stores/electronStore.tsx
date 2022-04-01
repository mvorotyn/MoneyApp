import {
	initialFoodTableData,
	initialHealthTableData,
	initialHouseTableData,
	initialTaxesTableData,
	initialTransportTableData,
} from './initialData'

type ElectronDataRegistry = { [key: string]: any }
interface CustomElectronStore {
	initialDataRegistry: ElectronDataRegistry
	loadFromRegistry: (key: string) => any
	get: (key: string) => any
	set: (key: string, value: any) => Promise<void>
}
const store = {
	async get(key: string) {
		const { invoke } = window.ipcRenderer
		let value = await invoke('electron-store', 'get', key)
		try {
			value = JSON.parse(value)
		} finally {
			return value
		}
	},
	async set(key: string, value: any) {
		const { invoke } = window.ipcRenderer
		let val = value
		try {
			if (value && typeof value === 'object') {
				val = JSON.stringify(value)
			}
		} finally {
			await invoke('electron-store', 'set', key, val)
		}
	},
}

class ElectronStore implements CustomElectronStore {
	get = store.get
	set = store.set
	initialDataRegistry: ElectronDataRegistry = {
		dataForHealthTable: initialHealthTableData,
		dataForTransportTable: initialTransportTableData,
		dataForFoodTable: initialFoodTableData,
		dataForHouseTable: initialHouseTableData,
		dataForTaxesTable: initialTaxesTableData,
	}
	async loadFromRegistry(key: string) {
		const data = await store.get(key)
		if (data && data.length > 0) {
			return data
		} else {
			return [...this.initialDataRegistry[key]]
		}
	}
}

// (async () => {
//     //await store.set('Date.now', Date.now())
//     console.log('electron-store!!!! ->', 'Date.now:', await store.get('Date.now'))
//     console.log('electron-store ->', 'path:', await window.ipcRenderer.invoke('electron-store', 'path'))
//   })();
export const proxyStore = new ElectronStore()

// const storePropertyHandler = {
// 	get(target: { [x: string]: any }, property: any) {
// 		// console.log(`Proxy trying to get property: ${property} `)
// 		if (target[property]) {
// 			return target[property]
// 		} else {

// 			return store[property]
// 		}
// 	},
// }
// export const proxyStore = new Proxy(electronStore, storePropertyHandler);
