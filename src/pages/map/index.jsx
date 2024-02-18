import React from 'react'
import { useEffect, useState } from 'react'
import { db, auth } from '../../config/firebase'
import { getDocs, getDoc, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const Map = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(new Date().getHours()*60+new Date().getMinutes()) ;

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
      // console.log("dasdad") ;
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
    // console.log("selected date: " + selectedDate.toLocaleString("en-GB").substring(6,10)+"-"+selectedDate.toLocaleString("en-GB").substring(3,5)+"-"+selectedDate.toLocaleString("en-GB").substring(0,2))
  }, []) ;

  return (
    <div>
      <div class="slidecontainer">
        <input type="range" style={{width: "570px"}} min="0" max="1439" value={selectedTime} onChange={(e) => {
          setSelectedTime(e.target.value);
          setSelectedDate(new Date((new Date(selectedDate.setMinutes(selectedTime % 60)).setHours(parseInt(selectedTime / 60))))) ;
          // console.log(selectedDate.toLocaleString("en-GB").substring(6,10)+"-"+selectedDate.toLocaleString("en-GB").substring(3,5)+"-"+selectedDate.toLocaleString("en-GB").substring(0,2))
        }}/>
        {(parseInt(selectedTime / 60)) == 0 &&
          <p> Selected Time: 12:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} AM</p>
        }
        {(parseInt(selectedTime / 60)) < 12 && (parseInt(selectedTime / 60)) > 0 &&
          <p> Selected Time: {(parseInt(selectedTime / 60))}:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} AM</p>
        }
        {(parseInt(selectedTime / 60)) == 12 &&
          <p> Selected Time: 12:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} PM</p>
        }
        {(parseInt(selectedTime / 60)) > 12 &&
          <p> Selected Time: {(parseInt(selectedTime / 60) % 12)}:{selectedTime % 60 <= 9 ? <span>0{selectedTime % 60}</span> : <span>{selectedTime % 60}</span>} PM</p>
        }
      </div>
      <div class="calendarcontainer">
        <input type="date" id="start" name="start" value={selectedDate.toLocaleString("en-GB").substring(6,10)+"-"+selectedDate.toLocaleString("en-GB").substring(3,5)+"-"+selectedDate.toLocaleString("en-GB").substring(0,2)} min="2024-01-01" max="2024-12-31" onChange={(e) => {
          const a = new Date(e.target.value) ;
          a.setDate(a.getDate()+1) ;
          setSelectedDate(new Date(a)) ;
          console.log(e.target.value) ;
        }
        }/>
      </div>
      <br/>
      <div>
        {pinsList.map((pin) => (
          selectedDate.getTime() >= new Date(pin.start).getTime() && selectedDate.getTime() <= new Date(pin.end).getTime() &&
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
