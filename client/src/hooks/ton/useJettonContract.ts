// import { Address, OpenedContract, toNano } from 'ton-core'

// import { JettonDefaultWallet } from '../../../build/SampleJetton/tact_JettonDefaultWallet'
// import {
// 	Mint,
// 	SampleJetton
// } from '../../../build/SampleJetton/tact_SampleJetton'

// import { useAsyncInitialize } from './useAsyncInitialize'
// import { useTonClient } from './useTonClient'
// import { useTonConnect } from './useTonConnect'

// export function useJettonContract() {
// 	const { client } = useTonClient()
// 	const { wallet, sender } = useTonConnect()

// 	const jettonMasterContract = useAsyncInitialize(async () => {
// 		if (!client || !wallet) return

// 		const contract = SampleJetton.fromAddress(
// 			Address.parse('EQBeuUL8yJYm1hJyTNRPZ4wuU0BtbbigTmFP17Kmu-Xsvx0a')
// 		)

// 		return client.open(contract) as OpenedContract<SampleJetton>
// 	}, [client, wallet])

// 	const jettonWalletContract = useAsyncInitialize(async () => {
// 		if (!jettonMasterContract || !client || !wallet) return
// 		const jettonWalletAddress = await jettonMasterContract.getGetWalletAddress(
// 			Address.parse(wallet)
// 		)
// 		return client.open(JettonDefaultWallet.fromAddress(jettonWalletAddress))
// 	}, [jettonMasterContract, client, wallet])

// баланас jetton
// const {
// 	data: jettonBalance,
// 	isFetching,
// 	refetch: refetchBalance
// } = useQuery({
// 	queryKey: ['jetton'],
// 	queryFn: async () => {
// 		if (!jettonWalletContract) return '0'
// 		try {
// 			const balance = (await jettonWalletContract.getGetWalletData()).balance
// 			return fromNano(balance)
// 		} catch (error) {
// 			console.error('Ошибка при получении баланса:', error)
// 			return '0'
// 		}
// 	},
// 	enabled: !!jettonWalletContract && !!wallet
// })

// return {
// 	jettonWalletAddress: jettonWalletContract?.address.toString(),
// 	jettonBalance,
// 	isLoading: isFetching,
// 	refetchBalance,
// 	mint: async () => {
// 		if (!wallet || !jettonMasterContract) return

// 		const message: Mint = {
// 			$$type: 'Mint',
// 			amount: 50000000000n,
// 			receiver: Address.parse(wallet)
// 		}

// 		await jettonMasterContract.send(
// 			sender,
// 			{
// 				value: toNano('0.05')
// 			},
// 			message
// 		)

// 		await refetchBalance()
// 	}
// }
// }
