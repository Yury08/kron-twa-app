import { ArrowUpLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { GameState } from '@/types/game.types'

import { useTicket } from '@/hooks/useTicket'
import { useUpdateBalance } from '@/hooks/useUpdateBalance'

// Определите интерфейс пропсов
interface GameStartedProps {
	gameState: GameState
}

const GameStarted = ({ gameState }: GameStartedProps) => {
	const { mutate, data } = useTicket()
	const { updateUserBalance } = useUpdateBalance()

	useEffect(() => {
		if (gameState.isGameOver && gameState.scoreEl > 0) {
			updateUserBalance({ quantity: gameState.scoreEl })
			console.log('BALANCE UPDATE ', typeof gameState.scoreEl)
		}
	}, [gameState.isGameOver])

	const onSubmit = () => {
		mutate()
		if (data !== -1) gameState.startGame()
	}

	return (
		<>
			<div className='fixed text-white ml-2 mt-1 select-none'>
				<span>Score:</span>
				<span>{gameState.scoreEl}</span>
			</div>
			{(!gameState.isGameStarted || gameState.isGameOver) && (
				<>
					<div className='fixed inset-0 bg-black/50 backdrop-blur-sm' />

					<div className='fixed inset-0 flex items-center justify-center z-10'>
						<div className='bg-white text-black max-w-[300px] w-full p-5 text-center rounded-lg relative'>
							<Link
								href='/'
								className='absolute top-3 left-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors'
							>
								<ArrowUpLeft className='text-gray-700 text-lg' />
							</Link>
							<h1 className='text-3xl font-bold leading-none mt-6'>
								{gameState.scoreEl}
							</h1>
							<p className='text-xs text-gray-700 mb-3'>KRN</p>
							<div>
								<button
									onClick={() => onSubmit()}
									className='bg-[#8a00f6] text-white w-full py-2.5 rounded-full text-sm hover:bg-[#7500d1] transition-colors'
								>
									{gameState.isGameOver ? 'Restart Game' : 'Start Game'}
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	)
}

export default GameStarted
