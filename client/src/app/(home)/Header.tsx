import { TonConnectButton } from '@tonconnect/ui-react'

import { IUser } from '@/types/auth.types'

export const Header = ({ user }: { user: IUser | undefined }) => {
	// const { verify, isVerified, isVerifying } = useLazyVerifyTelegram()

	// useEffect(() => {
	// 	verify()
	// 	console.log(isVerified, isVerifying)
	// }, [verify])

	return (
		<div className='header'>
			<div className='header__login'>
				<span className='header__login-ava'>{user?.username?.charAt(0)}</span>
				<span className='header__login-text'>{user?.username}</span>
			</div>
			{/* 
			{isVerifying ? (
				<button>Верификация...</button>
			) : isVerified ? (
				<TonConnectButton />
			) : (
				<button>Не верифицировано</button>
			)} */}
			<TonConnectButton />
		</div>
	)
}
