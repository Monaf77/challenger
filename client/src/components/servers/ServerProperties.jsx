import React from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

const ServerProperties = ({ properties = {}, onSave }) => {
  const [editedProps, setEditedProps] = React.useState(properties);

  const handleChange = (key, value) => {
    setEditedProps(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>إعدادات السيرفر</Typography>
      <Box 
        component="form" 
        onSubmit={(e) => {
          e.preventDefault();
          if (onSave) onSave(editedProps);
        }}
      >
        {Object.entries(editedProps).map(([key, value]) => (
          <TextField
            key={key}
            label={key}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        ))}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
        >
          حفظ التغييرات
        </Button>
      </Box>
    </Paper>
  );
};

export default ServerProperties;
