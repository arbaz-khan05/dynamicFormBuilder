"use client"
import type React from "react"
import { Provider } from "react-redux"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { SnackbarProvider } from "notistack"
import { store } from "@/store/store"
import ErrorBoundary from "@/components/ErrorBoundary"
import "@/styles/globals.css" // Import globals.css at the top of the file

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <ErrorBoundary>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline />
                <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }} preventDuplicate>
                  {children}
                </SnackbarProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </Provider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

// export const metadata = {
//       generator: 'v0.dev'
//     };
