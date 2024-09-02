import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  image: {
    maxWidth: '80%',
    maxHeight: '80%',
  },
});

interface DocumentOverlayProps {
  imageUrl: string;
  onClose: () => void;
}

const DocumentOverlay: React.FC<DocumentOverlayProps> = ({ imageUrl, onClose }) => {
  const classes = useStyles();

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className={classes.overlay} onClick={onClose}>
      <img src={imageUrl} alt="Document" className={classes.image} />
    </div>
  );
};

export default DocumentOverlay;
