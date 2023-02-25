import React, { useEffect, useRef, useState } from "react"
import { dbService } from "fbase"
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore"
import Lweet from "components/Lweet"

const Home = ({ userObj }) => {
  const [lweet, setLweet] = useState("") // form을 위한 state
  const [lweets, setLweets] = useState([])
  const [file, setFile] = useState()

  useEffect(() => {
    // 실시간으로 데이터를 데이터베이스에서 가져오기
    const q = query(
      collection(dbService, "lweets"),
      orderBy("createdAt", "desc")
    )
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

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event
    const theFile = files[0]
    const reader = new FileReader()
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent
      setFile(result) // onloadend에 finishedEvent의 result를 setFile로 설정
    }
    reader.readAsDataURL(theFile)
  }
  const fileInput = useRef() // 첨부파일명 삭제하기 위한 훅
  const onClearFile = () => {
    setFile(null) // 첨부파일 url 넣는 state 비워서 preview img src 삭제
    fileInput.current.value = null // 선택했던 첨부파일명 삭제
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
        <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
        <input type="submit" value="Lweet" />
        {file && (
          <div>
            <img src={file} width="50px" height="50px" />
            <button onClick={onClearFile}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {lweets.map((lweet) => (
          <Lweet
            key={lweet.id}
            lweetObj={lweet}
            isOwner={lweet.creatorId === userObj.uid}
          /> // Lweet component를 prop으로 가져와서 사용
        ))}
      </div>
    </div>
  )
}

export default Home
