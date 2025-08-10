"use client"

import type React from "react"
import { useEffect, useMemo, useCallback, useState } from "react"
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormLabel,
  FormGroup,
  Typography,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Chip,
} from "@mui/material"
import { Functions } from "@mui/icons-material"
import type { FormField, FormData, FieldError } from "@/types/form"
import { computeDerivedValue } from "@/utils/derivedFields"
import DatePickerField from "./DatePickerField"

interface FormRendererProps {
  fields: FormField[]
  formData: FormData
  errors: FieldError[]
  onChange: (fieldId: string, value: any) => void
}

const FormRenderer: React.FC<FormRendererProps> = ({ fields, formData, errors, onChange }) => {
  const [renderKey, setRenderKey] = useState(0)

  const sortedFields = useMemo(() => {
    return [...fields].sort((a, b) => a.order - b.order)
  }, [fields])

  const computeDerivedFields = useCallback(() => {
    const updates: { [fieldId: string]: any } = {}

    fields.forEach((field) => {
      if (field.derivedConfig?.isDerived) {
        try {
          const newValue = computeDerivedValue(field, formData, fields)
          const currentValue = formData[field.id]

          // Only update if the value actually changed
          if (newValue !== currentValue && JSON.stringify(newValue) !== JSON.stringify(currentValue)) {
            updates[field.id] = newValue
          }
        } catch (error) {
          console.error(`Error computing derived field ${field.label}:`, error)
          if (formData[field.id] === undefined) {
            updates[field.id] = field.defaultValue || ""
          }
        }
      }
    })

    // Only call onChange if there are actual updates
    if (Object.keys(updates).length > 0) {
      Object.entries(updates).forEach(([fieldId, value]) => {
        onChange(fieldId, value)
      })
    }
  }, [fields, formData, onChange])

  useEffect(() => {
    // Debounce the computation to prevent excessive calls
    const timeoutId = setTimeout(() => {
      computeDerivedFields()
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [computeDerivedFields])

  // Force re-render if there are issues
  useEffect(() => {
    const handleError = () => {
      setRenderKey((prev) => prev + 1)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  const getFieldError = (fieldId: string) => {
    return errors.find((error) => error.fieldId === fieldId)?.message
  }

  const renderField = (field: FormField) => {
    let value = formData[field.id] ?? field.defaultValue ?? ""

    if (field.derivedConfig?.isDerived) {
      try {
        value = computeDerivedValue(field, formData, fields)
      } catch (error) {
        console.error(`Error rendering derived field ${field.label}:`, error)
        value = field.defaultValue || ""
      }
    }

    const error = getFieldError(field.id)
    const isReadOnly = field.derivedConfig?.isDerived

    const fieldWrapper = (children: React.ReactNode) => (
      <Card
        key={`${field.id}-${renderKey}`}
        sx={{
          mb: 3,
          transition: "all 0.2s",
          bgcolor: isReadOnly ? "primary.50" : "white",
          border: error ? 2 : 1,
          borderColor: error ? "error.main" : isReadOnly ? "primary.light" : "grey.300",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography
                variant="subtitle1"
                component="label"
                sx={{
                  fontWeight: "medium",
                  color: field.required ? "error.main" : "text.primary",
                  "&::after": field.required ? { content: '" *"', color: "error.main" } : {},
                }}
              >
                {field.label}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {field.required && <Chip label="Required" color="error" size="small" variant="outlined" />}
                {isReadOnly && (
                  <Chip
                    icon={<Functions />}
                    label="Auto-calculated"
                    color="secondary"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>

            {children}

            {error && (
              <Alert severity="error">
                <AlertTitle>Validation Error</AlertTitle>
                {error}
              </Alert>
            )}

            {isReadOnly && !error && (
              <Alert severity="info">
                <Functions sx={{ mr: 1 }} />
                This field is automatically calculated based on other form values.
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    )

    try {
      switch (field.type) {
        case "text":
          return fieldWrapper(
            <TextField
              fullWidth
              value={String(value || "")}
              onChange={(e) => !isReadOnly && onChange(field.id, e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
              variant="outlined"
              error={!!error}
            />,
          )

        case "number":
          return fieldWrapper(
            <TextField
              fullWidth
              type="number"
              value={value || ""}
              onChange={(e) => !isReadOnly && onChange(field.id, Number.parseFloat(e.target.value) || 0)}
              InputProps={{ readOnly: isReadOnly }}
              variant="outlined"
              error={!!error}
            />,
          )

        case "textarea":
          return fieldWrapper(
            <TextField
              fullWidth
              multiline
              rows={4}
              value={String(value || "")}
              onChange={(e) => !isReadOnly && onChange(field.id, e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
              variant="outlined"
              error={!!error}
            />,
          )

        case "select":
          return fieldWrapper(
            <FormControl fullWidth disabled={isReadOnly} error={!!error}>
              <InputLabel>Select an option</InputLabel>
              <Select
                value={String(value || "")}
                onChange={(e) => !isReadOnly && onChange(field.id, e.target.value)}
                label="Select an option"
              >
                {field.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>,
          )

        case "radio":
          return fieldWrapper(
            <FormControl component="fieldset" disabled={isReadOnly} error={!!error}>
              <FormLabel component="legend">{field.label}</FormLabel>
              <RadioGroup
                value={String(value || "")}
                onChange={(e) => !isReadOnly && onChange(field.id, e.target.value)}
              >
                {field.options?.map((option) => (
                  <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
                ))}
              </RadioGroup>
            </FormControl>,
          )

        case "checkbox":
          return fieldWrapper(
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(value)}
                    onChange={(e) => !isReadOnly && onChange(field.id, e.target.checked)}
                    disabled={isReadOnly}
                  />
                }
                label={field.label}
              />
            </FormGroup>,
          )

        case "date":
          return fieldWrapper(
            <DatePickerField
              value={value}
              onChange={(newValue) => !isReadOnly && onChange(field.id, newValue)}
              readOnly={isReadOnly}
              error={!!error}
            />,
          )

        default:
          return fieldWrapper(
            <Alert severity="warning">
              <AlertTitle>Unsupported Field Type</AlertTitle>
              Field type "{field.type}" is not supported.
            </Alert>,
          )
      }
    } catch (error) {
      console.error(`Error rendering field ${field.label}:`, error)
      return fieldWrapper(
        <Alert severity="error">
          <AlertTitle>Field Render Error</AlertTitle>
          Unable to render this field. Please check the field configuration.
        </Alert>,
      )
    }
  }

  if (fields.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>No Fields to Display</AlertTitle>
        No fields to display. Add some fields in the form builder to see the preview.
      </Alert>
    )
  }

  return <Box key={renderKey}>{sortedFields.map((field) => renderField(field))}</Box>
}

export default FormRenderer
