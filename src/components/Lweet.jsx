import { dbService } from "fbase"
import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import React, { useState } from "react"

const Lweet = ({ lweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false) // 값을 수정하고 있는지 아닌지 상태 확인
  const [newLweet, setNewLweet] = useState(lweetObj.text) // input 값 수정 state
  const LweetTextRef = doc(dbService, "lweets", `${lweetObj.id}`) // 리터럴
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this lweet?")
    if (ok) {
      // delete lweet
      await deleteDoc(LweetTextRef)
    }
  }

  const toggleEditing = () => {
    setEditing((prev) => !prev)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    // update lweet
    await updateDoc(LweetTextRef, {
      text: newLweet,
    })
    setEditing(false)
  }

  const onChange = (event) => {
    setNewLweet(event.target.value)
  }
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your Lweet"
              value={newLweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Lweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{lweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Lweet</button>
              <button onClick={toggleEditing}>Edit Lweet</button>
            </> // isOwner일 때만 이 버튼 fragment들을 볼 수 있음
          )}
        </>
      )}
    </div>
  )
}

export default Lweet
