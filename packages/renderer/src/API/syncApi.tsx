export async function apiUserLogin(user: {
	username: string
	password: string
}) {
	return fetch('http://localhost:3008/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	})
		.then(response => {
			return response.json()
		})
		.catch(function (err) {
			console.log('Unable to fetch -', err)
		})

	// console.log('111', serverResponse)
}

export async function apiUserRegister(user: {
	username: string
	password: string
}) {
	return fetch('http://localhost:3008/auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	})
		.then(response => {
			return response.json()
		})
		.catch(function (err) {
			console.log('Unable to fetch -', err)
		})
}

export interface TableData {
	title: string
	tableData?: {
		key: string
		name: string
		count: number
		description: string
		date: string
	}
}

export function apiSyncTableData(
	data: TableData,
	apiAccessToken: string
) {
	return fetch('http://localhost:3008/table-data', {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + apiAccessToken,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(response => {
			return response.json()
		})
		.catch(function (err) {
			console.log('Unable to fetch (sync task) -', data.title)
		})
}
