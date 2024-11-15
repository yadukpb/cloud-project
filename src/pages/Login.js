import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Mail, 
  Lock,
  Eye, 
  EyeOff, 
  GraduationCap,
  Loader
} from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom styles for Material UI components
const styles = {
  card: {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  gradientButton: {
    background: 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
    borderRadius: '8px',
    border: 0,
    color: 'white',
    height: '48px',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 10px 2px rgba(33, 150, 243, .3)',
    }
  },
  googleButton: {
    borderRadius: '8px',
    height: '48px',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    }
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '&:hover fieldset': {
        borderColor: '#2196F3',
      },
    },
  }
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://course-catalog-5tbw.onrender.com';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      const endpoint = isSignUp ? '/api/signup' : '/api/login';
      const response = await axios.post(
        `${API_BASE_URL}${endpoint}`,
        {
          email: formData.email.trim(),
          password: formData.password
        },
        {
          withCredentials: true,
          headers: { 
            'Content-Type': 'application/json'
          }
        }
      );
      
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/courses');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          (isSignUp ? 'Sign up failed' : 'Invalid email or password');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/google`,
        {
          token: credentialResponse.credential
        },
        {
          withCredentials: true,
          headers: { 
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/courses');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google sign-in failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #EBF4FF 0%, #E6E9FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing(4),
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '440px' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                mb: 2,
              }}
            >
              <GraduationCap size={32} color="white" />
            </Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome to MyCourses
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Modern learning management platform
            </Typography>
          </Box>

          <Card sx={styles.card}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {isSignUp ? 'Create your account to get started' : 'Enter your credentials to access your account'}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  sx={{ ...styles.input, mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  sx={{ ...styles.input, mb: isSignUp ? 2 : 0 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {isSignUp && (
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    sx={styles.input}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                {!isSignUp && (
                  <Box sx={{ textAlign: 'right', mt: 1 }}>
                    <Button color="primary" sx={{ textTransform: 'none' }}>
                      Forgot password?
                    </Button>
                  </Box>
                )}

                <Button
                  fullWidth
                  type="submit"
                  disabled={isLoading}
                  sx={{ ...styles.gradientButton, mt: 3 }}
                  startIcon={isLoading && <Loader className="animate-spin" />}
                >
                  {isLoading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : 
                   (isSignUp ? 'Create Account' : 'Sign In')}
                </Button>
              </form>

              {!isSignUp && (
                <>
                  <Divider sx={{ my: 4 }}>or</Divider>
                  <Button fullWidth variant="outlined" sx={styles.googleButton}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Google sign-in failed')}
                      useOneTap
                      theme="filled_blue"
                      size="large"
                      text="signin_with"
                      shape="rectangular"
                    />
                  </Button>
                </>
              )}

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" display="inline">
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                </Typography>
                <Button
                  color="primary"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setFormData({ email: '', password: '', confirmPassword: '' });
                  }}
                >
                  {isSignUp ? 'Sign In' : 'Create account'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default Login;