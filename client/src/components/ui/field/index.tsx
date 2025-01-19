import { forwardRef } from 'react'

interface InputFieldProps {
	id: string
	label?: string
	className?: string
	extra?: string
	placeholder: string
	variant?: string
	state?: 'error' | 'success'
	disabled?: boolean
	type?: string
}

export const Field = forwardRef<HTMLInputElement, InputFieldProps>(
	(
		{
			label,
			id,
			className,
			extra,
			type,
			placeholder,
			state,
			disabled,
			...rest
		},
		ref
	) => {
		return (
			<div className={`${extra}`}>
				<label htmlFor={id}>{label}</label>
				<input
					ref={ref}
					disabled={disabled}
					type={type}
					id={id}
					placeholder={placeholder}
					className={className}
					{...rest}
				/>
			</div>
		)
	}
)

Field.displayName = 'field'
