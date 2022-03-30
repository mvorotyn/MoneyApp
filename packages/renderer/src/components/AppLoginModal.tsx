import { apiUserLogin, apiUserRegister } from '@/API/syncApi'
import { useStore } from '@/stores/stores'
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

function isNumber(text: string) {
	if (text) {
		var reg = new RegExp('[0-9]+$')
		return reg.test(text)
	}
	return false
}



function removeSpecials(text: string) {
	if (text) {
		var lower = text.toLowerCase()
		var upper = text.toUpperCase()
		var result = ''
		for (var i = 0; i < lower.length; ++i) {
			if (isNumber(text[i]) || lower[i] != upper[i] || lower[i].trim() === '') {
				result += text[i]
			}
		}
		return result.replace(/\s+/g, '')
	}
	return ''
}
const today = () =>
	new Date().toISOString().slice(0, 10).replace('-', '/').replace('-', '/')

const AppLoginModal = () => {
	const store = useStore()

	const [form] = useForm()

	const loginValidator = (event: any) => {
		if (event.target.value.length < 60) {
			let login = removeSpecials(event.target.value)
			store.modalFormChangeLogin(login)
		} else {
			//operationNameValidateStatus="error"
		}
	}

	const passwordValidator = (event: any) => {
		let password: string = event.target.value
		if (password.length < 60) {
			password = removeSpecials(password)
			store.modalFormChangePassword(password)
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

	const onLogin = async function () {
		let login = store.formLogin
		let password = store.formPassword
		if (login.length > 5 && password.length > 7) {
			const user = { username: login, password: password }
			let serverResponse = await apiUserLogin(user)
			if (serverResponse) {
				console.log('onLogin', serverResponse)
                if (serverResponse.message ==  "Unauthorized") 
                {
                    message.warning('Неверный логин или пароль', 2)
                }else{
                    store.closeLoginModal();
              
                    store.setApiAccessToken(serverResponse.access_token);
                    store.resetLoginForm();
                 
                }
			} else {
				message.warning('Нет соединения с сервером', 2)
			}
		} else {
			message.warning(
				'Заполните правильно! Логин должен быть мин 6 симоволов, а пароль - мин 8 символов',
				2
			)
		}
	}

    const onRegister = async function () {
		let login = store.formLogin
		let password = store.formPassword
		if (login.length > 5 && password.length > 7) {
			const user = { username: login, password: password }
			let serverResponse = await apiUserRegister(user)
			if (serverResponse) {
				console.log('onRegister', serverResponse)
                if (serverResponse.message ==  "Unauthorized") 
                {
                    message.warning('Пользователь уже существует с таким именем', 2)
                }else{
                    store.closeLoginModal();
                    store.setApiAccessToken(serverResponse.access_token);
                    store.resetLoginForm();
                }
			} else {
				message.warning('Нет соединения с сервером', 2)
			}
		} else {
			message.warning(
				'Заполните правильно! Логин должен быть мин 6 симоволов, а пароль - мин 8 символов',
				2
			)
		}
	}

	let login = store.formLogin
	let password = store.formPassword
	// useEffect(() => {
	//   form.validateFields(['operationName']);
	// }, [operationNameValue]);

	return (
		<Modal
			isModalOpen={store.isLoginModalOpen}
			closeModal={() => {
				store.closeLoginModal()
			}}
		>
			<h3>Вход</h3>
			<Divider />

			<Form layout='vertical'>
				<Col>
					<Form.Item label='Логин' colon={false}>
						<Input
							value={login}
							// required={true}
							placeholder='Логин'
							onChange={loginValidator}
							defaultValue=''
						/>
					</Form.Item>

					<Form.Item label='Пароль' colon={false}>
						<Input
							value={password}
							// required={true}
							placeholder='Пароль'
							onChange={passwordValidator}
							defaultValue=''
						/>
					</Form.Item>
				</Col>
			</Form>
			<Divider />
			<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
				<Button key='Back' onClick={store.closeLoginModal}>
					Назад
				</Button>
				<Button
					key='submit'
					type='primary'
					style={{ marginRight: '0px', marginLeft: '80px' }}
					//loading={loading}
					onClick={onLogin}
				>
					Войти
				</Button>
				<Button
					key='submit2'
					type='primary'
					style={{ marginRight: '20px', marginLeft: '20px' }}
					//loading={loading}
					onClick={onRegister}
				>
					Регистрация
				</Button>
			</div>
		</Modal>
	)
}

export default observer(AppLoginModal)
