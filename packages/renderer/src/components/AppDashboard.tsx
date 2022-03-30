import { useStore } from '@/stores/stores'
import { Button, Col, Row, Statistic } from 'antd'
import { observer } from 'mobx-react-lite'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const AppDashboard = () => {
	const store = useStore()
	const data = {
		labels: ['Транспорт', 'Здоровье', 'Еда', 'Дом', 'Налоги'],
		datasets: [
			{
				label: '# of Votes',
				data: [
					store.spendedOnTransportCategory(),
					store.spendedOnHealthCategory(),
					store.spendedOnFoodCategory(),
					store.spendedOnHouseCategory(),
					store.spendedOnTaxesCategory(),
				],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					// "rgba(255, 159, 64, 0.2)",
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					// "rgba(255, 159, 64, 1)",
				],
				borderWidth: 1,
			},
		],
	}
	return (
		<div style={{ margin: '20px 20px' }}>
			<Row>
				{/* //gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} */}
				<Col span={8} offset={4}>
					<Statistic title='За этот месяц потречено' value={893} />
				</Col>
				<Col
					span={8}
					//   offset={12}
				>
					<Statistic
						title='Потрачено всего (ГРН)'
						value={store.getSpendedSummaryForAllCategories()}
						// precision={2}
					/>
					<Button style={{ marginTop: 16 }} type='primary'>
						Пересчитать
					</Button>
				</Col>
				<Col span={10} offset={6}>
					<Pie data={data} />
				</Col>
			</Row>
		</div>
	)
}

// export const data = {
//   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//   datasets: [
//     {
//       label: "# of Votes",
//       data: [120, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         "rgba(255, 99, 132, 0.2)",
//         "rgba(54, 162, 235, 0.2)",
//         "rgba(255, 206, 86, 0.2)",
//         "rgba(75, 192, 192, 0.2)",
//         "rgba(153, 102, 255, 0.2)",
//         "rgba(255, 159, 64, 0.2)",
//       ],
//       borderColor: [
//         "rgba(255, 99, 132, 1)",
//         "rgba(54, 162, 235, 1)",
//         "rgba(255, 206, 86, 1)",
//         "rgba(75, 192, 192, 1)",
//         "rgba(153, 102, 255, 1)",
//         "rgba(255, 159, 64, 1)",
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

export default observer(AppDashboard)
