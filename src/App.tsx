import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <button className='bg-blue-500 text-white p-2 rounded-md m-10' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
    </>
  )
}

export default App
