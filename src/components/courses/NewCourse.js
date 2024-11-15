import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  MenuItem, 
  Switch, 
  FormControlLabel,
  Fade,
  Container,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  alpha
} from '@mui/material'
import { 
  School, 
  ArrowBack, 
  Add, 
  PersonAdd, 
  PersonOff,
  Bookmark,
  Timeline,
  AutoStories,
  CalendarMonth
} from '@mui/icons-material'
import axios from 'axios'

const StyledTextField = React.memo(props => (
  <TextField
    variant="outlined"
    {...props}
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.95)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        },
        '&.Mui-focused': {
          background: '#ffffff',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
        }
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid rgba(145, 158, 171, 0.2)'
      },
      ...(props.sx || {})
    }}
  />
))

const API_URL = process.env.REACT_APP_API_URL || 'https://course-catalog-5tbw.onrender.com'

const NewCourse = () => {
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructor: '',
    semester: '',
    courseCode: '',
    credits: '',
    prerequisites: '',
    isEnrolled: false
  })

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formattedData = {
        ...courseData,
        credits: parseInt(courseData.credits)
      }
      
      await axios.post(
        `${API_URL}/api/courses`,
        formattedData,
        {
          withCredentials: true,
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      )
      navigate('/courses')
    } catch (error) {
      console.error('Error creating course:', error)
    }
  }

  return (
    <Container maxWidth={false} sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6f7ff 0%, #f0f7ff 100%)',
      py: { xs: 2, md: 4 }
    }}>
      <Fade in timeout={800}>
        <Box maxWidth="xl" sx={{ mx: 'auto' }}>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 4 
          }}>
            <Tooltip title="Back to Courses">
              <IconButton
                onClick={() => navigate('/courses')}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    background: '#ffffff',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Main Content Card */}
          <Card sx={{
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 80px -20px rgba(0,0,0,0.1)',
            overflow: 'visible'
          }}>
            {/* Header Banner */}
            <Box sx={{
              p: 4,
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px 24px 0 0',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
              }
            }}>
              <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
                <School sx={{ 
                  color: 'white', 
                  fontSize: 48,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }} />
                <Typography variant="h4" sx={{ 
                  color: 'white',
                  fontWeight: 800,
                  textShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  letterSpacing: '-0.5px'
                }}>
                  Create New Course
                </Typography>
              </Box>
            </Box>

            {/* Form Content */}
            <CardContent sx={{ p: 5 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                  {/* Enrollment Switch */}
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={courseData.isEnrolled}
                          onChange={(e) => setCourseData({ ...courseData, isEnrolled: e.target.checked })}
                          icon={<PersonOff sx={{ transform: 'scale(0.8)' }} />}
                          checkedIcon={<PersonAdd sx={{ transform: 'scale(0.8)' }} />}
                          sx={{
                            '& .MuiSwitch-switchBase': {
                              '&.Mui-checked': {
                                color: '#2196F3',
                                '& + .MuiSwitch-track': {
                                  backgroundColor: alpha('#2196F3', 0.5)
                                }
                              }
                            }
                          }}
                        />
                      }
                      label={
                        <Typography sx={{
                          color: courseData.isEnrolled ? '#2196F3' : '#637381',
                          fontWeight: 600,
                          transition: 'color 0.3s ease'
                        }}>
                          {courseData.isEnrolled ? "Enrolled" : "Not Enrolled"}
                        </Typography>
                      }
                    />
                  </Grid>

                  {/* Course Information Fields */}
                  <Grid item xs={12}>
                    <StyledTextField
                      name="title"
                      label="Course Title"
                      value={courseData.title}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <AutoStories sx={{ mr: 1, color: '#637381' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <StyledTextField
                      name="description"
                      label="Description"
                      value={courseData.description}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      name="instructor"
                      label="Instructor"
                      value={courseData.instructor}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <School sx={{ mr: 1, color: '#637381' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      name="semester"
                      select
                      label="Semester"
                      value={courseData.semester}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <CalendarMonth sx={{ mr: 1, color: '#637381' }} />
                      }}
                    >
                      <MenuItem value="Summer 2024">Summer 2024</MenuItem>
                      <MenuItem value="Fall 2024">Fall 2024</MenuItem>
                      <MenuItem value="Spring 2025">Spring 2025</MenuItem>
                      <MenuItem value="Winter 2025">Winter 2025</MenuItem>
                    </StyledTextField>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      name="courseCode"
                      label="Course Code"
                      value={courseData.courseCode}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <Bookmark sx={{ mr: 1, color: '#637381' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      name="credits"
                      select
                      label="Credits"
                      value={courseData.credits}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <Timeline sx={{ mr: 1, color: '#637381' }} />
                      }}
                    >
                      {[1, 2, 3, 4].map((credit) => (
                        <MenuItem key={credit} value={credit}>
                          {credit} {credit === 1 ? 'Credit' : 'Credits'}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      name="prerequisites"
                      label="Prerequisites"
                      value={courseData.prerequisites}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box sx={{ 
                  mt: 5, 
                  display: 'flex', 
                  gap: 3, 
                  justifyContent: 'flex-end'
                }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/courses')}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      borderColor: alpha('#637381', 0.32),
                      color: '#637381',
                      textTransform: 'none',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#637381',
                        background: alpha('#637381', 0.04),
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 8px 16px rgba(33, 150, 243, 0.24)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 20px rgba(33, 150, 243, 0.32)'
                      }
                    }}
                  >
                    Create Course
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Container>
  )
}

export default NewCourse