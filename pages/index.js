import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import firebase from "../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firestore = firebase.firestore();

const Msg = (props) => {
	return (
		<div>
			{props.nick}:{props.text}
		</div>
	);
};

export default function Home() {
	const messagesCollection = firestore.collection("messages");
	const query = messagesCollection.orderBy("createdAt").limit(25);
	const [messages] = useCollectionData(query, { idField: "id" });

	const [messageFormValue, setMessageFormValue] = useState("");
	const [nickFormValue, setNickFormValue] = useState("");

	const sendMessage = async (e) => {
		e.preventDefault();

		await messagesCollection.add({
			nickname: nickFormValue,
			text: messageFormValue,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
		});

		setMessageFormValue("");
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				{messages &&
					messages.map((msg) => <Msg nick={msg.nickname} text={msg.text} />)}
				<form onSubmit={sendMessage}>
					<input
						value={nickFormValue}
						onChange={(e) => setNickFormValue(e.target.value)}
						placeholder="nickname"
					/>
					<input
						value={messageFormValue}
						onChange={(e) => setMessageFormValue(e.target.value)}
						placeholder="message"
					/>
					<button type="submit">🚀</button>
				</form>
			</main>
		</div>
	);
}
