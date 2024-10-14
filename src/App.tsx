import { useState } from 'react'
import './App.css'
import {createBrowserRouter} from "react-router-dom";
import {Box, Grid} from "@mui/joy";

function App() {
  const [count, setCount] = useState(0)

  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello world!</div>,
    },
  ]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{position: 'absolute'}}
      style={{minHeight: '100vh', left: 0, top: 0, width: '100vw'}}
    >
      <Grid xs={10}>
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        </Box>
      </Grid>
    </Grid>
  )
}

export default App
