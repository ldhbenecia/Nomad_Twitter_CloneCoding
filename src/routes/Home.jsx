import React, { useEffect, useState } from "react"
import { dbService } from "fbase"
import { addDoc, collection, getDocs } from "firebase/firestore"

const Home = () => {
  const [lweet, setLweet] = useState("")
  const [lweets, setLweets] = useState([])
  useEffect(() => {
    const getLweets = async () => {
      const dbLweets = await getDocs(collection(dbService, "lweets"))
      dbLweets.forEach((document) => {
        const lweetObject = {
          ...document.data(), // 모든 document data
          id: document.id, // id도 줄 것
        }
        setLweets((prev) => [lweetObject, ...prev]) // ... = 데이터의 내용물
      })
    }
    getLweets()
  }, [])

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
      <div>
        {lweets.map(({ id, lweet }) => (
          <div key={id}>
            <h4>{lweet}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
