import { axiosTelegram } from '../api/interceptors'
import { IFarmingResponse, IFarmingTime } from '../types/farming.types'

export class FarmingService {
	private FARMING_URL = '/farming'

	async startFarming(data: IFarmingTime) {
		const res = await axiosTelegram.post<IFarmingResponse>(
			`${this.FARMING_URL}/start`,
			data
		)
		return res.data
	}

	// ничего не возвращает
	async claimFarming() {
		const res = await axiosTelegram.post(`${this.FARMING_URL}/claim`)
		return res
	}

	async getFarm() {
		const res = await axiosTelegram.get(`${this.FARMING_URL}/get`)
		return res.data
	}

	async getTtl() {
		const { data } = await axiosTelegram.get(`${this.FARMING_URL}/ttl`)
		if (data == -2) {
			return 0
		}
		return data
	}

	async getBalance() {
		const res = await axiosTelegram.get(`${this.FARMING_URL}/balance`)
		return res.data
	}
}

export const farmingService = new FarmingService()
