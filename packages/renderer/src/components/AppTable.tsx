/* eslint-disable react/destructuring-assignment */

import { Popconfirm, Table } from 'antd'
// import { toJS } from "mobx";
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/stores'

let columnsData: { [key: string]: any }[]

columnsData = [
	{
		title: 'Название операции',
		dataIndex: 'name',
		key: 'name',
		// ellipsis: true,
		width: '30%',
	},
	{
		title: 'Сумма',
		dataIndex: 'count',
		key: 'count',
		ellipsis: true,
		// width: '30%',
	},
	{
		title: 'Дата',
		dataIndex: 'date',
		key: 'date',
		ellipsis: true,
	},
	Table.EXPAND_COLUMN,
	{
		title: 'Подробности',
		dataIndex: 'description',
		key: 'description',
		ellipsis: true,
	},

	{
		title: 'Действие',
		dataIndex: '',
		key: 'x',
	},
]

const AppTable = () => {
	const store = useStore()
	const rowSelection = {
		selectedRowKeys: store.selectedRowKeys,
		onChange: store.onRowSelectChange,
	}

	// store.dataForTables.get( toJS (store.selectedIndex) )
	columnsData[5].render = TablePopConfirm

	return (
		<Table
			style={{ marginLeft: '20px', marginRight: '20px' }}
			rowSelection={rowSelection}
			columns={columnsData}
			expandable={{
				expandedRowRender: record => (
					<p style={{ margin: 20 }}>{record.description}</p>
				),
				rowExpandable: record => record.name !== 'Not Expandable',
			}}
			dataSource={store.curentTableData.slice()}
		/>
	) // store.curentTableData.slice()

	function TablePopConfirm(_bb: any, record: { key: string | number }) {
		return (
			<Popconfirm
				title='Действительно хотите удалить?'
				onConfirm={() => {
					let indexToDelete = -1
					store.curentTableData.filter((item, idx) => {
						if (item.key == record.key) {
							indexToDelete = idx
						}
					})
					if (indexToDelete > -1) store.deleteItemFromTable(indexToDelete)
				}}
			>
				<a>Удалить</a>
			</Popconfirm>
		)
	}
	// });
}

// let newActionColumn = { ...columnsData[5], render: TablePopConfirm};
// columnsData[5] = newActionColumn;

//   const myObject: {[key: string]: any} = {
//     property: 'value'
// };

// myObject.property2 = 'value2';

export default observer(AppTable)
