import { Fragment, React } from 'react'
import { useEffect, useState } from 'react'
import { db, auth } from '../../config/firebase'
import { getDocs, getDoc, collection, addDoc, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore'
import { GoogleMap, InfoWindowF, MarkerF, useLoadScript } from '@react-google-maps/api'
import { useGetUserInfo } from '../../hook/useGetUserInfo'
import Chatbot from '../chatbot/index.jsx'
import green_marker from '../../assets/green_marker.png'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { GoStar, GoStarFill } from 'react-icons/go'
import { FaTrashAlt } from 'react-icons/fa'

const Map = () => {
	const { name, profilePhoto, userID, isAuth } = useGetUserInfo()

	const [selectedDate, setSelectedDate] = useState(new Date())
	const [selectedTime, setSelectedTime] = useState(new Date().getHours() * 60 + new Date().getMinutes())

	const [eventTitle, setEventTitle] = useState('')
	const [eventHost, setEventHost] = useState('')
	const [eventStart, setEventStart] = useState('')
	const [eventEnd, setEventEnd] = useState('')
	const [eventAddress, setEventAddress] = useState('')
	const [eventCoordinates, setEventCoordinates] = useState('')
	const [eventDescription, setEventDescription] = useState('')
	const [eventTags, setEventTags] = useState([
		{
			field: 'Club Meeting',
			checked: false,
		},
		{
			field: 'Sporting Event',
			checked: false,
		},
		{
			field: 'Cultural Event',
			checked: false,
		},
	])

	const updateTags = (tag, isChecked) => {
		const tagsList = [...eventTags]
		tagsList[tag].checked = isChecked
		setEventTags(tagsList)
	}

	const [visibleTags, setVisibleTags] = useState([
		{
			field: 'Favorites',
			checked: false,
		},
		{
			field: 'Club Meeting',
			checked: true,
		},
		{
			field: 'Sporting Event',
			checked: true,
		},
		{
			field: 'Cultural Event',
			checked: true,
		},
	])

	const updateVisibleTags = (tag, isChecked) => {
		const tagsList = [...visibleTags]
		tagsList[tag].checked = isChecked
		setVisibleTags(tagsList)
	}

	const [pinsList, setPinsList] = useState([])
	const [visiblePins, setVisiblePins] = useState([])

	const pinCollection = collection(db, 'pins')

	const deletePin = async (id) => {
		await deleteDoc(doc(db, 'pins', id))
		const newPinsList = pinsList.filter((pin) => pin.id != id)
		setPinsList(newPinsList)
	}

	const getPins = async () => {
		try {
			const pins = await getDocs(pinCollection)

			setPinsList(
				pins.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))
			)
			// console.log(pinsList)
			setVisiblePins(
				pins.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))
			)
			console.log(visiblePins)
			// console.log("dasdad") ;
			// update pins list from database
		} catch (error) {
			console.log(error)
		}
	}

	// gets a single pin
	const getPin = (id) => {
		let pin = null
		// console.log(pinsList)
		for (let i = 0; i < pinsList.length; i++) {
			if (pinsList[i].id == id) {
				pin = pinsList[i]
			}
		}
		return pin
	}

	const addPin = async (e) => {
		e.preventDefault()
		try {
			await addDoc(pinCollection, {
				title: eventTitle,
				host: eventHost,
				start: eventStart,
				end: eventEnd,
				address: eventAddress,
				coordinates: eventCoordinates,
				description: eventDescription,
				tags: eventTags,
			})
			getPins()
			setEventTitle('')
			setEventHost('')
			setEventStart('')
			setEventEnd('')
			setEventAddress('')
			setEventCoordinates('')
			setEventDescription('')
			setEventTags([
				{
					field: 'Club Meeting',
					checked: false,
				},
				{
					field: 'Sporting Event',
					checked: false,
				},
				{
					field: 'Cultural Event',
					checked: false,
				},
			])
			// setPinsList([
			// 	...pinsList,
			// 	{
			// 		title: eventTitle,
			// 		host: eventHost,
			// 		start: eventStart,
			// 		end: eventEnd,
			// 		address: eventAddress,
			// 		coordinates: eventCoordinates,
			// 		description: eventDescription,
			// 		tags: eventTags,
			// 	},
			// ])
		} catch (error) {
			console.log(error)
		}
	}

	const userCollection = collection(db, 'users')

	const [favoritePins, setFavoritePins] = useState([])

	const addUser = async (id) => {
		console.log(id)
		// e.preventDefault()
		try {
			await setDoc(doc(db, 'users', id), {
				favorites: [],
			})
			console.log('favoritePins')
		} catch (error) {
			console.log(error)
		}
	}

	const getFavoritePins = async (id) => {
		try {
			const user = await getDoc(doc(db, 'users', id))
			if (user.exists()) {
				setFavoritePins(user.data().favorites)
				// console.log(favoritePins) ;
			} else {
				addUser(id)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const updateFavoritePins = async (id, pinId) => {
		// console.log(favoritePins)
		const index = favoritePins.toString().indexOf(pinId)
		if (favoritePins.toString().indexOf(pinId) > -1) {
			console.log(pinId) // existing, remove
			const newFavorites = favoritePins.filter((pin) => pin != pinId)
			setFavoritePins(newFavorites)
			await updateDoc(doc(db, 'users', id), { favorites: newFavorites })
		} else {
			console.log(pinId) // not existing, add
			const newFavorites = [pinId].concat(favoritePins)
			setFavoritePins(newFavorites)
			await updateDoc(doc(db, 'users', id), { favorites: newFavorites })
		}
	}

	useEffect(() => {
		getPins()
		getFavoritePins(userID)
		// console.log(userID)
		// console.log("selected date: " + selectedDate.toLocaleString("en-GB").substring(6,10)+"-"+selectedDate.toLocaleString("en-GB").substring(3,5)+"-"+selectedDate.toLocaleString("en-GB").substring(0,2))
	}, [])

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
	})

	const [activeMarker, setActiveMarker] = useState(null)

	const [selectedPin, setSelectedPin] = useState(getPin('5wg1LFQyivd0DkOqoHu1'))

	const handleActiveMarker = (marker) => {
		setShowNav(!showNav)
		//if (marker === activeMarker) {
		//	return
		//}
		//setActiveMarker(marker)
		setSelectedPin(marker)
		// console.log(marker)
		// this is the same as the id of the document, so it is possible to send another get request
		const pin = getPin(marker)
		setSelectedPin(pin)
		// console.log(pin)
	}

	// const [clickMarkers, setClickMarkers] = useState([]);

	const onMapClick = (e) => {
		// console.log(e)
		setActiveMarker(null)
		// setClickMarkers((current) => [
		//   ...current,
		//   {
		//     lat: e.latLng.lat(),
		//     lng: e.latLng.lng()
		//   }
		// ]);
		setEventCoordinates('' + e.latLng.lat() + ' ' + e.latLng.lng())
		// let address = await getAddress(e.latLng.lat(), e.latLng.lng())
		getAddress(e.latLng.lat(), e.latLng.lng()).then((result) => setEventAddress(result))
		navigator.clipboard.writeText('' + e.latLng.lat() + ' ' + e.latLng.lng())
		// console.log(clickMarkers)
	}

	const getAddress = async (lng, lat) => {
		try {
			const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lng},${lat}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`)
			console.log(response)
			const data = await response.json()
			if (data.results && data.results.length > 0) {
				const address = data.results[0].formatted_address
				console.log(address)
				return address
			} else {
				throw new Error('No results found')
			}
		} catch (error) {
			console.log(error)
			return null
		}
	}

	const [showNav, setShowNav] = useState(false)
	const [showPop, setShowPop] = useState(false)

	return (
		<div>
			{/* <div>
				{visiblePins.map(
					(pin) =>
						selectedDate.getTime() >= new Date(pin.start).getTime() &&
						selectedDate.getTime() <= new Date(pin.end).getTime() && (
							<div key={pin.id}>
								<h1> title: {pin.title} </h1>
								<p> host: {pin.host} </p>
								<p>address: {pin.address}</p>
							</div>
						)
				)}
			</div> */}

			{/* Slider keep this */}
			<div className="w-1/3 bg-white p-4 px-6 mt-4 rounded-full border-neutral-200 border border-2 absolute mx-auto left-0 right-0 z-[9]">
				<div
					className="slidecontainer w-full flex flex-row gap-4 justify-center align-center items-center"
					// style={{ background: '#206e3c' }}
				>
					{parseInt(selectedTime / 60) == 0 && <p className="font-bold"> 12:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} AM</p>}
					{parseInt(selectedTime / 60) < 12 && parseInt(selectedTime / 60) > 0 && (
						<p className="font-bold">
							{' '}
							{parseInt(selectedTime / 60)}:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} AM
						</p>
					)}
					{parseInt(selectedTime / 60) == 12 && <p className="font-bold"> 12:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} PM</p>}
					{parseInt(selectedTime / 60) > 12 && (
						<p className="font-bold">
							{' '}
							{parseInt(selectedTime / 60) % 12}:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} PM
						</p>
					)}
					<input
						type="range"
						className="w-full text-center h-12"
						min="0"
						max="1439"
						value={selectedTime}
						onChange={(e) => {
							setSelectedTime(e.target.value)
							setSelectedDate(new Date(new Date(selectedDate.setMinutes(selectedTime % 60)).setHours(parseInt(selectedTime / 60))))
							// console.log(selectedDate.toLocaleString("en-GB").substring(6,10)+"-"+selectedDate.toLocaleString("en-GB").substring(3,5)+"-"+selectedDate.toLocaleString("en-GB").substring(0,2))
						}}
					/>

					<input
						type="date"
						id="start"
						name="start"
						value={selectedDate.toLocaleString('en-GB').substring(6, 10) + '-' + selectedDate.toLocaleString('en-GB').substring(3, 5) + '-' + selectedDate.toLocaleString('en-GB').substring(0, 2)}
						min="2024-01-01"
						max="2024-12-31"
						onChange={(e) => {
							const a = new Date(e.target.value)
							a.setDate(a.getDate() + 1)
							setSelectedDate(new Date(a))
							console.log(e.target.value)
						}}
					/>
				</div>
			</div>

			{/* Filters */}
			{/* <p className="w-full text-center mt-4">Filter</p> */}
			<div className="w-fit top-[18%] gap-20 absolute mx-auto left-0 right-0 z-[9]">
				<div className="bg-transparent  px-6 py-3 rounded-full  w-full">
					{visibleTags.map((tag, index) => (
						<label>
							<span
								className={
									tag.checked
										? 'hover:cursor-pointer mx-1 px-4 py-2 drop-shadow-lg rounded-full bg-blue-100 transition hover:bg-neutral-200 font-medium duration-300 shadow-xl border-neutral-200'
										: 'font-sm hover:cursor-pointer mx-1 rounded-full px-4 py-2 bg-neutral-300 text-neutral-500 hover:bg-blue-100 duration-300 transition'
								}
							>
								{tag.field}
							</span>
							<input
								className="hidden"
								key={index}
								type="checkbox"
								checked={tag.checked}
								onChange={() => {
									// console.log('filter checked')
									updateVisibleTags(index, !tag.checked)
									setVisiblePins(
										pinsList.filter(
											(pin) =>
												(([...pin.tags][0].checked && [...visibleTags][1].checked) ||
													([...pin.tags][1].checked && [...visibleTags][2].checked) ||
													([...pin.tags][2].checked && [...visibleTags][3].checked)) &&
												([...visibleTags][0].checked ? favoritePins.toString().indexOf(pin.id) > -1 : true)
										)
									)
									// console.log(pinsList)
									// console.log(visiblePins)
								}}
							/>
						</label>
					))}
				</div>
			</div>

			{/* Deprecated Popup */}
			{/* <div className="popup">
					{visiblePins.map(
						(pin) =>
							selectedDate.getTime() >= new Date(pin.start).getTime() &&
							selectedDate.getTime() <= new Date(pin.end).getTime() && (
								<div key={pin.id}>
									{isAuth && <button onClick={() => updateFavoritePins(userID, pin.id)}>Favorite this pin</button>}
									<h1> id: {pin.id} </h1>
									<h1> title: {pin.title} </h1>
									<p> host: {pin.host} </p>
									<p> start: {pin.start} </p>
									<p> end: {pin.end} </p>
									<p> address: {pin.address} </p>
									<p> coordinates: {pin.coordinates} </p>
									<p> description: {pin.description} </p>
									<p> tags: </p>
	
									{pin.tags.map((tag, index) => (
										<>{tag.checked && <p> - {tag.field} </p>}</>
									))}
									<button onClick={() => deletePin(pin.id)}>Delete this pin</button>
	
									<br />
									<br />
								</div>
							)
					)}
				</div> */}

			{/* Chatbot */}
			<div className="w-1/3 text-center absolute left-0 right-0 mx-auto bottom-20 z-[9]">
				<Chatbot />
			</div>

			{/* Map */}
			<Fragment>
				{/* Put this into a new dialog box */}

				{/* Popup */}
				<div className={showPop ? 'popup active border-black border border-2' : 'popup'}>
					<div>
						<p className="text-center font-bold">Add Pin</p>
						<form className="flex flex-col gap-2" onSubmit={addPin}>
							<input className="px-2 py-1 rounded-full" value={eventTitle} type="text" placeholder="Event Title" required onChange={(e) => setEventTitle(e.target.value)} />
							<input className="px-2 py-1 rounded-full" value={eventHost} type="text" placeholder="Hosting Organization" required onChange={(e) => setEventHost(e.target.value)} />
							<input className="px-2 py-1 rounded-full" value={eventDescription} type="text" placeholder="Description" required onChange={(e) => setEventDescription(e.target.value)} />

							<div className="flex flex-row w-full gap-2">
								<input value={eventStart} type="datetime-local" placeholder="start" required onChange={(e) => setEventStart(e.target.value)} />
								<input value={eventEnd} type="datetime-local" placeholder="end" required onChange={(e) => setEventEnd(e.target.value)} />
							</div>
							<input className="px-2 py-1 rounded-full" value={eventAddress} type="text" placeholder="Address" required onChange={(e) => setEventAddress(e.target.value)} />
							<input className="px-2 py-1 rounded-full" value={eventCoordinates} type="text" placeholder="Coordinates" required onChange={(e) => setEventCoordinates(e.target.value)} />
							<hr className="py-2" />
							<p className="font-bold">Tags</p>
							<div className="w-full ">
								{eventTags.map((tag, index) => (
									<div className="py-2 w-fit inline-block" key={tag.field}>
										<label>
											<span
												className={
													tag.checked
														? 'border border-1  border-black hover:cursor-pointer mx-1 px-4 py-2 drop-shadow-lg rounded-full hover:bg-gray-200 transition duration-300'
														: 'font-sm hover:cursor-pointer mx-1 rounded-full px-4 py-2 hover:bg-neutral-300 duration-300 transition'
												}
											>
												{tag.field}
											</span>
											<input className="hidden" key={index} type="checkbox" checked={tag.checked} onChange={() => updateTags(index, !tag.checked)} />
										</label>
									</div>
								))}
							</div>
							<input
								className="w-full border mt-4 border-black border-1 px-6 py-2 rounded-full hover:cursor-pointer bg-green-100 transition duration-300 hover:bg-emerald-200"
								type="submit"
								value="Submit"
							/>
						</form>
					</div>
				</div>
				<div className="" style={{ width: '100%', height: '80vh' }}>
					{/* Sidebar */}
					<div className={showNav ? 'sidenav active' : 'sidenav'}>
						<button style={{ position: 'absolute', zIndex: '4', right: '0px', top: '0px', padding: '20px' }} onClick={() => setShowNav(!showNav)}>
							<IoIosCloseCircleOutline size={30} />
						</button>
						{selectedPin != null ? (
							<div className="mt-20" key={selectedPin.id}>
								{/* <h1> id: {selectedPin.id} </h1> */}
								<div className="flex flex-row justify-between">
									<p className="font-bold text-lg"> {selectedPin.title} </p>
									{isAuth && (
										<button onClick={() => updateFavoritePins(userID, selectedPin.id)}>
											<GoStar size={25} />
										</button>
									)}
								</div>
								<p className="text-neutral-600 text-sm font-bold italic"> {selectedPin.host} </p>
								<p> {selectedPin.description} </p>

								<div className="mt-6">
									<p> Start: {new Date(selectedPin.start).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short', hour12: true })} </p>
									<p> End: {new Date(selectedPin.end).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short', hour12: true })} </p>
									<p> {selectedPin.address} </p>
								</div>
								{/* <p> coordinates: {selectedPin.coordinates} </p> */}
								<p className="font-bold mt-4">Tags </p>

								{selectedPin.tags.map((tag, index) => (
									<>
										{tag.checked && (
											<div className="border border-black w-fit px-4 py-2 my-2 rounded-full">
												<p>{tag.field} </p>
											</div>
										)}
									</>
								))}

								<button
									className="border border-black w-11/12 rounded-full bg-red-100 hover:bg-red-300 transition duration-300"
									style={{ left: '50%', transform: 'translate(-50%,-50%)', position: 'absolute', bottom: '0px' }}
									onClick={() => deletePin(selectedPin.id)}
								>
									<div className="flex flex-row justify-center items-center gap-4 py-4">
										<p className="font-bold ">Delete this event</p>
										<FaTrashAlt size={20} />
									</div>
								</button>

								<br />
								<br />
							</div>
						) : null}
					</div>
					{/* Add Pin BTN */}
					<button
						className="p-2 bg-white border hover:bg-slate-100 transition duration-300 rounded-full border-black text-lg"
						style={{ position: 'absolute', zIndex: '10', right: '80px', top: '110px' }}
						onClick={() => setShowPop(!showPop)}
					>
						{/* ADD PIN */}
						<HiOutlineLocationMarker size={35} />
					</button>

					<div style={{ width: '100%' }}>
						{isLoaded ? (
							<GoogleMap center={{ lat: 42.088565, lng: -75.968623 }} zoom={16.5} onClick={onMapClick} mapContainerStyle={{ width: '100%', height: '91vh' }}>
								{visiblePins.map(
									({ id, host, coordinates, description, start, end }) =>
										selectedDate.getTime() >= new Date(start).getTime() &&
										selectedDate.getTime() <= new Date(end).getTime() && (
											<MarkerF
												key={id}
												position={{
													lat: parseFloat(coordinates.split(' ')[0]),
													lng: parseFloat(coordinates.split(' ')[1]),
												}}
												onClick={() => handleActiveMarker(id)}
												// icon={"http://maps.google.com/mapfiles/ms/icons/blue.png"}
												icon={{
													url: green_marker,
													scaledSize: { width: 30, height: 50 },
												}}
												// icon={{
												// 	url: 'https://t4.ftcdn.net/jpg/02/85/33/21/360_F_285332150_qyJdRevcRDaqVluZrUp8ee4H2KezU9CA.jpg',
												// 	scaledSize: { width: 50, height: 50 },
												// }}
											>
												{activeMarker === id ? (
													<InfoWindowF onCloseClick={() => setActiveMarker(null)}>
														<div>
															<p>{host}</p>
															<p>{description}</p>
														</div>
													</InfoWindowF>
												) : null}
											</MarkerF>
										)
								)}
							</GoogleMap>
						) : null}
					</div>
				</div>
			</Fragment>
		</div>
	)
}

export default Map
