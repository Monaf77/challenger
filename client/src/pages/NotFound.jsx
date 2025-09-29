import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
    <Typography variant="h2" gutterBottom>404</Typography>
    <Typography variant="h5" gutterBottom>الصفحة غير موجودة</Typography>
    <Button 
      component={Link} 
      to="/" 
      variant="contained" 
      color="primary"
      style={{ marginTop: '20px' }}
    >
      العودة للصفحة الرئيسية
    </Button>
  </Container>
);

export default NotFound;
