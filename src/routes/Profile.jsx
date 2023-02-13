import React from "react"
import { authService } from "fbase"
import { useNavigate } from "react-router-dom"

export default () => {
  const navigate = useNavigate()
  const onLogOutClick = () => {
    authService.signOut()
    navigate("/", { replace:true })
  }
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}
