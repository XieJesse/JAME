import { useState } from 'react'

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
