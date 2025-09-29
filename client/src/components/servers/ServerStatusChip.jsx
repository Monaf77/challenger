import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const statusColors = {
  running: {
    bgcolor: 'success.light',
    color: 'success.contrastText',
    label: 'Online',
  },
  stopped: {
    bgcolor: 'error.light',
    color: 'error.contrastText',
    label: 'Offline',
  },
  starting: {
    bgcolor: 'warning.light',
    color: 'warning.contrastText',
    label: 'Starting...',
  },
  stopping: {
    bgcolor: 'warning.light',
    color: 'warning.contrastText',
    label: 'Stopping...',
  },
  error: {
    bgcolor: 'error.dark',
    color: 'error.contrastText',
    label: 'Error',
  },
};

const StyledChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: statusColors[status]?.bgcolor || theme.palette.grey[500],
  color: statusColors[status]?.color || theme.palette.common.white,
  fontWeight: 500,
  minWidth: 90,
  '& .MuiChip-label': {
    padding: '0 8px',
  },
}));

const ServerStatusChip = ({ status = 'stopped' }) => {
  const statusConfig = statusColors[status] || statusColors.stopped;
  
  return (
    <StyledChip
      label={statusConfig.label}
      size="small"
      status={status}
    />
  );
};

export default ServerStatusChip;
