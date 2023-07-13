import { ChangeEvent, FormEvent, useState } from 'react';
import classes from './name-input.module.css';

type NameInputType = {
	onSetUsername(username: string): void;
};

export default function NameInput(props: NameInputType) {
	const [username, setUsername] = useState<string>('');
	const { onSetUsername } = props;

	const formSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSetUsername(username);
	};

	return (
		<div className={classes.backdrop}>
			<form className={classes.modal} onSubmit={formSubmitHandler}>
				<label className={classes.label}>Username</label>
				<input
					className={classes.input}
					name='username'
					value={username}
					onChange={(event) => setUsername(event.target.value)}
				></input>
				<button type='submit' className={classes.submitButton}>Submit</button>
			</form>
		</div>
	);
}
