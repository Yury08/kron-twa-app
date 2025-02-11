class TelegramStorageService {
	async setItem(key: string, value: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!window.Telegram?.WebApp?.CloudStorage) {
				reject(new Error('CloudStorage is not available'))
				return
			}

			window.Telegram.WebApp.CloudStorage.setItem(key, value, error => {
				if (error) {
					reject(error)
				} else {
					resolve()
				}
			})
		})
	}

	async getItem(key: string): Promise<string | null> {
		return new Promise((resolve, reject) => {
			if (!window.Telegram?.WebApp?.CloudStorage) {
				reject(new Error('CloudStorage is not available'))
				return
			}

			window.Telegram.WebApp.CloudStorage.getItem(key, (error, value) => {
				if (error) {
					reject(error)
				} else {
					if (value) {
						resolve(value)
					}
				}
			})
		})
	}

	async removeItem(key: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!window.Telegram?.WebApp?.CloudStorage) {
				reject(new Error('CloudStorage is not available'))
				return
			}

			window.Telegram.WebApp.CloudStorage.removeItem(key, error => {
				if (error) {
					reject(error)
				} else {
					resolve()
				}
			})
		})
	}
}

export const storageService = new TelegramStorageService()
