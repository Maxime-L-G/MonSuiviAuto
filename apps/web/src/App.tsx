import { useEffect, useState } from "react"

function App() {
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetch("http://localhost:4000/health")
      .then(res => res.json())
      .then(data => setStatus(data.status))
  }, [])

  return (
    <div>
      <h1>MonSuiviAuto</h1>
      <p>API status : {status}</p>
    </div>
  )
}

export default App
