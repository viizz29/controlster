import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
};

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  cancelLabel = "Cancel",
  confirmLabel = "Yes",
}: ConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          minWidth: { xs: "calc(100% - 2rem)", sm: 440 },
          borderRadius: "1rem",
          border: "1px solid var(--color-border)",
          backgroundColor: "var(--color-background)",
          color: "var(--color-foreground)",
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.18)",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle
        sx={{ borderBottom: "1px solid var(--color-border)", fontWeight: 700 }}
      >
        {title ?? "Confirm"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, color: "var(--color-foreground)" }}>
        {message}
      </DialogContent>

      <DialogActions
        sx={{ borderTop: "1px solid var(--color-border)", px: 3, py: 2 }}
      >
        <Button
          onClick={onCancel}
          sx={{ color: "var(--color-muted-foreground)", textTransform: "none" }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: "#dc2626",
            color: "#fff",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#b91c1c",
              boxShadow: "none",
            },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
