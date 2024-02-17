import { useEffect, useState } from 'react'
import { db, auth, storage } from './config/firebase'
import { getDocs, getDoc, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div> 
          <p className="text-red-400 font-bold">hi</p>
          <h1 className="font-bold underline">
      Hello world!
    </h1>
      </div>
    </>
  )
}

export default App
