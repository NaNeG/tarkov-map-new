import React from 'react';
import { colorIdToPinIcon } from '../../helpers/helpers';
import classes from './user-list-item.module.css'

type UserListItemProps = {
	username: string;
	colorId: number;
};

export default function UserListItem(props: UserListItemProps) {
	const { username, colorId } = props;

	return (
		<li className={classes.item}>
			<img src={colorIdToPinIcon[colorId]} className={classes.pin}></img>
			<p className={classes.username}>{username}</p>
		</li>
	);
}
