import React from 'react';
import { Divider, Typography } from '@mui/material';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onEdit, refresh }) => {
  if (tasks.length === 0) {
    return <Typography align="center" color="textSecondary" sx={{ my: 4 }}>No tasks yet.</Typography>;
  }

  return (
    <>
      {tasks.map((task, idx) => (
        <React.Fragment key={task._id}>
          <TaskItem task={task} onEdit={onEdit} refresh={refresh} />
          {idx < tasks.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </>
  );
};

export default TaskList;
