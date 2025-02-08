'use client'

import { FC, PropsWithChildren, useEffect } from 'react'

const TelegramProvider: FC<PropsWithChildren> = ({ children }) => {
	useEffect(() => {
		// Инициализация Telegram WebApp
		if (window.Telegram?.WebApp) {
			window.Telegram.WebApp.ready()
			// window.Telegram.WebApp.expand()
			window.Telegram.WebApp.setBackgroundColor('#000000')
		}
	}, [])

	return <>{children}</>
}

export default TelegramProvider
