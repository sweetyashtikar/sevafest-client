import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Size mapping for MUI Dialog
  const sizeMap = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    full: 'xl' // MUI doesn't have full, so use xl
  };

  // For full width, we'll set maxWidth to false and use custom width
  const isFull = size === 'full';
  
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={isFull ? false : sizeMap[size]}
      fullWidth={!isFull}
      PaperProps={{
        sx: isFull ? {
          width: '95vw',
          maxWidth: '95vw',
          height: '90vh',
          maxHeight: '90vh'
        } : {}
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box component="span" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
          {title}
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;