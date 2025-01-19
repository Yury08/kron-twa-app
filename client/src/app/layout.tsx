import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import { SITE_NAME } from '@/constants/seo.constants'

import StarBackground from '../components/StarBackground'

import './globals.css'
import { Providers } from './providers'

config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`
	}
}

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html>
			<head>
				<script src='https://telegram.org/js/telegram-web-app.js'></script>
			</head>
			<body className={inter.className}>
				<Providers>
					{/* <div className='container'> */}
					<StarBackground />
					<>{children}</>
					{/* <div className='container__inner'>{children}</div> */}
					{/* </div> */}
					<Toaster
						theme='dark'
						position='top-center'
						duration={1500}
					/>
				</Providers>
			</body>
		</html>
	)
}

export default RootLayout
