import React from 'react'
import { useEffect, useState } from 'react'
import { db } from '../../config/firebase'
import { getDocs, getDoc, collection, addDoc, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore'
import OpenAI from 'openai'
import { BeatLoader } from 'react-spinners'

const Chatbot = () => {
	const pinCollection = collection(db, 'pins')
	const [pinsList, setPinsList] = useState([])

	const getPins = async () => {
		try {
			const pins = await getDocs(pinCollection)
			setPinsList(
				pins.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
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
		initChatBot()
	}, [])

	const initChatBot = async () => {
		const openai = new OpenAI({
			apiKey: import.meta.env.VITE_ASSISTANTS_API_KEY,
			dangerouslyAllowBrowser: true,
		})

		const assistant = await openai.beta.assistants.create({
			name: 'Relevant Events Locator',
			instructions:
				"You are an assistant that locates and returns exactly one specific event found in JSON data provided to you that are catered towards a user's interests. Return exactly one event from the provided list, even if you can't find anything relevant-- do not give no for an answer and return an event. Don't say anything else to the user except what is in the following format, and ensure your response is something from the JSON data provided. Do not provide anything not found  in the JSON data. Format your response like this and convert all times to EST timezone: `Event name` hosted by `host`. `description`. `date` and `time` at `address`. Here is the JSON data: " +
				JSON.stringify(pinsList, 32000),
			model: 'gpt-4-turbo-preview',
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
		getPins()

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
		alert(lastMessage)
	}

	return (
		<div>
			<form onSubmit={handleSendMessage}>
				<input className="p-4 rounded-full border border-black" type="text" value={input} placeholder="✨ Smart Search" onChange={(e) => setInput(e.target.value)}></input>
				<input type="submit" className="hidden" />
			</form>
			{/* {messages.length > 0 && messages[messages.length - 1].isUser == false ? <p>{messages[messages.length - 1].content}</p> : null} */}
			{isWaiting ? <BeatLoader /> : null}
			{/* {lastMessage != '' ? (
				<div className="w-full flex flex-row justify-center">
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
