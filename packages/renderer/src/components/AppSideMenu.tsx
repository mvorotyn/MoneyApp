import { useStore } from '@/stores/stores'
import { observer } from 'mobx-react-lite'
import {
	UserOutlined,
	SyncOutlined,
	VideoCameraOutlined,
	CarOutlined,
	HomeOutlined,
	ShoppingCartOutlined,
	HeartOutlined,
	MoneyCollectOutlined,
} from '@ant-design/icons'
import { Button, Menu, Layout, Tooltip } from 'antd'
const { Sider } = Layout

const sideMenuLinks: IDescItem[] = [
	{
		name: 'Все расходы',
		icon: <UserOutlined />,
	},
	{
		name: 'Транспорт',
		icon: <CarOutlined />,
	},
	{
		name: 'Здоровье',
		icon: <HeartOutlined />,
	},
	{
		name: 'Еда',
		icon: <ShoppingCartOutlined />,
	},
	{
		name: 'Дом',
		icon: <HomeOutlined />,
	},
	{
		name: 'Налоги',
		icon: <MoneyCollectOutlined />,
	},
]

const AppSideMenu = () => {
	const store = useStore()
	console.log('rendering sideMenu, table visible: ', store.isTableVisible)
	return (
		<Sider
			trigger={null}
			collapsible
			collapsed={store.collapsed}
			style={{
				//display: "block", position: "sticky",
				top: '0px',
				height: '100vh',
			}}
		>
			{/* <div className="logo" /> */}
			<Menu theme='dark' mode='inline' defaultSelectedKeys={['0']}>
				{sideMenuLinks.map((item: IDescItem, index: number) => {
					// console.log(item);
					return (
						<Menu.Item
							key={index}
							icon={item.icon}
							onClick={evt => {
								store.handleClick(evt)
							}}
						>
							{item.name}
						</Menu.Item>
					)
				})}
			</Menu>
			{store.selectedIndex != 0 && (
				<Button
					type='primary'
					shape='round'
					size='large'
					onClick={() => {
						//this.onAdd();
						store.openModal()
					}}
					style={{
						margin: '60px 24px',
					}}
				>
					Добавить $
				</Button>
			)}


		</Sider>
	)
}

//Ant Motion Queque Anim
//  https://codesandbox.io/s/ant-motion-demo-forked-fetqw6?file=/index.js

export default observer(AppSideMenu)
