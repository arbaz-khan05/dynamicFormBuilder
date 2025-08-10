"use client"

import React from "react"
import { Box, Typography, Button, Alert, AlertTitle } from "@mui/material"
import { Refresh, Home } from "@mui/icons-material"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            bgcolor: "background.default",
          }}
        >
          <Box sx={{ maxWidth: 600, textAlign: "center" }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Something went wrong</AlertTitle>
              An unexpected error occurred. Please try refreshing the page or go back to the home page.
            </Alert>

            <Typography variant="h4" gutterBottom>
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {this.state.error?.message || "An unexpected error occurred"}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button variant="contained" startIcon={<Refresh />} onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button variant="outlined" startIcon={<Home />} onClick={() => (window.location.href = "/")}>
                Go Home
              </Button>
            </Box>
          </Box>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
