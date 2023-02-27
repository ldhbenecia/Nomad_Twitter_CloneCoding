import { authService } from "fbase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import React, { useState } from "react"

const AuthForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newAccount, setNewAccount] = useState(true)
  const [error, setError] = useState("")

  const handleOnChange = (e) => {
    const {
      target: { name, value },
    } = e

    if (name === "email") {
      setEmail(value)
    } else if (name === "password") {
      setPassword(value)
    }
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
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
      <form onSubmit={handleOnSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={handleOnChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={handleOnChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "SignIn"} />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign in" : "Create Account"}
      </span>
    </>
  )
}

export default AuthForm
