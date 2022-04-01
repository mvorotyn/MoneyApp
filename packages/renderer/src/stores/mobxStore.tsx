import { message } from 'antd/lib/'
import { toJS, values } from 'mobx'
import {
	addMiddleware,
	IModelType,
	IOptionalIType,
	ISimpleType,
	IStateTreeNode,
	types,
	_NotCustomized,
} from 'mobx-state-tree'
import { NonEmptyObject } from 'mobx-state-tree/dist/internal'
import { mstLog } from 'mst-log'
import { createContext, useContext } from 'react'
import shortid from 'shortid'
import { proxyStore } from './electronStore'
// import moment from 'moment'

const today = () =>
	new Date().toISOString().slice(0, 10).replace('-', '/').replace('-', '/')

const User = types.model({
	id: types.identifier,
	name: types.optional(types.string, ''),
})

const TableItem = types.model({
	key: types.identifier,
	name: types.optional(types.string, ''),
	count: types.number,
	description: types.optional(types.string, ''),
	date: types.optional(types.string, ''),
})

const RootStore = types
	.model({
		// users: types.map(User),
		collapsed: types.boolean,
		loading: types.boolean,
		selectedIndex: types.number,
		selectedRowKeys: types.array(types.string),
		tableDataIsLoaded: types.boolean,
		dataForTransportTable: types.array(TableItem),
		dataForHealthTable: types.array(TableItem),
		dataForFoodTable: types.array(TableItem),
		dataForHouseTable: types.array(TableItem),
		dataForTaxesTable: types.array(TableItem),
		curentTableData: types.optional(types.array(TableItem), []),
		ApiAccessToken: types.optional(types.string, ''),
		// dataFor: types.array(TableItem),

		isModalOpen: types.boolean,
		isLoginModalOpen: types.boolean,
		isTableVisible: types.boolean,
		formOperationName: types.optional(types.string, ''),
		formOperationDescription: types.optional(types.string, ''),
		formMoneySpendAmount: types.optional(types.number, 0),
		formOperationDate: types.optional(types.string, ''),
		formLogin: types.optional(types.string, ''),
		formPassword: types.optional(types.string, ''),
	})
	// .views((self) => ({
	//   get pendingCount() {
	//     return values(self.todos).filter((todo) => !todo.done).length;
	//   },
	//   get completedCount() {
	//     return values(self.todos).filter((todo) => todo.done).length;
	//   },
	//   getTodosWhereDoneIs(done: any) {
	//     return values(self.todos).filter((todo) => todo.done === done);
	//   },
	// }))
	.actions(self => {
		const handleClick = (event: { key: any }) => {
			self.isTableVisible = false
			backupCurrentTableData()
			// console.log(self.isTableVisible);
			if (parseInt(event.key) > 0) {
				self.isTableVisible = true
			}
			self.selectedIndex = parseInt(event.key)
			// console.log("selected menu item: " + self.selectedIndex);
			changeDataForTable()
		}

		function setApiAccessToken(token: string) {
			self.ApiAccessToken = token
		}

		function openModal() {
			self.isModalOpen = true
		}

		function closeModal() {
			self.isModalOpen = false
		}

		function openLoginModal() {
			self.isLoginModalOpen = true
		}

		function closeLoginModal() {
			self.isLoginModalOpen = false
		}

		function tableVisible() {
			return self.isTableVisible
		}

		function rebuildCurrentTableDataFrom(
			array:
				| ({
						key: string
						name: string
						count: number
						description: string
						date: string
				  } & NonEmptyObject &
						IStateTreeNode<
							IModelType<
								{
									key: ISimpleType<string>
									name: IOptionalIType<ISimpleType<string>, [undefined]>
									count: ISimpleType<number>
									description: IOptionalIType<ISimpleType<string>, [undefined]>
									date: IOptionalIType<ISimpleType<string>, [undefined]>
								},
								{},
								_NotCustomized,
								_NotCustomized
							>
						>)[]
				| undefined
		) {
			self.curentTableData.spliceWithArray(0, self.curentTableData.length, array)
		}
		function changeDataForTable() {
			if (self.selectedIndex == 1) {
				// Array.prototype.push.apply(self.curentTableData, dataTransportTableCopy)
				// dataTransportTableCopy.forEach(item=> {self.curentTableData.push(types.model.);});
				// self.curentTableData.splice(0, self.curentTableData.length);

				rebuildCurrentTableDataFrom(
					toJS(self.dataForTransportTable) // nonObservable js copy
				)
			}
			if (self.selectedIndex == 2) {
				rebuildCurrentTableDataFrom(toJS(self.dataForHealthTable))
			}

			if (self.selectedIndex == 3) {
				rebuildCurrentTableDataFrom(toJS(self.dataForFoodTable))
			}

			if (self.selectedIndex == 4) {
				rebuildCurrentTableDataFrom(toJS(self.dataForHouseTable))
			}

			if (self.selectedIndex == 5) {
				rebuildCurrentTableDataFrom(toJS(self.dataForTaxesTable))
			}
		}

		function backupCurrentTableData() {
			const curentTableDataCopy = toJS(self.curentTableData)

			if (self.selectedIndex == 1) {
				self.dataForTransportTable.spliceWithArray(
					0,
					self.dataForTransportTable.length,
					curentTableDataCopy
				)
			}
			if (self.selectedIndex == 2) {
				self.dataForHealthTable.spliceWithArray(
					0,
					self.dataForHealthTable.length,
					curentTableDataCopy
				)
			}
			if (self.selectedIndex == 3) {
				self.dataForFoodTable.spliceWithArray(
					0,
					self.dataForFoodTable.length,
					curentTableDataCopy
				)
			}
			if (self.selectedIndex == 4) {
				self.dataForHouseTable.spliceWithArray(
					0,
					self.dataForHouseTable.length,
					curentTableDataCopy
				)
			}
			if (self.selectedIndex == 5) {
				self.dataForTaxesTable.spliceWithArray(
					0,
					self.dataForTaxesTable.length,
					curentTableDataCopy
				)
			}
		}

		async function deleteItemFromTable(index: number) {
			self.curentTableData.remove(self.curentTableData[index])
			// await Store.set("dataForTransportTable", self.dataForTransportTable);
			// eslint-disable-next-line no-use-before-define
			await electronSaveCurrentTable()
		}

		function modalFormChangeOperationName(event: { target: { value: string } }) {
			self.formOperationName = event.target.value
		}

		function modalFormChangeOperationDescription(event: {
			target: { value: string }
		}) {
			self.formOperationDescription = event.target.value
		}

		function modalFormChangeMoneySpendAmount(money: number) {
			self.formMoneySpendAmount = money
		}

		function modalFormChangeLogin(login: string) {
			self.formLogin = login
		}

		function modalFormChangePassword(password: string) {
			self.formPassword = password
		}

		async function electronSaveCurrentTable() {
			if (self.selectedIndex == 1) {
				await proxyStore.set('dataForTransportTable', self.curentTableData)
			}
			if (self.selectedIndex == 2) {
				await proxyStore.set('dataForHealthTable', self.curentTableData)
			}
			if (self.selectedIndex == 3) {
				await proxyStore.set('dataForFoodTable', self.curentTableData)
			}
		}

		function modalFormChangeOperationDate(date: moment.Moment | null): void {
			if (date) {
				self.formOperationDate = date
					.format()
					.slice(0, 10)
					.replace('-', '/')
					.replace('-', '/')
			}
		}

		async function addTableItem() {
			const newItem = {
				key: shortid.generate(),
				name: self.formOperationName,
				count: self.formMoneySpendAmount,
				description: self.formOperationDescription,
				date: self.formOperationDate,
			}

			self.curentTableData.unshift(newItem)

			self.isModalOpen = false
			// await Store.set("dataForTransportTable", self.dataForTransportTable);
			await electronSaveCurrentTable()

			message.success('Новая запись успешно добавлена', 4)
		}

		//   toggle = () => {
		//     this.setState({
		//       collapsed: !this.state.collapsed,
		//     });
		//   };

		const resetForm = () => {
			self.formMoneySpendAmount = 1
			self.formOperationDescription = ''
			self.formOperationName = ''
			self.formOperationDescription = ''
		}

		function resetLoginForm() {
			self.formLogin = ''
			self.formPassword = ''
		}
		function onRowSelectChange(selectedRowKeys: any) {
			console.log('selectedRowKeys changed: ', selectedRowKeys)
			self.selectedRowKeys = selectedRowKeys
		}

		function getSpendedSummaryForAllCategories() {
			let moneySpendedCounter = 0
			self.dataForTransportTable.forEach(value => {
				moneySpendedCounter += value.count
			})
			self.dataForHealthTable.forEach(value => {
				moneySpendedCounter += value.count
			})
			self.dataForFoodTable.forEach(value => {
				moneySpendedCounter += value.count
			})
			self.dataForHouseTable.forEach(value => {
				moneySpendedCounter += value.count
			})

			self.dataForTaxesTable.forEach(value => {
				moneySpendedCounter += value.count
			})

			return moneySpendedCounter
		}

		function spendedOnTransportCategory() {
			let moneySpendedCounter = 0
			self.dataForTransportTable.forEach(value => {
				moneySpendedCounter += value.count
			})
			return moneySpendedCounter
		}

		function spendedOnHealthCategory() {
			let moneySpendedCounter = 0
			self.dataForHealthTable.forEach(value => {
				moneySpendedCounter += value.count
			})
			return moneySpendedCounter
		}

		function spendedOnFoodCategory() {
			let moneySpendedCounter = 0
			self.dataForFoodTable.forEach(value => {
				moneySpendedCounter += value.count
			})
			return moneySpendedCounter
		}

		function spendedOnHouseCategory() {
			let moneySpendedCounter = 0
			self.dataForHouseTable.forEach(value => {
				moneySpendedCounter += value.count
			})
			return moneySpendedCounter
		}

		function spendedOnTaxesCategory() {
			let moneySpendedCounter = 0
			self.dataForTaxesTable.forEach(value => {
				moneySpendedCounter += value.count
			})
			return moneySpendedCounter
		}

		return {
			handleClick,
			tableVisible,
			deleteItemFromTable,
			openModal,
			closeModal,
			modalFormChangeOperationName,
			modalFormChangeOperationDescription,
			modalFormChangeMoneySpendAmount,
			addTableItem,
			modalFormChangeOperationDate,
			onRowSelectChange,
			changeDataForTable,
			electronSaveCurrentTable,
			backupCurrentTableData,
			getSpendedSummaryForAllCategories,
			spendedOnTransportCategory,
			spendedOnHealthCategory,
			spendedOnFoodCategory,
			spendedOnHouseCategory,
			spendedOnTaxesCategory,
			resetForm,
			openLoginModal,
			closeLoginModal,
			modalFormChangeLogin,
			modalFormChangePassword,
			setApiAccessToken,
			resetLoginForm,
		}
	})

export const store = RootStore.create({
	collapsed: false,
	tableDataIsLoaded: true,
	loading: false,
	selectedIndex: 0,
	selectedRowKeys: [],
	isModalOpen: false,
	isLoginModalOpen: false,
	isTableVisible: false,
	formOperationDate: today(),
	formMoneySpendAmount: 1,
	dataForTransportTable: await proxyStore.loadFromRegistry(
		'dataForTransportTable'
	),
	dataForHealthTable: await proxyStore.loadFromRegistry('dataForHealthTable'),
	dataForFoodTable: await proxyStore.loadFromRegistry('dataForFoodTable'),
	dataForHouseTable: await proxyStore.loadFromRegistry('dataForHouseTable'),
	dataForTaxesTable: await proxyStore.loadFromRegistry('dataForTaxesTable'),
})

addMiddleware(store, mstLog())

export const StoreContext = createContext(store)
StoreContext.displayName = 'Store Context'

export const StoreProvider: React.FC = ({ children }): JSX.Element => {
	// const store = useLocalStore(createStore);

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
// https://dev.to/margaretkrutikova/how-to-mobx-state-tree-react-typescript-3d5j
