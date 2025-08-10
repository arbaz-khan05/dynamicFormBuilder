"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Typography, Button, TextField, Grid, Card, CardContent, CardHeader, Chip, Paper } from "@mui/material"
import { Add, Save, AutoAwesome, Edit } from "@mui/icons-material"
import { useSnackbar } from "notistack"
import Layout from "@/components/Layout"
import FieldList from "@/components/FieldList"
import FieldEditor from "@/components/FieldEditor"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setFormName, addField, updateField, deleteField, saveForm, loadSavedForms } from "@/store/formBuilderSlice"
import type { FormField } from "@/types/form"

const CreatePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { currentForm } = useAppSelector((state) => state.formBuilder)
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [isFieldEditorOpen, setIsFieldEditorOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    dispatch(loadSavedForms())
  }, [dispatch])

  const handleAddField = () => {
    setEditingField(null)
    setIsFieldEditorOpen(true)
  }

  const handleEditField = (field: FormField) => {
    setEditingField(field)
    setIsFieldEditorOpen(true)
  }

  const handleSaveField = (field: FormField) => {
    if (editingField) {
      dispatch(updateField(field))
      enqueueSnackbar("Field updated successfully", { variant: "success" })
    } else {
      dispatch(addField(field))
      enqueueSnackbar("Field added successfully", { variant: "success" })
    }
  }

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId))
    enqueueSnackbar("Field deleted successfully", { variant: "success" })
  }

  const handleSaveForm = () => {
    if (!currentForm.name.trim()) {
      enqueueSnackbar("Please enter a form name", { variant: "error" })
      return
    }
    if (currentForm.fields.length === 0) {
      enqueueSnackbar("Please add at least one field", { variant: "error" })
      return
    }

    dispatch(saveForm())

    if (currentForm.id) {
      enqueueSnackbar("Form updated successfully", { variant: "success" })
    } else {
      enqueueSnackbar("Form created successfully! Starting new form.", { variant: "success" })
    }
  }

  const isEditingExistingForm = !!currentForm.id

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
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
            {isEditingExistingForm ? (
              <Edit sx={{ fontSize: 40, mr: 1 }} />
            ) : (
              <AutoAwesome sx={{ fontSize: 40, mr: 1 }} />
            )}
            <Typography variant="h3" component="h1" fontWeight="bold">
              {isEditingExistingForm ? "Edit Form" : "Form Builder"}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ maxWidth: 600, mx: "auto", opacity: 0.9 }}>
            {isEditingExistingForm
              ? "Update your form with validation rules, derived fields, and professional styling"
              : "Create dynamic forms with validation rules, derived fields, and professional styling"}
          </Typography>
          {isEditingExistingForm && (
            <Chip
              label="Editing existing form"
              color="secondary"
              sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
            />
          )}
        </Paper>

        <Grid container spacing={4}>
          {/* Main Form Builder */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Form Configuration */}
              <Card sx={{ border: 2, borderStyle: "dashed", borderColor: "primary.light" }}>
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6">Form Configuration</Typography>
                      {currentForm.name && (
                        <Chip label={`${currentForm.fields.length} fields`} color="secondary" size="small" />
                      )}
                    </Box>
                  }
                />
                <CardContent>
                  <TextField
                    fullWidth
                    label="Form Name"
                    value={currentForm.name}
                    onChange={(e) => dispatch(setFormName(e.target.value))}
                    placeholder="Enter your form name"
                    variant="outlined"
                    sx={{ fontSize: "1.1rem" }}
                  />
                </CardContent>
              </Card>

              {/* Fields List */}
              <Card>
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography variant="h6">Form Fields</Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddField}
                        sx={{ bgcolor: "primary.main" }}
                      >
                        Add Field
                      </Button>
                    </Box>
                  }
                />
                <CardContent>
                  <FieldList
                    fields={currentForm.fields}
                    onEditField={handleEditField}
                    onDeleteField={handleDeleteField}
                  />
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, position: "sticky", top: 24 }}>
              {/* Form Actions */}
              <Card>
                <CardHeader title={<Typography variant="h6">Form Actions</Typography>} />
                <CardContent>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSaveForm}
                      disabled={!currentForm.name.trim() || currentForm.fields.length === 0}
                      color="success"
                      size="large"
                      fullWidth
                    >
                      {isEditingExistingForm ? "Update Form" : "Save Form"}
                    </Button>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        color: "text.secondary",
                        fontSize: "0.875rem",
                      }}
                    >
                      <Typography variant="body2">✓ Forms are saved to your browser's local storage</Typography>
                      <Typography variant="body2">✓ Add validation rules and derived fields</Typography>
                      <Typography variant="body2">✓ Preview your form before saving</Typography>
                      {isEditingExistingForm && (
                        <Typography variant="body2" color="primary.main" fontWeight="medium">
                          ✓ Changes will update the existing form
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Form Stats */}
              {currentForm.fields.length > 0 && (
                <Card>
                  <CardHeader title={<Typography variant="h6">Form Statistics</Typography>} />
                  <CardContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography>Total Fields:</Typography>
                        <Chip label={currentForm.fields.length} color="primary" size="small" />
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography>Required Fields:</Typography>
                        <Chip label={currentForm.fields.filter((f) => f.required).length} color="error" size="small" />
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography>Derived Fields:</Typography>
                        <Chip
                          label={currentForm.fields.filter((f) => f.derivedConfig?.isDerived).length}
                          color="secondary"
                          size="small"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Grid>
        </Grid>

        <FieldEditor
          open={isFieldEditorOpen}
          field={editingField}
          onClose={() => setIsFieldEditorOpen(false)}
          onSave={handleSaveField}
          allFields={currentForm.fields}
        />
      </Box>
    </Layout>
  )
}

export default CreatePage
