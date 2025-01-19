'use client'

// Подключение ReactQuery
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { PropsWithChildren, useState } from 'react'

const manifestUrl = 'https://yury08.github.io/torch-metadata/manifest.json'

export function Providers({ children }: PropsWithChildren) {
	const [client] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: false
				}
			}
		})
	)

	return (
		<TonConnectUIProvider manifestUrl={manifestUrl}>
			<QueryClientProvider client={client}>
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</TonConnectUIProvider>
	)
}
