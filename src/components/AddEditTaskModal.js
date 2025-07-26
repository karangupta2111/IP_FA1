import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, Button,
  DialogActions, Stack, MenuItem, IconButton, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import dayjs from 'dayjs';
import axios from 'axios';
import { toast } from 'react-toastify';

const defaultTask = {
  title: '', description: '', status: 'pending', priority: 'medium',
  deadline: dayjs().add(2, 'hour').toISOString(),
  recurring: { pattern: 'none', nextDue: null }, subtasks: []
};

const priorities = ['low', 'medium', 'high'];
const statuses = ['pending', 'in-progress', 'completed'];
const recurringPatterns = ['none', 'daily', 'weekly', 'custom'];

const AddEditTaskModal = ({ open, onClose, editingTask, onSaved }) => {
  const [task, setTask] = useState(defaultTask);

  useEffect(() => {
    if (editingTask) {
      setTask({
        ...editingTask,
        deadline: editingTask.deadline
          ? dayjs(editingTask.deadline).toISOString()
          : dayjs().toISOString(),
        recurring: editingTask.recurring || { pattern: 'none', nextDue: null },
        subtasks: editingTask.subtasks || []
      });
    } else {
      setTask(defaultTask);
    }
  }, [editingTask, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubtaskChange = (idx, value) => {
    const updated = task.subtasks.map((s, i) =>
      i === idx ? { ...s, title: value } : s
    );
    setTask((prev) => ({ ...prev, subtasks: updated }));
  };

  const handleAddSubtask = () => {
    setTask((prev) => ({
      ...prev, subtasks: [...prev.subtasks, { title: '', status: 'pending' }]
    }));
  };

  const handleRemoveSubtask = (idx) => {
    setTask((prev) => ({
      ...prev, subtasks: prev.subtasks.filter((_, i) => i !== idx)
    }));
  };

  const saveTask = async () => {
    try {
      if (!task.title.trim()) throw new Error('Task title is required');
      for (const sub of task.subtasks) {
        if (!sub.title.trim())
          throw new Error('All subtasks must have a title or be removed');
      }
      const payload = {
        ...task,
        deadline: new Date(task.deadline),
        subtasks: task.subtasks.filter((s) => s.title.trim() !== '')
      };
      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask._id}`, payload);
      } else {
        await axios.post('/api/tasks', payload);
      }
      toast.success('Task saved!');
      onSaved();
    } catch (e) {
      toast.error(e.message || 'Failed to save task.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            name="title"
            label="Title"
            value={task.title}
            onChange={handleChange}
            fullWidth autoFocus required
          />
          <TextField
            name="description"
            label="Description"
            value={task.description}
            onChange={handleChange}
            fullWidth multiline rows={2}
          />
          <Stack direction="row" spacing={2}>
            <TextField select name="status" label="Status"
              value={task.status} onChange={handleChange} fullWidth>
              {statuses.map((st) => (
                <MenuItem key={st} value={st}>{st}</MenuItem>
              ))}
            </TextField>
            <TextField select name="priority" label="Priority"
              value={task.priority} onChange={handleChange} fullWidth>
              {priorities.map((pr) => (
                <MenuItem key={pr} value={pr}>{pr}</MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            name="deadline" label="Deadline" type="datetime-local"
            value={dayjs(task.deadline).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => setTask((prev) => ({
              ...prev, deadline: dayjs(e.target.value).toISOString()
            }))}
            sx={{ flex: 1 }} InputLabelProps={{ shrink: true }} fullWidth
          />
          <TextField select name="recurring" label="Recurring"
            value={task.recurring.pattern}
            onChange={(e) =>
              setTask((prev) => ({
                ...prev,
                recurring: { ...prev.recurring, pattern: e.target.value }
              }))
            } fullWidth>
            {recurringPatterns.map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>
          <Typography variant="subtitle1">Subtasks</Typography>
          <Stack spacing={1}>
            {task.subtasks.map((sub, i) => (
              <Stack direction="row" alignItems="center" spacing={1} key={i}>
                <TextField
                  value={sub.title}
                  placeholder={`Subtask #${i + 1}`}
                  onChange={(e) => handleSubtaskChange(i, e.target.value)}
                  fullWidth size="small"
                />
                <IconButton color="error" onClick={() => handleRemoveSubtask(i)} size="large" aria-label="Remove subtask">
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Stack>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddSubtask}
              variant="outlined"
              size="small"
            >Add Subtask</Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={saveTask} variant="contained">
          {editingTask ? 'Save Changes' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditTaskModal;
