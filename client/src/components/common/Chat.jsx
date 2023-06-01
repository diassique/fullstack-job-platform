import React, { useState, useRef } from 'react';
import { Box, Popover, Button, TextField, Typography, Grid, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const anchorEl = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleSendMessage = async () => {
    // display user's message immediately
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessage('');
    setAiIsTyping(true);

    const response = await fetch('http://localhost:4444', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
  
    const data = await response.json();
    setAiIsTyping(false);
    setMessages(prev => [...prev, data.completion]);
  };  


  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      <Button variant="contained" 
        color="secondary" 
        sx={{ borderRadius: 50 }}
        onClick={handleOpen} 
        ref={anchorEl} 
        startIcon={<AutoAwesomeIcon />}
      >
        AI Chat
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div style={{ padding: '20px', width: '400px' }}>
          <CloseIcon style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer' }} onClick={handleClose} />
          <Typography variant="h6">AI Chat</Typography>
          {messages.map((message, index) => (
            <Box key={index} sx={{ 
              backgroundColor: message.role === 'assistant' ? 'primary.main' : 'transparent', 
              color: message.role === 'assistant' ? 'white' : 'inherit',
              borderRadius: message.role === 'assistant' ? '12px' : '0',
              padding: message.role === 'assistant' ? '10px' : '0',
              marginBottom: '10px'
            }}>
              {message.content}
            </Box>
          ))}
          {aiIsTyping && <div>AI is typing... <CircularProgress size={14} /></div>}
          <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Grid item xs={10}>
              <TextField autoFocus margin="dense" id="message" label="Message" type="text" fullWidth value={message} size="small" onChange={handleMessageChange}
              />
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" color="primary" fullWidth sx={{height: "40px"}} onClick={handleSendMessage}>
                SEND
              </Button>
            </Grid>
          </Grid>
        </div>
      </Popover>
    </div>
  );
};

export default ChatWidget;