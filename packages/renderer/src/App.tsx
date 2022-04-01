import { observer } from 'mobx-react-lite'
import { Button, Layout, message, Tooltip, Typography } from 'antd'
import { version as appVersion } from '../../../package.json'
import { useStore } from './stores/mobxStore'
import 'antd/dist/antd.css'
import AppDashboard from './components/AppDashboard'
import AppModal from './components/AppModal'
import AppSideMenu from './components/AppSideMenu'
import AppTable from './components/AppTable'
import { SyncOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import AppLoginModal from './components/AppLoginModal'
import {
	_NotCustomized,
} from 'mobx-state-tree'
import { apiSyncTableData } from './API/syncApi'

const { Title } = Typography
const { Header, Content, Footer } = Layout

// const App: FunctionComponent<{}> = observer((props) => {
function App() {
	const store = useStore()
	// console.log("store:", store);
	// console.log(store.isModalOpen, 'modalDialog visibility');

	return (
		<Layout>
			<AppModal />
			<AppLoginModal />
			<AppSideMenu />

			<Layout className='site-layout'>
				<AppHeader />
				<Content
					className='site-layout-background'
					// style={{display: "flex"}}
				>
					{store.isTableVisible ? <AppTable /> : <AppDashboard />}
				</Content>

				<Footer style={{ textAlign: 'center' }}>Mark Vorotyntsev ©2022</Footer>
			</Layout>
		</Layout>
	)
}

function AppHeader() {
	const store = useStore()

	useEffect(() => {})

	async function synchronizeTask() {
		var trotError = false
		var noAuthError = false

		if (store.ApiAccessToken.length < 1) {
			message.warning('Сперва залогиньтесь!', 2)
			return
		}
		const dataArr = [
			{ title: 'FoodTable', tableData: store.dataForFoodTable.toJSON() },
			{ title: 'TransportTable', tableData: store.dataForTransportTable.toJSON() },
			{ title: 'HealthTable', tableData: store.dataForHealthTable.toJSON() },
			{ title: 'HouseTable', tableData: store.dataForHouseTable.toJSON() },
			{ title: 'TaxesTable', tableData: store.dataForTaxesTable.toJSON() },
		]

		for (let i = 0; i < dataArr.length; i++) {
			
			let response = await apiSyncTableData(dataArr[i], store.ApiAccessToken)
			console.log('response ', i, response)
			if (response.statusCode === 429) {
				trotError = true
			} else if (response.statusCode === 401) {
				noAuthError = true
			}
		}

		// console.log('trotError ', trotError)
		if (trotError) {
			message.warning('Слишком частые запросы к серверу!', 1)
		} else if (noAuthError) {
			message.warning('Cинхронизация не удалась! Ошибка авторизации', 1)
		} else {
			message.warning('Данные успешно синхронизированы!', 1)
		}
	}

	return (
		<Header
			className='site-layout-background'
			style={{ color: 'white', padding: 0 }}
		>
			<Title level={4} style={{ color: 'white', padding: 0, margin: '4px 14px' }}>
				MoneyApp{' '}
				<a style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.6em' }}>
					version: {appVersion}
				</a>
				<a style={{ color: 'white', padding: 0, margin: '0px 20px 20px 130px' }}>
					Server:
				</a>
				<Tooltip title='synchronize'>
					<Button
						size='large'
						onClick={synchronizeTask}
						type='primary'
						style={{ color: 'white', padding: 0, margin: '8px 0px' }}
						shape='circle'
						icon={<SyncOutlined />}
					/>
				</Tooltip>
				<Button
					type='primary'
					shape='default'
					size='small'
					onClick={() => {
						//this.onAdd();
						store.openLoginModal()
					}}
					style={{
						// margin: '60px 24px',
						marginLeft: '160px',
					}}
				>
					Вход/ Регистрация
				</Button>
			</Title>
		</Header>
	)
}
const AppHeaderDecorated = observer(AppHeader)

// (async () => {
//   await store.set('Date.now', Date.now())
// Store.set("dataTransport", dataTransport);
//   console.log(
//     "get from Store ->",
//     "dataTransport collection:",
//     await Store.get("dataTransport")
//   );
// })();

// Ant design
// Form layout - Ant Design Demo
// https://codepen.io/dioguzeda/pen/xMpZQE
// Components overview
// https://ant.design/components/overview/

export default observer(App)
