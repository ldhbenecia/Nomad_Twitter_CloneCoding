import React, { useState } from "react"
import { dbService } from "fbase"
import { addDoc, collection } from "firebase/firestore"

const Home = () => {
  const [lweet, setLweet] = useState("")
  const onSubmit = async (event) => {
    event.preventDefault()

    const docRef = await addDoc(collection(dbService, "lweets"), {
      lweet,
      createdAt: Date.now(),
    })
    setLweet("")
  }
  const onChange = (event) => {
    setLweet(event.target.value)
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={lweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Lweet" />
      </form>
    </div>
  )
}

export default Home
