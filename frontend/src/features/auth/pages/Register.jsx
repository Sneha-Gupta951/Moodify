import React, { useState } from 'react'
import "../style/login.scss"
import { Link, useNavigate } from 'react-router'
import FormGroup from '../components/FormGroup'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const { loading, handleRegister} = useAuth()
  const [username, setUsername]= useState("")
  const [ email, setEmail ] = useState("")
  const [ password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    await handleRegister({username, email, password})
    navigate("/")
  }
  return (
    <main className='Login-page'>
      <div className="form-container">
        <h1>Register</h1>

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
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
            label="Username"
            type="text"
            id="username"
            name="username"
          />

          <FormGroup
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
            label="Password"
            type="password"
            id="password"
            name="password"
          />

          <button type="submit" className="btn-submit">
            Register
          </button>
        </form>

        <p className="Link">
          Already have an Account?{" "}
          <Link className="link-le-ander" to="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;