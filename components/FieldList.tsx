"use client"

import type React from "react"
import { useMemo } from "react"
import { Box, Card, CardContent, Typography, IconButton, Chip, Alert, AlertTitle } from "@mui/material"
import { Edit, Delete, DragIndicator, Functions } from "@mui/icons-material"
import type { FormField } from "@/types/form"

interface FieldListProps {
  fields: FormField[]
  onEditField: (field: FormField) => void
  onDeleteField: (fieldId: string) => void
}

const FieldList: React.FC<FieldListProps> = ({ fields, onEditField, onDeleteField }) => {
  const sortedFields = useMemo(() => {
    return [...fields].sort((a, b) => a.order - b.order)
  }, [fields])

  if (fields.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>No Fields Added</AlertTitle>
        No fields added yet. Click "Add Field" to get started building your form.
      </Alert>
    )
  }

  const getFieldTypeColor = (type: string) => {
    const colors = {
      text: "primary",
      number: "success",
      textarea: "secondary",
      select: "warning",
      radio: "error",
      checkbox: "info",
      date: "default",
    }
    return colors[type as keyof typeof colors] || "default"
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {sortedFields.map((field, index) => (
        <Card
          key={field.id}
          sx={{
            transition: "all 0.2s",
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
                <DragIndicator sx={{ color: "grey.400", mt: 0.5, cursor: "move" }} />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                    <Typography variant="h6" sx={{ fontWeight: "semibold", color: "text.primary" }}>
                      {field.label}
                    </Typography>
                    <Chip
                      label={field.type}
                      color={getFieldTypeColor(field.type) as any}
                      size="small"
                      variant="outlined"
                    />
                    {field.required && <Chip label="Required" color="error" size="small" variant="outlined" />}
                    {field.derivedConfig?.isDerived && (
                      <Chip icon={<Functions />} label="Derived" color="secondary" size="small" variant="outlined" />
                    )}
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {field.derivedConfig?.isDerived ? (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Formula:</strong>
                        <Box
                          component="code"
                          sx={{
                            ml: 1,
                            px: 1,
                            py: 0.5,
                            bgcolor: "grey.100",
                            borderRadius: 1,
                            fontSize: "0.75rem",
                          }}
                        >
                          {field.derivedConfig.formula}
                        </Box>
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Default:</strong> {field.defaultValue || "None"}
                      </Typography>
                    )}

                    {field.validationRules.length > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Validation:</strong> {field.validationRules.map((r) => r.type).join(", ")}
                      </Typography>
                    )}

                    {field.options && field.options.length > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Options:</strong> {field.options.map((o) => o.label).join(", ")}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  opacity: { xs: 1, md: 0 },
                  ".MuiCard-root:hover &": { opacity: 1 },
                  transition: "opacity 0.2s",
                }}
              >
                <IconButton size="small" onClick={() => onEditField(field)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton size="small" onClick={() => onDeleteField(field.id)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default FieldList
