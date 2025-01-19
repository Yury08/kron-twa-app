'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useState } from 'react'

import { BottomCanvas } from '@/components/canvas/BottomCanvas'
import Loader from '@/components/ui/Loader'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import icon_friends from '../../../public/icon_friends.svg'

import { friendService } from '@/services/friend.service'

const UPDATE_INTERVAL = 24 * 60 * 60 * 1000 // 24 часа в миллисекундах
// const UPDATE_INTERVAL = 60 * 1000
const LAST_UPDATE_KEY = 'lastFriendsUpdate'

const Friends: FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(true)
	const [totalEarnings, setTotalEarnings] = useState<string>('0.00')
	const { push } = useRouter()

	const handleOpen = () => setIsOpen(true)

	const { data: friends, refetch } = useQuery({
		queryKey: ['friends'],
		queryFn: () => friendService.getAllFriends()
	})

	const { mutate: updateEarnings } = useMutation({
		mutationKey: ['updateFriendsEarning'],
		mutationFn: () => friendService.updateFriendsEarning(),
		onSuccess: async () => {
			localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString())
			await refetch()
		},
		onError: async error => {
			console.error('Update error:', error)
		}
	})

	const checkAndUpdate = useCallback(() => {
		const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY)
		const now = Date.now()

		if (!lastUpdate || now - Number(lastUpdate) >= UPDATE_INTERVAL) {
			updateEarnings()
		}
	}, [updateEarnings])

	useEffect(() => {
		checkAndUpdate()

		const interval = setInterval(checkAndUpdate, 60000)

		return () => clearInterval(interval)
	}, [checkAndUpdate])

	const { mutate: claimReward } = useMutation({
		mutationKey: ['getFriendsReward'],
		mutationFn: () => friendService.claimFriendReward(),
		onSuccess: async () => {
			const { toast } = await import('sonner')
			toast.success('Successfuly get reward!')
			await refetch()
		}
	})

	useEffect(() => {
		if (!localStorage.getItem('jwtToken')) {
			push(DASHBOARD_PAGES.AUTH)
		} else {
			setLoading(false)
		}
	}, [])

	const calculateTotal = useCallback(() => {
		if (!friends?.length) return '0.00'

		const total = friends.reduce((sum, friend) => {
			return sum + Number(friend.earn)
		}, 0)

		return total.toFixed(2)
	}, [friends])

	useEffect(() => {
		setTotalEarnings(calculateTotal())
	}, [friends, calculateTotal])

	// Проверяем, можно ли получить награду
	const canClaim = useCallback(() => {
		const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY)
		const hasUpdated =
			!!lastUpdate && Date.now() - Number(lastUpdate) < UPDATE_INTERVAL
		const hasEarnings = totalEarnings !== '0.00'

		return hasUpdated && hasEarnings
	}, [totalEarnings])

	if (loading) return <Loader size={50} />

	return (
		<>
			<div className='friends__header'>
				<Image
					src={icon_friends}
					alt='icon_friends'
				/>
				<p className='friends__title'>Invite friends</p>
				<h1 className='friends__balance'>{totalEarnings} POINTS</h1>
				<button
					className='friends__button'
					onClick={() => claimReward()}
					disabled={!canClaim()}
				>
					get
				</button>
				<p className='friends__text'>
					Get 5% for each referral and
					<br />
					ticket for every 3 referrals
				</p>
			</div>

			<p className='friends__count'>friends: {friends?.length || 0}</p>

			<div className='friends__body'>
				{friends ? (
					friends?.map(friend => (
						<div
							key={friend.id}
							className='friends__card'
						>
							<div className='friends__card-name'>
								<span className='friends__card-ava'>
									{friend.username.charAt(0)}
								</span>
								<span className='friends__card-name'>{friend.username}</span>
							</div>
							<p className='friends__card-balance'>{friend.earn} POINTS</p>
						</div>
					))
				) : (
					<h2 className='friends__no-friends'>
						You don't have any friends yet
					</h2>
				)}

				<div className='friends__invite'>
					<button
						className='friends__invite-button'
						onClick={handleOpen}
					>
						Invite your friends
					</button>
				</div>
			</div>
			{isOpen ? (
				<BottomCanvas
					isOpen={isOpen}
					setIsOpen={setIsOpen}
				/>
			) : (
				<></>
			)}
		</>
	)
}

export default Friends
