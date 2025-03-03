import { forwardRef } from 'react'
import { FieldError } from 'react-hook-form'

interface IField extends React.InputHTMLAttributes<HTMLInputElement> {
	placeholder: string
	error?: string | FieldError
}

export const Field = forwardRef<HTMLInputElement, IField>(
	({ placeholder, error, type = 'text', style, ...rest }, ref) => {
		return (
			<div
				className='field-container'
				style={{ width: '100%', marginBottom: '10px' }}
			>
				<input
					ref={ref}
					type={type}
					placeholder={placeholder}
					{...rest}
					style={{
						...style,
						borderColor: error ? '#ff4d4f' : undefined
					}}
				/>
				{error && (
					<div
						className='error-text'
						style={{
							color: '#ff4d4f',
							fontSize: '12px',
							marginTop: '5px'
						}}
					>
						{typeof error === 'string' ? error : error.message}
					</div>
				)}
			</div>
		)
	}
)

Field.displayName = 'Field'
