"use client"

import type React from "react"
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Alert,
  AlertTitle,
  Paper,
  Grid,
} from "@mui/material"
import { Visibility, CheckCircle, Error } from "@mui/icons-material"
import { useSnackbar } from "notistack"
import Layout from "@/components/Layout"
import FormRenderer from "@/components/FormRenderer"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateFormData, setErrors, clearErrors } from "@/store/formBuilderSlice"
import { validateForm } from "@/utils/validation"

const PreviewPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { currentForm, formData, errors } = useAppSelector((state) => state.formBuilder)
  const { enqueueSnackbar } = useSnackbar()

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updateFormData({ fieldId, value }))
  }

  const handleValidate = () => {
    const validationErrors = validateForm(currentForm.fields, formData)
    dispatch(setErrors(validationErrors))

    if (validationErrors.length === 0) {
      enqueueSnackbar("Form is valid! All fields passed validation.", { variant: "success" })
    } else {
      enqueueSnackbar(`Form has ${validationErrors.length} validation error(s)`, { variant: "error" })
    }
  }

  const handleClearErrors = () => {
    dispatch(clearErrors())
    enqueueSnackbar("Validation errors cleared", { variant: "success" })
  }

  if (currentForm.fields.length === 0) {
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
            <Visibility sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              Form Preview
            </Typography>
            <Alert severity="info" sx={{ mt: 3, bgcolor: "rgba(255,255,255,0.1)", color: "white" }}>
              <AlertTitle sx={{ color: "white" }}>No Form to Preview</AlertTitle>
              No form to preview. Please create a form first by adding some fields.
            </Alert>
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
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <Visibility sx={{ fontSize: 40, mr: 1 }} />
            <Typography variant="h3" component="h1" fontWeight="bold">
              Form Preview
            </Typography>
          </Box>
          {currentForm.name && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
              <Typography variant="h5">{currentForm.name}</Typography>
              <Chip
                label={`${currentForm.fields.length} fields`}
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
              />
            </Box>
          )}
        </Paper>

        <Grid container spacing={4}>
          {/* Form Preview */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ border: 2, borderColor: "primary.light" }}>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h6">Live Form Preview</Typography>
                    {errors.length > 0 && (
                      <Chip icon={<Error />} label={`${errors.length} errors`} color="error" variant="outlined" />
                    )}
                  </Box>
                }
              />
              <CardContent>
                <FormRenderer
                  fields={currentForm.fields}
                  formData={formData}
                  errors={errors}
                  onChange={handleFieldChange}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, position: "sticky", top: 24 }}>
              {/* Validation Controls */}
              <Card>
                <CardHeader title={<Typography variant="h6">Form Validation</Typography>} />
                <CardContent>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<CheckCircle />}
                      onClick={handleValidate}
                      color="primary"
                      fullWidth
                    >
                      Validate Form
                    </Button>

                    {errors.length > 0 && (
                      <Button variant="outlined" onClick={handleClearErrors} fullWidth>
                        Clear Errors
                      </Button>
                    )}

                    {errors.length > 0 && (
                      <Alert severity="error">
                        <AlertTitle>Validation Errors</AlertTitle>
                        Form has {errors.length} validation error(s). Please fix them before submitting.
                      </Alert>
                    )}

                    {errors.length === 0 && Object.keys(formData).length > 0 && (
                      <Alert severity="success">
                        <AlertTitle>Form Valid</AlertTitle>
                        Form validation passed! All fields are valid.
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Form Data Debug */}
              <Card>
                <CardHeader title={<Typography variant="h6">Form Data (Debug)</Typography>} />
                <CardContent>
                  <Box
                    component="pre"
                    sx={{
                      fontSize: "0.75rem",
                      bgcolor: "grey.50",
                      p: 2,
                      borderRadius: 1,
                      overflow: "auto",
                      maxHeight: 300,
                      fontFamily: "monospace",
                    }}
                  >
                    {JSON.stringify(formData, null, 2)}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  )
}

export default PreviewPage
