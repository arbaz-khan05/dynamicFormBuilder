"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, CircularProgress } from "@mui/material"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Add a small delay to ensure proper initialization
    const timer = setTimeout(() => {
      router.push("/create")
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  )
}
