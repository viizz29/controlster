import { usePageTitle } from "@/hooks/use-page-title";
import { Box, Paper } from "@mui/material";


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
