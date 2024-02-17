import React from 'react'
import { useEffect, useState } from 'react'
import { db, auth } from '../../config/firebase'
import { getDocs, getDoc, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const Map = () => {

  const [selectedTime, setSelectedTime] = useState(new Date().getDate()) ;

  const [eventTitle, setEventTitle] = useState("") ;
  const [eventHost, setEventHost] = useState("") ;
  const [eventStart, setEventStart] = useState("") ;
  const [eventEnd, setEventEnd] = useState("") ;
  const [eventAddress, setEventAddress] = useState("") ;
  const [eventCoordinates, setEventCoordinates] = useState("") ;
  const [eventDescription, setEventDescription] = useState("") ;
  const [eventTags,setEventTags] = useState([{
            field: 'Club Meeting',
            checked: false
        },
        {
            field: 'Sporting Event',
            checked: false
        },
        {
            field: 'Cultural Event',
            checked: false
        }
    ]
  )

  const updateTags = (tag, isChecked) => {
      const tagsList = [...eventTags];
      tagsList[tag].checked = isChecked;
      setEventTags(tagsList);
  }

  const [pinsList, setPinsList] = useState([]) ;

  const pinCollection = collection(db, "pins") ;

  const deletePin = async(id) => {
    await deleteDoc(doc(db, "pins", id)) ;
    const newPinsList = pinsList.filter(pin => pin.id != id)
    setPinsList(newPinsList)
  }

  const getPins = async () => {
    try {
      const pins = await getDocs(pinCollection) ;
      setPinsList(pins.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })))
      console.log(pinsList) ;
      console.log("dasdad") ;
      // update pins list from database
    } catch (error) {
      console.log(error) ;
    }

  }

  const addPin = async (e) => {
    e.preventDefault()
    try {
      await addDoc(pinCollection,{
        title: eventTitle,
        host: eventHost,
        start: eventStart,
        end: eventEnd,
        address: eventAddress,
        coordinates: eventCoordinates,
        description: eventDescription,
        tags: eventTags,
        }
      ) ;
      getPins() ;
      setEventTitle("")
      setEventHost("")
      setEventStart("")
      setEventEnd("")
      setEventAddress("")
      setEventCoordinates("")
      setEventDescription("")
      setEventTags([{
                field: 'Club Meeting',
                checked: false
            },
            {
                field: 'Sporting Event',
                checked: false
            },
            {
                field: 'Cultural Event',
                checked: false
            }
      ])
    } catch (error) {
      console.log(error) ;
    }
  }

  useEffect(() => {
    getPins()
    console.log(selectedTime)
  }, []) ;

  return (
    <div>
      
      <div>
        {pinsList.map((pin) => (
          <div key={pin.id}>
            <h1> title: {pin.title} </h1>
              <p> host: {pin.host} </p>
              <p> start: {pin.start} </p>
              <p> end: {pin.end} </p>
              <p> address: {pin.address} </p>
              <p> coordinates: {pin.coordinates} </p>
              <p> description: {pin.description} </p>
              <p> tags: </p>

              {pin.tags.map((tag,index) => (
                <>
                  {tag.checked &&
                    <p> - {tag.field} </p>
                  }
                </>
              ))}
              <button onClick={() => deletePin(pin.id)}>Delete this pin</button>

              <br/>
              <br/>
          </div>
        ))}
      </div>
      <form className="flex flex-col" onSubmit={addPin}>
        <input value={eventTitle} type="text" placeholder="title" onChange={(e) => setEventTitle(e.target.value)} />
        <input value={eventHost} type="text" placeholder="host" onChange={(e) => setEventHost(e.target.value)} />
        <input value={eventStart} type="datetime-local" placeholder="start" onChange={(e) => setEventStart(e.target.value)} />
        <input value={eventEnd} type="datetime-local" placeholder="end" onChange={(e) => setEventEnd(e.target.value)} />
        <input value={eventAddress} type="text" placeholder="address" onChange={(e) => setEventAddress(e.target.value)} />
        <input value={eventCoordinates} type="text" placeholder="coordinates" onChange={(e) => setEventCoordinates(e.target.value)} />
        <input value={eventDescription} type="text" placeholder="description" onChange={(e) => setEventDescription(e.target.value)} />

        {
        eventTags.map((tag, index) =>
          <div key = {tag.field}>
            <label>
              <span>{tag.field}</span>
              <input key={index}
                 type="checkbox"
                 checked={tag.checked}
                 onChange={() => updateTags(index, !tag.checked)}
              />
            </label>
          </div>
        )}

        <input type="submit" value="submit" />
      </form>
    </div>
  )
}

export default Map
