'use client'

import { FC, PropsWithChildren, useEffect } from 'react'

const TelegramProvider: FC<PropsWithChildren> = ({ children }) => {
	useEffect(() => {
		// Проверка на мобильное устройство
		// const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

		// Инициализация Telegram WebApp
		if (window.Telegram?.WebApp) {
			window.Telegram.WebApp.ready()

			// if (isMobile) {
			// 	window.Telegram.WebApp.requestFullscreen()
			// }

			window.Telegram.WebApp.setBackgroundColor('#000000')
		}
	}, [])

	return <>{children}</>
}

export default TelegramProvider
