import {
	faHouse,
	faListCheck,
	faUserGroup
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { FC } from 'react'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import styles from './Navigation.module.css'

export const Navigation: FC = () => {
	return (
		<div className={styles.navigation}>
			<div className={styles.navigation__item}>
				<Link
					href={DASHBOARD_PAGES.FRIENDS}
					className={styles.navigation__item_title}
				>
					<FontAwesomeIcon
						className={styles.navigation__icon}
						icon={faUserGroup}
					/>
					<p>friends</p>
				</Link>
			</div>
			<div className={styles.navigation__item}>
				<Link
					href={DASHBOARD_PAGES.HOME}
					className={styles.navigation__item_title}
				>
					<FontAwesomeIcon
						className={styles.navigation__icon}
						icon={faHouse}
					/>
					<p>home</p>
				</Link>
			</div>
			<div className={styles.navigation__item}>
				<Link
					href={DASHBOARD_PAGES.TASKS}
					className={styles.navigation__item_title}
				>
					<FontAwesomeIcon
						className={styles.navigation__icon}
						icon={faListCheck}
					/>
					<p>tasks</p>
				</Link>
			</div>
		</div>
	)
}
