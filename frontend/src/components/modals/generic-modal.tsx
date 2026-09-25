import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import type React from "react";

type GenericModalProps = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  actions?: { label: string; listener: () => void }[];
  onClose: () => void;
  onCancel?: () => void;
  cancelLabel?: string;
};

export default function GenericModal({
  children,
  title,
  actions,
  onClose,
  open,
  onCancel,
  cancelLabel,
}: GenericModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: { xs: "calc(100% - 2rem)", sm: 520 },
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
        {title}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>{children}</DialogContent>

      <DialogActions
        sx={{ borderTop: "1px solid var(--color-border)", px: 3, py: 2 }}
      >
        {onCancel && (
          <Button
            onClick={onCancel}
            sx={{
              color: "var(--color-muted-foreground)",
              textTransform: "none",
            }}
          >
            {cancelLabel ?? "Cancel"}
          </Button>
        )}
        {actions &&
          actions.map((item, index) => (
            <Button
              onClick={item.listener}
              variant="contained"
              key={`btn-${index}`}
              sx={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-foreground)",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "var(--color-primary)",
                  filter: "brightness(0.95)",
                  boxShadow: "none",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
      </DialogActions>
    </Dialog>
  );
}
