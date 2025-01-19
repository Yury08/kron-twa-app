import { useCallback, useState } from 'react'

import { useVerifyTelegramData } from './useVerifyTelegramData'

// для проверки полддлиности данных перед подключение кошелька
export const useLazyVerifyTelegram = () => {
	const [isVerified, setIsVerified] = useState<boolean | null>(null)
	const [isVerifying, setIsVerifying] = useState(false)

	const verify = useCallback(async () => {
		setIsVerifying(true)

		try {
			const BOT_TOKEN = '7691746287:AAEFSxT1mDXmUloiv7AcJUVnoKAnhYjARLc'
			if (!BOT_TOKEN) {
				throw new Error('BOT_TOKEN не найден')
			}

			const isValid = useVerifyTelegramData(
				window.Telegram.WebApp.initData,
				BOT_TOKEN
			)

			setIsVerified(isValid)
			return isValid
		} catch (error) {
			console.error('Ошибка при проверке данных:', error)
			setIsVerified(false)
			return false
		} finally {
			setIsVerifying(false)
		}
	}, [])

	return { verify, isVerified, isVerifying }
}
