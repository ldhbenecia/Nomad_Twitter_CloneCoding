import { authService } from "fbase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import React, { useState } from "react"

const AuthForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newAccount, setNewAccount] = useState(true)
  const [error, setError] = useState("")

  const OnChange = (event) => {
    const {
      target: { name, value },
    } = event

    if (name === "email") {
      setEmail(value)
    } else if (name === "password") {
      setPassword(value)
    }
  }

  const OnSubmit = async (event) => {
    event.preventDefault()
    try {
      let data
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        )
      } else {
        data = await signInWithEmailAndPassword(authService, email, password)
      }
      console.log(data)
    } catch (error) {
      setError(error.message)
    }
  }

  const toggleAccount = () => {
    setNewAccount((prev) => !prev)
  }
  return (
    <>
      <form onSubmit={OnSubmit} className="container">
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={OnChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={OnChange}
          className="authInput"
        />
        <input
          type="submit"
          className="authInput authSubmit"
          value={newAccount ? "Create Account" : "SignIn"}
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign in" : "Create Account"}
      </span>
    </>
  )
}

export default AuthForm
