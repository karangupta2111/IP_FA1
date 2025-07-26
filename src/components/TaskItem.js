import React from 'react';
import { Card, CardContent, Typography, Chip, Stack, IconButton, Tooltip, Fade } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ScheduleIcon from '@mui/icons-material/Schedule';
import axios from 'axios';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const statusColors = { pending: 'warning', 'in-progress': 'info', completed: 'success' };
const priorityColors = { low: 'default', medium: 'primary', high: 'error' };

const TaskItem = ({ task, onEdit, refresh }) => {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`/api/tasks/${task._id}`);
      toast.success('Task deleted!');
      refresh();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Card
        elevation={8}
        sx={{
          borderRadius: 4,
          mb: 3,
          background: 'rgba(44,44,64,0.75)',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.22)',
          color: '#fff'
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <RocketLaunchIcon sx={{ color: '#ff72d7' }} />
            <Typography fontWeight={600}>{task.title}</Typography>
            <Chip label={`Priority: ${task.priority}`} color={priorityColors[task.priority]} size="small" />
            <Chip size="small"
              label={`Deadline: ${dayjs(task.deadline).format('DD MMM, HH:mm')}`}
              color="secondary" icon={<ScheduleIcon />} />
            {task.recurring?.pattern !== 'none' && (
              <Chip size="small" label={`Recurring: ${task.recurring?.pattern || ''}`} />
            )}
            <Tooltip title="Edit">
              <IconButton onClick={() => onEdit(task)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          {task.status && (
            <Chip
              label={task.status}
              color={statusColors[task.status]}
              size="small"
              sx={{ mr: 1, mt: 1 }}
            />
          )}
          {task.subtasks && task.subtasks.length > 0 && (
            <Stack direction="column" spacing={0.5} mt={1}>
              <span style={{ fontWeight: 500 }}>Subtasks:</span>
              {task.subtasks.map((subtask, i) => (
                <div key={i} style={{ fontSize: 13, marginLeft: 8 }}>
                  • {subtask.title} ({subtask.status})
                </div>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

export default TaskItem;
