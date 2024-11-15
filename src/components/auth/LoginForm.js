import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: credentialResponse.credential })
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Google login error:', error)
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Google Login Failed')}
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default LoginForm