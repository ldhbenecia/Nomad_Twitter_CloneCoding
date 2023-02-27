import React, { useEffect, useState } from "react"
import { dbService } from "fbase"
import { collection, query, onSnapshot, orderBy } from "firebase/firestore"
import Lweet from "components/Lweet"
import LweetFactory from "components/LweetFactory"

const Home = ({ userObj }) => {
  const [lweets, setLweets] = useState([])

  useEffect(() => {
    //스냅샷은 리스너(관찰자)로 변화를 감지, 새로운 스냅샷을 받을때 배열을 만들고 lweets state에 넣음
    const q = query(collection(dbService, "nweets"), orderBy("createdAt", "desc"))
    onSnapshot(q, (snapshot) => {
      const LweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setLweets(LweetArray)
    })
  }, [])

  return (
    <div>
      <LweetFactory userObj={userObj} />
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
