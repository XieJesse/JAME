import { Fragment, React } from 'react'
import { useEffect, useState } from 'react'
import { db, auth } from '../../config/firebase'
import { getDocs, getDoc, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { GoogleMap, InfoWindowF, MarkerF, useLoadScript } from '@react-google-maps/api'

const Map = () => {
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

	const [pinsList, setPinsList] = useState([])

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
			console.log(pinsList)
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
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getPins()
		// console.log("selected date: " + selectedDate.toLocaleString("en-GB").substring(6,10)+"-"+selectedDate.toLocaleString("en-GB").substring(3,5)+"-"+selectedDate.toLocaleString("en-GB").substring(0,2))
	}, [])

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
	})

	const [activeMarker, setActiveMarker] = useState(null)

	const handleActiveMarker = (marker) => {
		if (marker === activeMarker) {
			return
		}
		setActiveMarker(marker)
		console.log(marker)
		// this is the same as the id of the document, so it is possible to send another get request
		const pin = getPin(marker)
		console.log(pin)
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

	return (
		<div>
			{/* Slider keep this */}
			<div class="slidecontainer">
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
			<div class="calendarcontainer">
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

			{/* Won't be needing this, this generates a list of all the events like b-engaged does. maybe we can take this out into its own page */}
			<div>
				{pinsList.map(
					(pin) =>
						selectedDate.getTime() >= new Date(pin.start).getTime() &&
						selectedDate.getTime() <= new Date(pin.end).getTime() && (
							<div key={pin.id}>
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
			</div>

			{/* Put this into a new dialog box */}
			<form className="flex flex-col" onSubmit={addPin}>
				<input value={eventTitle} type="text" placeholder="title" onChange={(e) => setEventTitle(e.target.value)} />
				<input value={eventHost} type="text" placeholder="host" onChange={(e) => setEventHost(e.target.value)} />
				<input value={eventStart} type="datetime-local" placeholder="start" onChange={(e) => setEventStart(e.target.value)} />
				<input value={eventEnd} type="datetime-local" placeholder="end" onChange={(e) => setEventEnd(e.target.value)} />
				<input value={eventAddress} type="text" placeholder="address" onChange={(e) => setEventAddress(e.target.value)} />
				<input value={eventCoordinates} type="text" placeholder="coordinates" onChange={(e) => setEventCoordinates(e.target.value)} />
				<input value={eventDescription} type="text" placeholder="description" onChange={(e) => setEventDescription(e.target.value)} />

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

			{/* Map */}
			<Fragment>
				<div className="container">
					<div style={{ height: '90vh', width: '100%' }}>
						{isLoaded ? (
							<GoogleMap center={{ lat: 42.088565, lng: -75.968623 }} zoom={16.5} onClick={onMapClick} mapContainerStyle={{ width: '100%', height: '90vh' }}>
								{pinsList.map(
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
