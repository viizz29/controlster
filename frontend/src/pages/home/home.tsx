import { APP_NAME } from "@/config";
import { usePageTitle } from "@/hooks/use-page-title";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect } from "react";


export default function Home() {

  usePageTitle("Home");
   
  return (
    <Box p={3}>
   

      <Paper>
        Page Content goes here
      </Paper>

    </Box>
  );
}
