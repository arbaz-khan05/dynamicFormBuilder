"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
} from "@mui/material"
import { Description, Visibility, Edit, Add, CalendarToday, Functions, Delete } from "@mui/icons-material"
import { useSnackbar } from "notistack"
import Layout from "@/components/Layout"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loadSavedForms, loadForm, clearForm, deleteForm } from "@/store/formBuilderSlice"
import { useRouter } from "next/navigation"

const MyFormsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { savedForms } = useAppSelector((state) => state.formBuilder)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formToDelete, setFormToDelete] = useState<string | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    dispatch(loadSavedForms())
  }, [dispatch])

  const handlePreviewForm = (formId: string) => {
    dispatch(loadForm(formId))
    router.push("/preview")
  }

  const handleEditForm = (formId: string) => {
    dispatch(loadForm(formId))
    router.push("/create")
  }

  const handleCreateNew = () => {
    dispatch(clearForm())
    router.push("/create")
  }

  const handleDeleteClick = (formId: string) => {
    setFormToDelete(formId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (formToDelete) {
      const form = savedForms.find((f) => f.id === formToDelete)
      dispatch(deleteForm(formToDelete))
      enqueueSnackbar(`Form "${form?.name}" deleted successfully`, { variant: "success" })
      setDeleteDialogOpen(false)
      setFormToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setFormToDelete(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (savedForms.length === 0) {
    return (
      <Layout>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Paper
            sx={{
              p: 6,
              maxWidth: 600,
              mx: "auto",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Description sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              My Forms
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              No saved forms found. Create your first form to get started building dynamic forms.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleCreateNew}
              sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
            >
              Create Your First Form
            </Button>
          </Paper>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Description sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold">
                  My Forms
                </Typography>
                <Chip
                  label={`${savedForms.length} forms`}
                  sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateNew}
              size="large"
              sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
            >
              Create New Form
            </Button>
          </Box>
        </Paper>

        {/* Forms Grid */}
        <Grid container spacing={3}>
          {savedForms.map((form) => (
            <Grid item xs={12} md={6} lg={4} key={form.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "primary.main" }}>
                        {form.name}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        <Chip label={`${form.fields.length} fields`} size="small" color="primary" variant="outlined" />
                        {form.fields.some((f) => f.derivedConfig?.isDerived) && (
                          <Chip
                            icon={<Functions />}
                            label="Derived"
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  }
                  sx={{ pb: 1 }}
                />

                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                        <Typography variant="body2">Created: {formatDate(form.createdAt)}</Typography>
                      </Box>
                      {form.updatedAt && (
                        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                          <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                          <Typography variant="body2">Updated: {formatDate(form.updatedAt)}</Typography>
                        </Box>
                      )}
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.primary" gutterBottom>
                        Fields:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {form.fields.slice(0, 3).map((field) => (
                          <Chip key={field.id} label={field.label} size="small" variant="outlined" />
                        ))}
                        {form.fields.length > 3 && (
                          <Chip label={`+${form.fields.length - 3} more`} size="small" variant="outlined" />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handlePreviewForm(form.id)}
                        sx={{ flex: 1 }}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditForm(form.id)}
                        sx={{ flex: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(form.id)}
                        sx={{ minWidth: "auto", px: 1 }}
                      >
                        <Delete />
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Delete Form</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{savedForms.find((f) => f.id === formToDelete)?.name}"? This action
              cannot be undone and will permanently remove the form and all its data.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete Form
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  )
}

export default MyFormsPage
