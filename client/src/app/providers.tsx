'use client'

// Подключение ReactQuery
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { FC, PropsWithChildren } from 'react'

import TelegramProvider from '@/providers/TelegramProvider'

const manifestUrl = 'https://yury08.github.io/torch-metadata/manifest.json'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false
		}
	}
})

export const Providers: FC<PropsWithChildren> = ({ children }) => {
	return (
		<TonConnectUIProvider manifestUrl={manifestUrl}>
			<QueryClientProvider client={queryClient}>
				<TelegramProvider>{children}</TelegramProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</TonConnectUIProvider>
	)
}
