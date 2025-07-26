import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Typography, Fab, AppBar, Toolbar, IconButton, Switch } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import TaskList from './components/TaskList';
import AddEditTaskModal from './components/AddEditTaskModal';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { theme, lightTheme } from './theme';
import 'react-toastify/dist/ReactToastify.css';
import Particles from "react-tsparticles";

function App() {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      setTasks(res.data);
    } catch {
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaved = () => {
    fetchTasks();
    setModalOpen(false);
  };

  return (
    <ThemeProvider theme={darkMode ? theme : lightTheme}>
      <Particles
        id="tsparticles"
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          particles: {
            number: { value: 50, density: { enable: true, value_area: 900 } },
            color: { value: "#ff72d7" },
            shape: { type: "circle" },
            opacity: { value: 0.3 },
            size: { value: 3 },
            move: { enable: true, speed: 2 }
          },
          interactivity: { events: { onhover: { enable: true, mode: "repulse" } } }
        }}
        style={{
          position: "fixed",
          zIndex: 0,
          minHeight: "100vh",
          width: "100vw",
          left: 0,
          top: 0,
        }}
      />

      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(28,28,40,0.85)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(12px)',
          borderRadius: 0,
          zIndex: 1201,
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <StarIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'Poppins, sans-serif' }}>
            Super ToDo
          </Typography>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            color="secondary"
          />
        </Toolbar>
      </AppBar>

      <div
        style={{
          minHeight: '100vh',
          padding: 0,
          margin: 0,
          background: 'linear-gradient(135deg,#20003a 0%,#4928df 60%,#ff72d7 100%) fixed',
          position: 'relative'
        }}
      >
        <Toolbar />
        <Container
          maxWidth="md"
          sx={{
            py: 6,
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(30,30,40,0.6)',
            borderRadius: 6,
            boxShadow: 8,
            mt: 6,
            mb: 6
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Advanced ToDo List
          </Typography>
          <Fab
            color="secondary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 40,
              right: 48,
              zIndex: 2001,
              boxShadow: '0 3px 20px #ff72d7',
              transition: 'transform 0.1s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
            onClick={handleAdd}
          >
            <AddIcon sx={{ fontSize: 32 }} />
          </Fab>
          <TaskList tasks={tasks} onEdit={handleEdit} refresh={fetchTasks} />
          <AddEditTaskModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSaved={handleSaved}
            editingTask={editingTask}
          />
          <ToastContainer position="top-right" />
        </Container>
      </div>
    </ThemeProvider>
  );
}
export default App;
