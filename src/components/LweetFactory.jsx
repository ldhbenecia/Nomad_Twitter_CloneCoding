import { dbService, storageService } from "fbase"
import { addDoc, collection } from "firebase/firestore"
import { getDownloadURL, ref, uploadString } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"
import React, { useRef, useState } from "react"

const LweetFactory = ({ userObj }) => {
  const [lweet, setLweet] = useState("") // form을 위한 state
  const [file, setFile] = useState("")
   const onSubmit = async (event) => {
     event.preventDefault()
     let fileUrl = "" // 변수 선언
     if (file !== "") {
       //프로필사진을 storage에 저장하기 만들어야함
       const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`)
       const response = await uploadString(fileRef, file, "data_url")
       //storage 참조 경로에 있는 파일의 URL을 다운로드
       fileUrl = await getDownloadURL(response.ref)
     }
     // lweet 오브젝트
     const lweetObj = {
       text: lweet,
       createdAt: Date.now(),
       creatorId: userObj.uid,
       fileUrl,
     }

     await addDoc(collection(dbService, "lweets"), lweetObj)
     setLweet("")
     setFile("")
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
    <form onSubmit={onSubmit}>
      <input
        value={lweet}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileInput}
      />
      <input type="submit" value="Lweet" />
      {file && (
        <div>
          <img src={file} width="50px" height="50px" />
          <button onClick={onClearFile}>Clear</button>
        </div>
      )}
    </form>
  )
}

export default LweetFactory
