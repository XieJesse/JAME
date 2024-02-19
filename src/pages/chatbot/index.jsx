import React from 'react'
import { useEffect, useState } from 'react'
import { db } from '../../config/firebase'
import { getDocs, getDoc, collection, addDoc, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore'
import OpenAI from 'openai'
import { BeatLoader } from 'react-spinners'
import { FaRedoAlt } from 'react-icons/fa'

const Chatbot = () => {
	const pinCollection = collection(db, 'pins')
	const [pinsList, setPinsList] = useState([])

	const getPins = async () => {
		try {
			const pins = await getDocs(pinCollection)
			setPinsList(
				pins.docs.map((doc) => ({
					// id: doc.id,
					// ...doc.data(),
					title: doc.data().title,
					description: doc.data().description,
				}))
			)
		} catch (error) {
			console.log(error)
		}
	}

	const [isWaiting, setIsWaiting] = useState(false)
	const [messages, setMessages] = useState([])
	const [lastMessage, setLastMessage] = useState('')
	const [input, setInput] = useState('')
	const [assistant, setAssistant] = useState(null)
	const [thread, setThread] = useState(null)
	const [openai, setOpenai] = useState(null)

	useEffect(() => {
		getPins()
		// initChatBot()
	}, [])

	// function timeout(delay) {
	// 	return new Promise( res => setTimeout(res, delay) );
	// }

	const initChatBot = async () => {
		const openai = new OpenAI({
			apiKey: import.meta.env.VITE_ASSISTANTS_API_KEY,
			dangerouslyAllowBrowser: true,
		})

		// console.log(pinsList)
		// const filteredData = pinsList.map(({ title, description, address, start, end }) => ({ title, description, address, start, end }));
		// console.log(JSON.stringify(filteredData))
		// await timeout(2000)
		const inst =
			"You are an assistant that locates and returns exactly one specific event found in JSON data provided to you that are catered towards a user's interests. Don't say anything else to the user except what is in the following format, and ensure your response is something from the JSON data provided. Do not provide anything not found  in the JSON data. Format your response like this and convert all times to EST timezone: `Event name`, `description`, `date` and `time` at `address`. Pick an event from the following the JSON data that I am attaching as a string: " +
			JSON.stringify(pinsList)

		console.log(inst)
		const assistant = await openai.beta.assistants.create({
			name: 'Relevant Events Locator',
			instructions: inst,
			model: 'gpt-3.5-turbo-1106',
		})

		const thread = await openai.beta.threads.create()

		setOpenai(openai)
		setAssistant(assistant)
		setThread(thread)
	}

	const createNewMessage = (content, isUser) => {
		const newMessage = new MessageInstance(isUser, content)
		return newMessage
	}

	const handleSendMessage = async (e) => {
		e.preventDefault()
		// getPins()

		messages.push(createNewMessage(input, true))
		setMessages([...messages])
		setInput('')
		setLastMessage('')

		initChatBot()

		await openai.beta.threads.messages.create(thread.id, {
			role: 'user',
			content: input,
		})

		const run = await openai.beta.threads.runs.create(thread.id, {
			assistant_id: assistant.id,
		})

		let response = await openai.beta.threads.runs.retrieve(thread.id, run.id)

		while (response.status === 'in_progress' || response.status === 'queued') {
			setIsWaiting(true)
			await new Promise((resolve) => setTimeout(resolve, 5000))
			response = await openai.beta.threads.runs.retrieve(thread.id, run.id)
		}

		setIsWaiting(false)

		const messageList = await openai.beta.threads.messages.list(thread.id)

		const recentMessage = messageList.data.filter((message) => message.run_id === run.id && message.role === 'assistant').pop()

		setLastMessage(recentMessage.content[0]['text'].value)
		// alert(recentMessage.content[0]['text'].value)
	}

	return (
		<div className="w-full z-[9]">
			<form onSubmit={handleSendMessage} className="w-full no-scrollbar">
				{isWaiting ? (
					<div className="p-2 w-full rounded-full border border-black bg-white overflow-x-auto h-14 no-scrollbar">
						<BeatLoader />
					</div>
				) : (
					<div className="p-4 w-full rounded-full border border-black bg-white overflow-x-auto h-14 no-scrollbar">
						{lastMessage !== '' ? (
							<div className="flex flex-row mr-8">
								<p>{lastMessage}</p>
								<button className="absolute right-0 my-4 mx-8" onClick={() => setLastMessage('')}>
									<FaRedoAlt />
								</button>
							</div>
						) : (
							<input
								className="w-full h-full border-transparent focus:outline-none focus:border-transparent focus:ring-0"
								type="text"
								value={input}
								placeholder="✨ Smart Search"
								onChange={(e) => setInput(e.target.value)}
							/>
						)}
					</div>
				)}

				<input type="submit" className="hidden cursor-pointer" />
			</form>
			{/* {messages.length > 0 && messages[messages.length - 1].isUser == false ? <p>{messages[messages.length - 1].content}</p> : null} */}
			{/* {lastMessage != '' ? (
				<div className="w-full flex flex-row justify-center bg-white">
					<div className="px-2 py-4 rounded-full border border-black w-1/2 text-center">
						<p className="text-center">{lastMessage}</p>{' '}
					</div>
				</div>
			) : null} */}
		</div>
	)
}

export class MessageInstance {
	constructor(isUser, content) {
		this.isUser = isUser
		this.content = content
	}
}

export default Chatbot
