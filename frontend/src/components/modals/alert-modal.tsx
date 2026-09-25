import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';

type AlertType = 'success' | 'error' | 'warning' | 'info';

type AlertModalProps = {
  open: boolean;
  title?: string;
  message: string;
  type?: AlertType;
  onClose: () => void;
};

export default function AlertModal({
  open,
  title = 'Alert',
  message,
  type = 'info',
  onClose,
}: AlertModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Alert severity={type}>{message}</Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}