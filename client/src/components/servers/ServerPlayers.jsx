import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Avatar, ListItemAvatar, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const ServerPlayers = ({ players = [] }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        اللاعبون المتصلون ({players.length})
      </Typography>
      <List>
        {players.length > 0 ? (
          players.map((player, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={player.name || `لاعب ${index + 1}`} 
                secondary={`الحالة: ${player.status || 'غير معروف'}`} 
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
            لا يوجد لاعبون متصلون حالياً
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default ServerPlayers;
