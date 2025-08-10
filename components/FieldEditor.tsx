"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
} from "@mui/material"
import { Add, Delete } from "@mui/icons-material"
import type { FormField, FieldType, SelectOption } from "@/types/form"
import ValidationConfig from "./ValidationConfig"
import DerivedFieldConfig from "./DerivedFieldConfig"

interface FieldEditorProps {
  open: boolean
  field: FormField | null
  onClose: () => void
  onSave: (field: FormField) => void
  allFields: FormField[]
}

const FieldEditor: React.FC<FieldEditorProps> = ({ open, field, onClose, onSave, allFields }) => {
  const [editingField, setEditingField] = useState<FormField>({
    id: "",
    type: "text",
    label: "",
    required: false,
    defaultValue: "",
    validationRules: [],
    options: [],
    order: 0,
  })

  useEffect(() => {
    if (field) {
      setEditingField({ ...field })
    } else {
      setEditingField({
        id: "",
        type: "text",
        label: "",
        required: false,
        defaultValue: "",
        validationRules: [],
        options: [],
        order: 0,
      })
    }
  }, [field, open])

  const handleSave = () => {
    onSave(editingField)
    onClose()
  }

  const handleFieldTypeChange = (value: string) => {
    const newType = value as FieldType
    setEditingField({
      ...editingField,
      type: newType,
      options: ["select", "radio"].includes(newType) ? [{ label: "", value: "" }] : [],
    })
  }

  const handleAddOption = () => {
    const newOptions = [...(editingField.options || [])]
    newOptions.push({ label: "", value: "" })
    setEditingField({ ...editingField, options: newOptions })
  }

  const handleUpdateOption = (index: number, option: SelectOption) => {
    const newOptions = [...(editingField.options || [])]
    newOptions[index] = option
    setEditingField({ ...editingField, options: newOptions })
  }

  const handleDeleteOption = (index: number) => {
    const newOptions = [...(editingField.options || [])]
    newOptions.splice(index, 1)
    setEditingField({ ...editingField, options: newOptions })
  }

  const needsOptions = ["select", "radio"].includes(editingField.type)

  const fieldTypes = [
    { value: "text", label: "Text Input" },
    { value: "number", label: "Number Input" },
    { value: "textarea", label: "Text Area" },
    { value: "select", label: "Select Dropdown" },
    { value: "radio", label: "Radio Buttons" },
    { value: "checkbox", label: "Checkbox" },
    { value: "date", label: "Date Picker" },
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div">
          {field ? "Edit Field" : "Add New Field"}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          {/* Basic Configuration */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardHeader
                title={
                  <Typography variant="h6" color="primary">
                    Basic Configuration
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Field Type</InputLabel>
                    <Select
                      value={editingField.type}
                      label="Field Type"
                      onChange={(e) => handleFieldTypeChange(e.target.value)}
                    >
                      {fieldTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Field Label"
                    value={editingField.label}
                    onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                    placeholder="Enter field label"
                  />

                  <TextField
                    fullWidth
                    label="Default Value"
                    value={editingField.defaultValue || ""}
                    onChange={(e) => setEditingField({ ...editingField, defaultValue: e.target.value })}
                    placeholder="Enter default value"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingField.required}
                        onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                      />
                    }
                    label="Required field"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Options Configuration */}
          {needsOptions && (
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography variant="h6" color="primary">
                        Options
                      </Typography>
                      <Chip label={`${editingField.options?.length || 0} options`} size="small" color="secondary" />
                    </Box>
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {editingField.options?.map((option, index) => (
                      <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                        <TextField
                          label="Label"
                          value={option.label}
                          onChange={(e) => handleUpdateOption(index, { ...option, label: e.target.value })}
                          placeholder="Option label"
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Value"
                          value={option.value}
                          onChange={(e) => handleUpdateOption(index, { ...option, value: e.target.value })}
                          placeholder="Option value"
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <IconButton onClick={() => handleDeleteOption(index)} color="error" size="small">
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}
                    <Button startIcon={<Add />} onClick={handleAddOption} variant="outlined" fullWidth sx={{ mt: 1 }}>
                      Add Option
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Validation Configuration */}
        <Box sx={{ mt: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <ValidationConfig
                validationRules={editingField.validationRules}
                onChange={(rules) => setEditingField({ ...editingField, validationRules: rules })}
                fieldType={editingField.type}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Derived Field Configuration */}
        <Box sx={{ mt: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <DerivedFieldConfig
                derivedConfig={editingField.derivedConfig}
                onChange={(config) => setEditingField({ ...editingField, derivedConfig: config })}
                allFields={allFields.filter((f) => f.id !== editingField.id)}
              />
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {field ? "Update Field" : "Add Field"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FieldEditor
