import React from 'react'
import { useEffect, useState } from 'react'
import { db, auth } from '../../config/firebase'
import { getDocs, getDoc, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const Map = () => {

  const [count, setCount] = useState(0) ;

  const [eventTitle, setEventTitle] = useState("") ;
  const [eventHost, setEventHost] = useState("") ;
  const [eventStart, setEventStart] = useState("") ;
  const [eventEnd, setEventEnd] = useState("") ;
  const [eventAddress, setEventAddress] = useState("") ;
  const [eventCoordinates, setEventCoordinates] = useState("") ;
  const [eventDescription, setEventDescription] = useState("") ;
  const [eventTags,setEventTags] = useState([]) ;

  const [pinsList, setPinsList] = useState([]) ;

  const pinCollection = collection(db, "pins") ;

  const getPins = async () => {
    try {
      const pins = await getDocs(pinCollection) ;
      setPinsList(pins.docs.map((doc) => ({
        ...doc.data(),
      })))
      console.log(pinsList)
      // update pins list from database
    } catch (error) {
      console.log(error) ;
    }

  }

  const addPin = async () => {
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
    } catch (error) {
      console.log(error) ;
    }
  }
  useEffect(() => {
    getPins()
  }, []) ;

  return (
    <div>
      <div>
        {pinsList.map((pin) => (
          <>
            <h1> title: {pin.title} </h1>
              host: {pin.host}
              start: {pin.start}
          </>

        ))}
      </div>

    </div>
  )
}

export default Map
