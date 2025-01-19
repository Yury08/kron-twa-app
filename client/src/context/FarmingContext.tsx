// FarmingContext.tsx
import React, { createContext, useContext, useState } from 'react'

interface FarmingContextType {
	rewardCollected: boolean
	setRewardCollected: React.Dispatch<React.SetStateAction<boolean>>
}

const FarmingContext = createContext<FarmingContextType | undefined>(undefined)

export const FarmingProvider = ({
	children
}: {
	children: React.ReactNode
}) => {
	const [rewardCollected, setRewardCollected] = useState(false)

	return (
		<FarmingContext.Provider
			value={{
				rewardCollected,
				setRewardCollected
			}}
		>
			{children}
		</FarmingContext.Provider>
	)
}

export const useFarmingContext = () => {
	const context = useContext(FarmingContext)
	if (context === undefined) {
		throw new Error('useFarmingContext must be used within a FarmingProvider')
	}
	return context
}
