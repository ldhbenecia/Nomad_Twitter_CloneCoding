import React, { useEffect, useState } from "react"
import { dbService } from "fbase"
import { addDoc, collection, query, onSnapshot, orderBy } from "firebase/firestore"

const Home = ({ userObj }) => {
  console.log(userObj)
  const [lweet, setLweet] = useState("")
  const [lweets, setLweets] = useState([])

  useEffect(() => {
    // 실시간으로 데이터를 데이터베이스에서 가져오기
    const q = query(collection(dbService, "lweets"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const nextLweets = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      })
      setLweets(nextLweets)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()

    const docRef = await addDoc(collection(dbService, "lweets"), {
      text: lweet,
      createdAt: Date.now(),
      creatorId: userObj.uid, // 이제 누가 lweeet를 만들었는지 알 수 있음
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
        {lweets.map(({ id, text }) => (
          <div key={id}>
            <h4>{text}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
