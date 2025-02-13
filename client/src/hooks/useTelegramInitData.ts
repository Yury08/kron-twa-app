'use client'

import { useEffect, useState } from 'react'
import { TelegramWebApps } from 'telegram-webapps-types-new'

type WebAppInitData = TelegramWebApps.WebAppInitData

function useTelegramInitData() {
	const [data, setData] = useState<WebAppInitData>()

	useEffect(() => {
		const firstLayerInitData = Object.fromEntries(
			new URLSearchParams(window.Telegram.WebApp.initData)
		)

		const initData: Partial<WebAppInitData> = {}

		for (const key in firstLayerInitData) {
			try {
				const parsedValue = JSON.parse(firstLayerInitData[key])
				// @ts-ignore - игнорируем, так как мы знаем структуру данных от Telegram
				initData[key] = parsedValue
			} catch {
				// @ts-ignore - то же самое для непарсящихся значений
				initData[key] = firstLayerInitData[key]
			}
		}

		// Приводим initData к типу WebAppInitData
		setData(initData as WebAppInitData)
	}, [])

	return data
}

export default useTelegramInitData
