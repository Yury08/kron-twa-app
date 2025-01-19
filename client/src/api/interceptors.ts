import axios, { type CreateAxiosDefaults } from 'axios'

const options: CreateAxiosDefaults = {
	baseURL: 'http://localhost:5555/api',
	withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosTelegram = axios.create(options)

axiosTelegram.interceptors.request.use(config => {
	config.headers.Authorization = `${localStorage.getItem('jwtToken')}`
	return config
})

export { axiosClassic, axiosTelegram }
