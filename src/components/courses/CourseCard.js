import { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, TextField, IconButton} from '@mui/material';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import { 
  School, 
  CalendarMonth, 
  Timeline, 
  Group, 
  PersonAdd, 
  PersonRemove,
  Edit,
  Delete,
  Visibility,
  MoreVert
} from '@mui/icons-material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material'
const StyledCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.15);
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #2196F3, #21CBF3);
  }
`;

const API_URL = 'https://course-catalog-2nih.onrender.com'

const CourseCard = ({ courseData, onEnrollmentChange, isUserCourse }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedCourse, setEditedCourse] = useState({
    title: courseData.title,
    description: courseData.description,
    instructor: courseData.instructor,
    semester: courseData.semester,
    courseCode: courseData.courseCode,
    credits: courseData.credits,
    prerequisites: courseData.prerequisites
  });

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEnrollment = async () => {
    try {
      const endpoint = courseData.isEnrolled ? 'unenroll' : 'enroll'
      await axios.post(
        `${API_URL}/courses/${courseData._id}/${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      onEnrollmentChange()
    } catch (error) {
      console.error('Error updating enrollment:', error)
    }
  }

  const handleEditChange = (field) => (event) => {
    setEditedCourse({
      ...editedCourse,
      [field]: event.target.value
    });
  };

  const handleEdit = async () => {
    try {
      await axios.put(
        `${API_URL}/courses/${courseData._id}`,
        editedCourse,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      onEnrollmentChange()
      setEditDialogOpen(false)
      handleMenuClose()
    } catch (error) {
      console.error('Error updating course:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_URL}/courses/${courseData._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      onEnrollmentChange()
      handleMenuClose()
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
            {courseData.title}
          </Typography>
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ mb: 2, color: '#637381' }}>
          {courseData.description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <School sx={{ color: '#2196F3', fontSize: 20 }} />
            <Typography variant="body2">
              Instructor: {courseData.instructor}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonth sx={{ color: '#2196F3', fontSize: 20 }} />
            <Typography variant="body2">
              Semester: {courseData.semester}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline sx={{ color: '#2196F3', fontSize: 20 }} />
            <Typography variant="body2">
              Credits: {courseData.credits}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Group sx={{ color: '#2196F3', fontSize: 20 }} />
            <Typography variant="body2">
              Enrolled Students: {courseData.enrolledCount || 0}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            startIcon={<Visibility />}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1AC6E9 90%)'
              }
            }}
          >
            View Details
          </Button>
          {!isUserCourse && (
            <Button
              variant={courseData.isEnrolled ? "outlined" : "contained"}
              onClick={handleEnrollment}
              startIcon={courseData.isEnrolled ? <PersonRemove /> : <PersonAdd />}
              color={courseData.isEnrolled ? "error" : "primary"}
            >
              {courseData.isEnrolled ? "Unenroll" : "Enroll"}
            </Button>
          )}
        </Box>
      </CardContent>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
            {courseData.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1">
              {courseData.description}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Course Details:
              </Typography>
              <Typography>Instructor: {courseData.instructor}</Typography>
              <Typography>Semester: {courseData.semester}</Typography>
              <Typography>Course Code: {courseData.courseCode}</Typography>
              <Typography>Credits: {courseData.credits}</Typography>
              <Typography>Prerequisites: {courseData.prerequisites || 'None'}</Typography>
              <Typography>Enrolled Students: {courseData.enrolledCount || 0}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Title"
              value={editedCourse.title}
              onChange={handleEditChange('title')}
              fullWidth
            />
            <TextField
              label="Description"
              value={editedCourse.description}
              onChange={handleEditChange('description')}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Instructor"
              value={editedCourse.instructor}
              onChange={handleEditChange('instructor')}
              fullWidth
            />
            <TextField
              label="Semester"
              value={editedCourse.semester}
              onChange={handleEditChange('semester')}
              fullWidth
            />
            <TextField
              label="Course Code"
              value={editedCourse.courseCode}
              onChange={handleEditChange('courseCode')}
              fullWidth
            />
            <TextField
              label="Credits"
              value={editedCourse.credits}
              onChange={handleEditChange('credits')}
              type="number"
              fullWidth
            />
            <TextField
              label="Prerequisites"
              value={editedCourse.prerequisites}
              onChange={handleEditChange('prerequisites')}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {isUserCourse && (
          <>
            <MenuItem onClick={() => {
              setEditDialogOpen(true);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              Edit Course
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              Delete Course
            </MenuItem>
          </>
        )}
      </Menu>
    </StyledCard>
  );
};

export default CourseCard;