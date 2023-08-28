import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import { QueryClient, QueryClientProvider } from "react-query"
import { SnackbarProvider } from "notistack"

const theme = createTheme()

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <SnackbarProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={new QueryClient()}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </SnackbarProvider>
  </React.StrictMode>
)
