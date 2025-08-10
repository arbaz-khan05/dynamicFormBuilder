"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AppBar, Toolbar, Typography, Container, Box, Button, useTheme, alpha } from "@mui/material"
import {
  Assignment as FormInputIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material"
import { useAppDispatch } from "@/store/hooks"
import { clearForm } from "@/store/formBuilderSlice"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const navigation = [
    { name: "Create", href: "/create", icon: AddIcon },
    { name: "Preview", href: "/preview", icon: VisibilityIcon },
    { name: "My Forms", href: "/myforms", icon: DescriptionIcon },
  ]

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <FormInputIcon sx={{ fontSize: 32, color: "primary.main", mr: 1 }} />
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Dynamic Form Builder
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.name}
                    component={Link}
                    href={item.href}
                    startIcon={<Icon />}
                    variant={isActive ? "contained" : "text"}
                    onClick={() => {
                      if (item.href === "/create") {
                        dispatch(clearForm())
                      }
                    }}
                    sx={{
                      color: isActive ? "white" : "text.primary",
                      bgcolor: isActive ? "primary.main" : "transparent",
                      "&:hover": {
                        bgcolor: isActive ? "primary.dark" : alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                )
              })}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  )
}

export default Layout


// "use client"

// import type React from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { AppBar, Toolbar, Typography, Container, Box, Button, useTheme, alpha } from "@mui/material"
// import {
//   Assignment as FormInputIcon,
//   Add as AddIcon,
//   Visibility as VisibilityIcon,
//   Description as DescriptionIcon,
// } from "@mui/icons-material"

// interface LayoutProps {
//   children: React.ReactNode
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const pathname = usePathname()
//   const theme = useTheme()

//   const navigation = [
//     { name: "Create", href: "/create", icon: AddIcon },
//     { name: "Preview", href: "/preview", icon: VisibilityIcon },
//     { name: "My Forms", href: "/myforms", icon: DescriptionIcon },
//   ]

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
//       {/* Header */}
//       <AppBar
//         position="sticky"
//         sx={{
//           bgcolor: "white",
//           color: "text.primary",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//           backdropFilter: "blur(8px)",
//         }}
//       >
//         <Container maxWidth="xl">
//           <Toolbar sx={{ py: 1 }}>
//             <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
//               <FormInputIcon sx={{ fontSize: 32, color: "primary.main", mr: 1 }} />
//               <Typography
//                 variant="h5"
//                 component="h1"
//                 sx={{
//                   fontWeight: "bold",
//                   background: "linear-gradient(45deg, #1976d2, #9c27b0)",
//                   backgroundClip: "text",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 Dynamic Form Builder
//               </Typography>
//             </Box>

//             <Box sx={{ display: "flex", gap: 1 }}>
//               {navigation.map((item) => {
//                 const Icon = item.icon
//                 const isActive = pathname === item.href
//                 return (
//                   <Button
//                     key={item.name}
//                     component={Link}
//                     href={item.href}
//                     startIcon={<Icon />}
//                     variant={isActive ? "contained" : "text"}
//                     sx={{
//                       color: isActive ? "white" : "text.primary",
//                       bgcolor: isActive ? "primary.main" : "transparent",
//                       "&:hover": {
//                         bgcolor: isActive ? "primary.dark" : alpha(theme.palette.primary.main, 0.1),
//                       },
//                     }}
//                   >
//                     {item.name}
//                   </Button>
//                 )
//               })}
//             </Box>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       {/* Main Content */}
//       <Container maxWidth="xl" sx={{ py: 4 }}>
//         {children}
//       </Container>
//     </Box>
//   )
// }

// export default Layout
