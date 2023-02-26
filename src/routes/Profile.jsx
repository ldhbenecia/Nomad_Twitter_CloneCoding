import React, { useEffect, useState } from "react"
import { authService, dbService } from "fbase"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { signOut, updateProfile } from "firebase/auth"

const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate()
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
  const onChange = (e) => {
    const {
      target: { value },
    } = e
    setNewDisplayName(value)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      })
      refreshUser()
    }
  }

  const onLogOutClick = () => {
    signOut(authService)
    navigate("/")
  }
  const getMyLweets = async () => {
    //동일한 uid를 조건부로 필터링하는 쿼리
    const q = query(
      collection(dbService, "lweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt")
    )
    //쿼리를 실행하고 결과를 QuerySnapshot 으로 반환
    const lweets = await getDocs(q)
  }
  useEffect(() => {
    getMyLweets()
  }, [])

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}

export default Profile
