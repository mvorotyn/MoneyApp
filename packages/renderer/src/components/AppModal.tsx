import { useStore } from '@/stores/mobxStore'
import {
	Button,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	InputNumber,
	message,
} from 'antd'
import { useForm } from 'antd/lib/form/Form'
// import "antd/dist/antd.css";
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import { useEffect, useRef } from 'react'
import Modal from './modal'
const { TextArea } = Input

const today = () =>
	new Date().toISOString().slice(0, 10).replace('-', '/').replace('-', '/')

const AppModal = () => {
	const store = useStore()

	const [form] = useForm()

	const moneyAmountValidator = (money: any) => {
		// console.log("111:" + parseInt(money) + ":");
		if (parseInt(money) && parseInt(money) > 0)
			store.modalFormChangeMoneySpendAmount(parseInt(money))
	}
	const dateValidator = (date: any) => {
		if (moment.isMoment(date)) {
			// console.log("validator: correct date");
			store.modalFormChangeOperationDate(date)
		}
	}

	const operationNameValidator = (event: any) => {
		console.log('operationName validating')

		if (event.target.value.length < 60) {
			store.modalFormChangeOperationName(event)
		} else {
			//operationNameValidateStatus="error"
		}
	}

	const formValidator = () => {
		if (store.formOperationName.length > 0) {
			store.addTableItem()
			store.resetForm()
		} else {
			message.warning('Заполните необходимые поля!', 2)
		}
	}

	let moneyValue = store.formMoneySpendAmount
	let operationNameValue = store.formOperationName
	let operationDescriptionValue = store.formOperationDescription
	// useEffect(() => {
	//   form.validateFields(['operationName']);
	// }, [operationNameValue]);

	return (
		<Modal
			isModalOpen={store.isModalOpen}
			closeModal={() => {
				store.closeModal()
			}}
		>
			<h3>Новая запись</h3>
			<Divider />

			<Form layout='vertical'>
				<Col>
					<Form.Item label='Операция' colon={false}>
						<Input
							value={operationNameValue}
							// required={true}
							placeholder='Введите название для совершенной операции'
							onChange={operationNameValidator}
							defaultValue='Покупка товара в....'
						/>
					</Form.Item>
					<Form.Item label='Потраченно денег' colon={false}>
						<InputNumber
							min={1}
							max={100000}
							defaultValue={1}
							addonAfter='₴'
							value={moneyValue}
							onChange={moneyAmountValidator}
						/>
					</Form.Item>
					<Form.Item label='Выберите дату'>
						<DatePicker
							defaultValue={moment(today(), 'YYYY/MM/DD')}
							format='YYYY/MM/DD'
							placeholder='Выберите дату'
							onChange={dateValidator}
							allowClear={false}
						/>
					</Form.Item>
					<Form.Item label='Описание операции'>
						<TextArea
							rows={4}
							placeholder='Покупка товара AAA в магазине BBB по адресу...'
							maxLength={160}
							value={operationDescriptionValue}
							onChange={store.modalFormChangeOperationDescription}
						/>
					</Form.Item>
				</Col>
			</Form>
			<Divider />
			<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
				<Button key='Back' onClick={store.closeModal}>
					Назад
				</Button>
				<Button
					key='submit'
					type='primary'
					style={{ marginRight: '20px', marginLeft: '20px' }}
					//loading={loading}
					onClick={formValidator}
				>
					Добавить
				</Button>
			</div>
		</Modal>
	)
}

export default observer(AppModal)
