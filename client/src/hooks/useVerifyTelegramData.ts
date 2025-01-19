import crypto from 'crypto'

export const useVerifyTelegramData = (
	initData: string,
	botToken: string
): boolean => {
	const data = new URLSearchParams(initData)
	const hash = data.get('hash')
	if (!hash) {
		return false // Если hash отсутствует, данные недействительны
	}
	data.delete('hash')

	const checkString = Object.keys(data)
		.map(key => `${key}=${data.get(key)}`)
		.sort()
		.join('\n')

	const secretKey = crypto
		.createHmac('sha256', botToken)
		.update('WebAppData')
		.digest()

	const calculatedHash = crypto
		.createHmac('sha256', secretKey)
		.update(checkString)
		.digest('hex')

	return calculatedHash === hash
}
