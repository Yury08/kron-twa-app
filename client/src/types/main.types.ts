export interface IBase {
	id: string
	createdAt?: string
	updatedAt?: string
}

export interface ICanvas {
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
}

export interface IBalance {
	quantity: number
}
