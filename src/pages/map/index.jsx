import { Fragment, React } from 'react'
import { useEffect, useState } from 'react'
import { db, auth } from '../../config/firebase'
import { getDocs, getDoc, collection, addDoc, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore'
import { GoogleMap, InfoWindowF, MarkerF, useLoadScript } from '@react-google-maps/api'
import { useGetUserInfo } from '../../hook/useGetUserInfo'

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
		console.log(favoritePins)
		const index = favoritePins.toString().indexOf(pinId)
		if (favoritePins.toString().indexOf(pinId) > -1) {
			// console.log(favoritePins) ; // existing, remove
			console.log(pinId) // existing, remove
			setFavoritePins(favoritePins.filter((pin) => pin != pinId))
		} else {
			console.log(pinId) // not existing, add
			setFavoritePins([pinId].concat(favoritePins))
		}
		await updateDoc(doc(db, 'users', id), { favorites: favoritePins })
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

			{/* Filters */}
			<p className="mt-100">a</p>
			{visibleTags.map((tag, index) => (
				<div className="z-20" key={tag.field}>
					<label>
						<span>{tag.field}</span>
						<input
							key={index}
							type="checkbox"
							checked={tag.checked}
							onChange={() => {
								console.log('a')
								updateVisibleTags(index, !tag.checked)
								setVisiblePins(
									pinsList.filter(
										(pin) =>
											([...pin.tags][0].checked && [...visibleTags][0].checked) ||
											([...pin.tags][1].checked && [...visibleTags][1].checked) ||
											([...pin.tags][2].checked && [...visibleTags][2].checked)
									)
								)
								// console.log(pinsList)
								// console.log(visiblePins)
							}}
						/>
					</label>
				</div>
			))}

			{/* Slider keep this */}
			<div className="slidecontainer">
				<input
					type="range"
					style={{ width: '570px' }}
					min="0"
					max="1439"
					value={selectedTime}
					onChange={(e) => {
						setSelectedTime(e.target.value)
						setSelectedDate(new Date(new Date(selectedDate.setMinutes(selectedTime % 60)).setHours(parseInt(selectedTime / 60))))
						// console.log(selectedDate.toLocaleString("en-GB").substring(6,10)+"-"+selectedDate.toLocaleString("en-GB").substring(3,5)+"-"+selectedDate.toLocaleString("en-GB").substring(0,2))
					}}
				/>
				{parseInt(selectedTime / 60) == 0 && <p> Selected Time: 12:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} AM</p>}
				{parseInt(selectedTime / 60) < 12 && parseInt(selectedTime / 60) > 0 && (
					<p>
						{' '}
						Selected Time: {parseInt(selectedTime / 60)}:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} AM
					</p>
				)}
				{parseInt(selectedTime / 60) == 12 && <p> Selected Time: 12:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} PM</p>}
				{parseInt(selectedTime / 60) > 12 && (
					<p>
						{' '}
						Selected Time: {parseInt(selectedTime / 60) % 12}:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} PM
					</p>
				)}
			</div>
			<div className="calendarcontainer">
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
			<br />

			<br />

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

			{/* Map */}
			<Fragment>
				{/* Put this into a new dialog box */}

				{/* Popup */}
				<div draggable="true" className={showPop ? 'popup active' : 'popup'}>
					<div style={{ background: 'white' }}>
						<form className="flex flex-col" onSubmit={addPin}>
							<input value={eventTitle} type="text" placeholder="title" required onChange={(e) => setEventTitle(e.target.value)} />
							<input value={eventHost} type="text" placeholder="host" required onChange={(e) => setEventHost(e.target.value)} />
							<input value={eventStart} type="datetime-local" placeholder="start" required onChange={(e) => setEventStart(e.target.value)} />
							<input value={eventEnd} type="datetime-local" placeholder="end" required onChange={(e) => setEventEnd(e.target.value)} />
							<input value={eventAddress} type="text" placeholder="address" required onChange={(e) => setEventAddress(e.target.value)} />
							<input value={eventCoordinates} type="text" placeholder="coordinates" required onChange={(e) => setEventCoordinates(e.target.value)} />
							<input value={eventDescription} type="text" placeholder="description" required onChange={(e) => setEventDescription(e.target.value)} />

							{eventTags.map((tag, index) => (
								<div key={tag.field}>
									<label>
										<span>{tag.field}</span>
										<input key={index} type="checkbox" checked={tag.checked} onChange={() => updateTags(index, !tag.checked)} />
									</label>
								</div>
							))}

							<input type="submit" value="submit" />
						</form>
					</div>
				</div>
				<div className="div" style={{ position: 'absolute', top: '25%', width: '100%', height: '82vh' }}>
					{/* Sidebar */}
					<div className={showNav ? 'sidenav active' : 'sidenav'}>
						<button style={{ position: 'absolute', zIndex: '2', right: '0px', top: '0px', padding: '20px' }} onClick={() => setShowNav(!showNav)}>
							X
						</button>
						{selectedPin != null ? (
							<div key={selectedPin.id}>
								{isAuth && <button onClick={() => updateFavoritePins(userID, selectedPin.id)}>Favorite this pin</button>}
								<h1> id: {selectedPin.id} </h1>
								<h1> title: {selectedPin.title} </h1>
								<p> host: {selectedPin.host} </p>
								<p> start: {selectedPin.start} </p>
								<p> end: {selectedPin.end} </p>
								<p> address: {selectedPin.address} </p>
								<p> coordinates: {selectedPin.coordinates} </p>
								<p> description: {selectedPin.description} </p>
								<p> tags: </p>

								{selectedPin.tags.map((tag, index) => (
									<>{tag.checked && <p> - {tag.field} </p>}</>
								))}
								<button onClick={() => deletePin(selectedPin.id)}>Delete this pin</button>

								<br />
								<br />
							</div>
						) : null}
					</div>
					{/* Add Pin BTN */}
					<button style={{ position: 'absolute', zIndex: '2', right: '80px', top: '20px' }} onClick={() => setShowPop(!showPop)}>
						ADD PIN
					</button>

					<div className="mt-40" style={{ height: '100vh', width: '100%' }}>
						{isLoaded ? (
							<GoogleMap center={{ lat: 42.088565, lng: -75.968623 }} zoom={16.5} onClick={onMapClick} mapContainerStyle={{ width: '100%', height: '90vh' }}>
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
												// icon={{
												//   url:"https://t4.ftcdn.net/jpg/02/85/33/21/360_F_285332150_qyJdRevcRDaqVluZrUp8ee4H2KezU9CA.jpg",
												//   scaledSize: { width: 50, height: 50 }
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
