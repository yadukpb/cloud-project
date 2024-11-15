import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme/theme'
import MainLayout from './layouts/MainLayout'
import CourseGrid from './components/courses/CourseGrid'
import NewCourse from './components/courses/NewCourse'
import Login from './pages/Login'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<CourseGrid />} />
            <Route path="/courses" element={<CourseGrid />} />
            <Route path="/courses/add" element={<NewCourse />} />
            <Route path="/profile" element={<div>Profile</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App