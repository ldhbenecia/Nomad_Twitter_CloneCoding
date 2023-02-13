import { authService } from "fbase"
import React, { useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth"

const Auth = () => {
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

  const handleOnSocialClick = async (e) => {
    const {
      target: { name },
    } = e

    let provider
    try {
      if (name === "google") {
        provider = new GoogleAuthProvider()
      } else if (name === "github") {
        provider = new GithubAuthProvider()
      }
      const data = await signInWithPopup(authService, provider)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
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
      <div>
        <button name="google" onClick={handleOnSocialClick}>
          Continue with Google
        </button>
        <button name="github" onClick={handleOnSocialClick}>
          Continue with Github
        </button>
      </div>
    </div>
  )
}

export default Auth
