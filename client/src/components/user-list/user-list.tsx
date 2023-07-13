import React from 'react';
import { User } from '../../types/user.type';
import UserListItem from '../user-list-item/user-list-item';
import classes from './user-list.module.css';

type UserListProps = {
	users: User[];
};

export default function UserList(props: UserListProps) {
	const { users } = props;
	return (
		<div className={classes.container}>
			<h2 className={classes.header}>Users</h2>
			<ul className={classes.list}>
				{users.map((user) => (
					<UserListItem
						key={user.id}
						username={user.username}
						colorId={user.pinColorId}
					/>
				))}
			</ul>
		</div>
	);
}
