import React, { useState } from 'react'
import "../style/login.scss"
import { Link, useNavigate } from "react-router";
import FormGroup from '../components/FormGroup'
import { useAuth } from '../hooks/useAuth'


const Login = () => {
  const { loading, handleLogin } = useAuth()
  const [ email, setEmail ] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    await handleLogin({email, password})
    navigate("/")
  }
  return (
    <main className='Login-page'>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <FormGroup
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            label="Email"
            type="email"
            id="email"
            name="email"
          />

          <FormGroup
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            label="Password"
            type="password"
            id="password"
            name="password"
          />

          <button type="submit" className="btn-submit">
            Login
          </button>
        </form>

        <p className="Link">
          Don't have an Account{" "}
          <Link className="link-le-ander" to="/register">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;