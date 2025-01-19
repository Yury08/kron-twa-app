import { axiosTelegram } from '../api/interceptors'
import { IUser } from '../types/auth.types'
import { IFriend } from '../types/friend.types'

export class FriendService {
	private FRIEND_URL = '/friend'

	async getAllFriends() {
		const res = await axiosTelegram.get<IFriend[]>(`${this.FRIEND_URL}/all`)
		return res.data
	}

	// возвращает список всех друзей с обновленным полем earn
	async updateFriendsEarning() {
		const res = await axiosTelegram.put<IFriend[]>(`${this.FRIEND_URL}/update`)
		return res.data
	}

	// возвращает user с обновленным полем баланса
	async claimFriendReward() {
		const res = await axiosTelegram.post<IUser>(`${this.FRIEND_URL}/claim`)
		return res
	}
}

export const friendService = new FriendService()
