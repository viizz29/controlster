import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <Typography variant="h3">404</Typography>
      <Typography variant="h6">Page Not Found</Typography>

      <Button variant="contained" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </div>
  );
}