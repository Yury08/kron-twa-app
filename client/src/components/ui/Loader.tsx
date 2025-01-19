import { Loader2 } from 'lucide-react'

import { cn } from '@/utils/twMerge'

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: number
}

const Loader = ({ size = 24, className, ...props }: LoaderProps) => {
	return (
		<div
			className={cn('flex items-center justify-center', className)}
			{...props}
		>
			<Loader2
				size={size}
				className='animate-spin text-white'
			/>
		</div>
	)
}

export default Loader
