import { IBase } from './main.types'

export interface IMenu extends IBase {
	title: string
	link: string
	icon: string
}

export type IMenuForm = Partial<Omit<IMenu, 'id' | 'createdAt' | 'updatedAt'>>
