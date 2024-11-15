import { useState, useEffect } from 'react'
import { Box, Grid, TextField, InputAdornment, Typography, CircularProgress } from '@mui/material'
import { Search } from '@mui/icons-material'
import CourseCard from './CourseCard'
import axios from 'axios'

const API_URL = 'https://course-catalog-2nih.onrender.com/api' || process.env.REACT_APP_API_URL

const CourseGrid = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [searchQuery])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${API_URL}/courses`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      const filteredCourses = filterCoursesBySearch(response.data)
      setCourses(filteredCourses)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterCoursesBySearch = (coursesData) => {
    if (!searchQuery) return coursesData
    return coursesData.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      backgroundColor: '#f8faff',
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(to bottom right, #f8faff, #f0f4ff)'
    }}>
      <Box sx={{ 
        mb: 5, 
        display: 'flex', 
        gap: 3, 
        flexDirection: 'column',
        maxWidth: 1200,
        mx: 'auto'
      }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800, 
            color: '#1a237e',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '-0.5px'
          }}
        >
          My Courses
        </Typography>

        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your courses..."
          fullWidth
          sx={{
            maxWidth: 700,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
              },
              '&.Mui-focused': {
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#637381' }}/>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress size={48} sx={{ color: '#1a237e' }}/>
        </Box>
      ) : courses.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 12, 
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <Typography variant="h5" sx={{ color: '#637381', fontWeight: 500 }}>
            You haven't created any courses yet
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4} sx={{ maxWidth: 1200, mx: 'auto' }}>
          {courses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <CourseCard 
                courseData={course} 
                onEnrollmentChange={fetchCourses}
                isUserCourse={true}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default CourseGrid