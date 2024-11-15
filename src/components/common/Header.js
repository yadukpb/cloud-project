import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Button, Box } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SchoolIcon from '@mui/icons-material/School'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
    handleClose()
  }

  const navigationItems = [
    { icon: <HomeIcon />, label: 'Home', path: '/' },
    { icon: <SchoolIcon />, label: 'Courses', path: '/courses' },
    { icon: <AddCircleIcon />, label: 'Add Course', path: '/courses/add' },
    { icon: <DeleteIcon />, label: 'Delete Course', path: '/courses/delete' }
  ]

  return (
    <AppBar position="fixed" sx={{ 
      background: 'linear-gradient(135deg, #1E1E2E 0%, #2D2D44 100%)',
      borderBottom: '1px solid rgba(147, 51, 234, 0.2)',
      boxShadow: '0 4px 30px rgba(147, 51, 234, 0.1)'
    }}>
      <Toolbar sx={{ padding: '12px 24px' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: 'linear-gradient(135deg, #9333EA 0%, #4F46E5 100%)',
          padding: '8px 16px',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(147, 51, 234, 0.2)',
          cursor: 'pointer'
        }} onClick={() => navigate('/')}>
          <SchoolIcon sx={{ 
            fontSize: 32,
            color: '#ffffff',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }} />
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.5px'
          }}>
            Course Management
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          ml: 4 
        }}>
          {navigationItems.map((item) => (
            <Button 
              key={item.label}
              color="inherit" 
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                fontSize: '0.95rem',
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 1,
                color: '#E2E8F0',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, #9333EA 0%, #4F46E5 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                },
                '&:hover': {
                  background: 'rgba(147, 51, 234, 0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                  '&::before': {
                    opacity: 0.1
                  }
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton 
          onClick={handleMenu} 
          sx={{ 
            ml: 2,
            padding: '4px',
            background: 'linear-gradient(135deg, #9333EA 0%, #4F46E5 100%)',
            '&:hover': { 
              transform: 'scale(1.05)',
              transition: 'all 0.3s ease'
            }
          }}
        >
          <Avatar sx={{ 
            width: 40,
            height: 40,
            bgcolor: 'transparent',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '1.1rem',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>U</Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 5,
            sx: {
              mt: 2,
              minWidth: 200,
              borderRadius: 2,
              background: '#1E1E2E',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              '& .MuiMenuItem-root': {
                py: 1.5,
                px: 3,
                color: '#E2E8F0',
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(147, 51, 234, 0.1)',
                  transform: 'translateX(4px)'
                }
              }
            }
          }}
        >
          <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header