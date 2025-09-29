import { useEffect, useRef, useState } from 'react';
import { Paper, TextField, IconButton, Box, Typography } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ConsoleContainer = styled(Paper)(({ theme }) => ({
  height: '500px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#1e1e1e',
  color: '#e0e0e0',
  fontFamily: 'monospace',
  overflow: 'hidden',
}));

const ConsoleHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[800],
  borderBottom: `1px solid ${theme.palette.grey[700]}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const ConsoleContent = styled(Box)({
  flex: 1,
  padding: '8px 16px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#2d2d2d',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#555',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#777',
  },
});

const ConsoleInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${theme.palette.grey[700]}`,
  backgroundColor: '#252526',
}));

const ConsoleLine = styled('div')(({ type = 'info' }) => {
  const colors = {
    info: '#e0e0e0',
    error: '#f44336',
    success: '#4caf50',
    warning: '#ff9800',
    command: '#64b5f6',
  };

  return {
    color: colors[type] || colors.info,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: 1.5,
    fontSize: '0.9rem',
  };
});

const ConsoleOutput = ({ serverId, consoleOutput = [], onSendCommand }) => {
  const [command, setCommand] = useState('');
  const consoleEndRef = useRef(null);

  const scrollToBottom = () => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [consoleOutput]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim() && onSendCommand) {
      onSendCommand(command);
      setCommand('');
    }
  };

  const getLineType = (line) => {
    if (line.includes('[ERROR]') || line.includes('Exception') || line.includes('Error')) {
      return 'error';
    } else if (line.includes('[WARN]')) {
      return 'warning';
    } else if (line.includes('Done') || line.includes('success')) {
      return 'success';
    } else if (line.startsWith('> ')) {
      return 'command';
    }
    return 'info';
  };

  return (
    <ConsoleContainer elevation={3}>
      <ConsoleHeader>
        <Typography variant="subtitle2">Server Console</Typography>
        <Typography variant="caption" color="textSecondary">
          {consoleOutput.length} lines
        </Typography>
      </ConsoleHeader>
      
      <ConsoleContent>
        {consoleOutput.length === 0 ? (
          <ConsoleLine>No console output available. Start the server to see logs here.</ConsoleLine>
        ) : (
          consoleOutput.map((line, index) => (
            <ConsoleLine key={index} type={getLineType(line)}>
              {line}
            </ConsoleLine>
          ))
        )}
        <div ref={consoleEndRef} />
      </ConsoleContent>
      
      <form onSubmit={handleSubmit}>
        <ConsoleInput>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Enter command..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            InputProps={{
              style: {
                color: '#e0e0e0',
                backgroundColor: '#333',
                fontFamily: 'monospace',
              },
              endAdornment: (
                <IconButton 
                  type="submit" 
                  color="primary" 
                  size="small"
                  disabled={!command.trim()}
                >
                  <SendIcon />
                </IconButton>
              ),
            }}
          />
        </ConsoleInput>
      </form>
    </ConsoleContainer>
  );
};

export default ConsoleOutput;
