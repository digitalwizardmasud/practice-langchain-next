import React, { useState } from 'react'

const streaming =  () => {
  const [source, setSource] = useState()
  const startStreaming = async() => {
    await fetch("/api/streaming", {
      method:'POST',
      headers: {
        "Content-Type": "application/json",
      },
    })
    if(source){
      source.close()
    }
    const countEventSource = new EventSource("/api/streaming")
    setSource(countEventSource)
    countEventSource.addEventListener("countaa", (event)=>{
      console.log(event, 'countEvent');
    })
    countEventSource.addEventListener("end", (event)=>{
      countEventSource.close()
      console.log(event, 'end event');
    })

    
  }
  return (
    <div>
      <button onClick={startStreaming}>Streaming</button>
    </div>
  )
}

export default streaming