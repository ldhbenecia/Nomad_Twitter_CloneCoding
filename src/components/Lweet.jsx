import { dbService, storageService } from "fbase"
import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faUser, faPencilAlt } from "@fortawesome/free-solid-svg-icons"

const Lweet = ({ lweetObj, isOwner }) => {
  const [edting, setEditing] = useState(false) //edit모드 설정
  const [newLweet, setNewLweet] = useState(lweetObj.text) //input에 입력된 text업데이트
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this lweet?")
    if (ok) {
      await deleteDoc(doc(dbService, "lweets", lweetObj.id)) //firestore에서 뉴윗객체 지우기
      if (lweetObj.fileUrl !== "")
        await deleteObject(ref(storageService, lweetObj.fileUrl)) //storage에서 첨부파일 지우기
    }
  }
  const toggleEditing = () => setEditing((prev) => !prev)
  const onSubmit = async (event) => {
    event.preventDefault()
    await updateDoc(doc(dbService, "lweets", lweetObj.id), {
      text: newLweet,
    })
    setEditing(false)
  }
  const onChange = (event) => {
    const {
      target: { value },
    } = event
    setNewLweet(value)
  }
  return (
    <div className="lweet">
      {edting ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit} className="container lweetEdit">
                <input
                  type="text"
                  placeholder="Edit your lweet"
                  value={newLweet}
                  required
                  autoFocus
                  onChange={onChange}
                  className="formInput"
                />
                <input type="submit" value="Update Lweet" className="formBtn" />
              </form>
              <button onClick={toggleEditing} className="formBtn cancelBtn">
                Cancel
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{lweetObj.text}</h4>
          {lweetObj.fileUrl && (
            <img src={lweetObj.fileUrl} className="lweetPhoto" />
          )}
          {isOwner && (
            <div className="lweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Lweet