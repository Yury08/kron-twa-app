import { FC, useState } from 'react'

import useGetUser from '@/hooks/useGetUser'

import { ICanvas } from '../../types/main.types'

import styles from './BottomCanvas.module.css'

export const BottomCanvas: FC<ICanvas> = ({ isOpen, setIsOpen }) => {
	const [isCopied, setIsCopied] = useState(false)
	const { user } = useGetUser(true)
	//`https://t.me/twa_mini_game_bot?startapp=${user?.username}&referral=${user?.username}` - открывает приложение
	const referralLink: string = user?.referralLink || ''

	const handleClose = () => setIsOpen(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(referralLink)
			setIsCopied(true)

			const { toast } = await import('sonner')
			toast.success('Link copied to clipboard!')

			setTimeout(() => {
				setIsCopied(false)
			}, 2000)
		} catch (err) {
			console.error('Failed to copy:', err)
			const { toast } = await import('sonner')
			toast.error('Failed to copy link')
		}
	}

	const handleShare = async () => {
		try {
			if (window.Telegram?.WebApp) {
				const shareText = encodeURIComponent('Join us using my referral link!')
				const telegramUrl = `https://t.me/share/url?url=${referralLink}&text=${shareText}`
				window.Telegram.WebApp.openTelegramLink(telegramUrl)
			} else {
				const shareUrl = `https://t.me/share/url?url=${referralLink}&text=Join%20us%20using%20my%20referral%20link!`
				window.open(shareUrl, '_blank')
			}
		} catch (err) {
			console.error('Failed to share:', err)
			const { toast } = await import('sonner')
			toast.error('Failed to share link')
		}
	}

	return (
		<>
			<div
				className={`${styles.canvas__overlay} ${isOpen ? styles.active : ''}`}
				onClick={handleClose}
			/>
			<div className={`${styles.canvas__body} ${isOpen ? styles.active : ''}`}>
				<h1 className={styles.canvas__title}>Invite friends</h1>
				<div className={styles.canvas__content}>
					<p className={styles.canvas__text}>
						Share this link with your friends and get rewards
					</p>
					<div className={styles.canvas__link_container}>
						<input
							type='text'
							readOnly
							value={referralLink}
							className={styles.canvas__input}
						/>
						<button
							className={`${styles.canvas__copy} ${isCopied ? styles.copied : ''}`}
							onClick={handleCopy}
						>
							{isCopied ? 'Copied!' : 'Copy'}
						</button>
					</div>
					<button
						className={styles.canvas__send}
						onClick={handleShare}
					>
						Share in Telegram
					</button>
				</div>
				<button
					onClick={handleClose}
					className={styles.canvas__close}
				>
					Close
				</button>
			</div>
		</>
	)
}
