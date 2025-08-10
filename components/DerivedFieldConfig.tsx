"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Button,
  Alert,
  AlertTitle,
  Grid,
} from "@mui/material"
import { Functions, Science, CheckCircle } from "@mui/icons-material"
import type { DerivedFieldConfig as DerivedConfig, FormField } from "@/types/form"
import { validateDerivedFieldConfig } from "@/utils/derivedFields"

interface DerivedFieldConfigProps {
  derivedConfig?: DerivedConfig
  onChange: (config: DerivedConfig) => void
  allFields: FormField[]
}

const DerivedFieldConfig: React.FC<DerivedFieldConfigProps> = ({ derivedConfig, onChange, allFields }) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [testResult, setTestResult] = useState<string>("")

  // Memoize the config to prevent unnecessary re-renders
  const config = useMemo(
    () =>
      derivedConfig || {
        isDerived: false,
        parentFields: [],
        formula: "",
        description: "",
      },
    [derivedConfig],
  )

  // Memoize validation to prevent infinite loops
  const validateConfig = useCallback(() => {
    if (config.isDerived) {
      try {
        const errors = validateDerivedFieldConfig(config, allFields)
        setValidationErrors(errors)
      } catch (error) {
        console.error("Validation error:", error)
        setValidationErrors(["Validation failed"])
      }
    } else {
      setValidationErrors([])
    }
  }, [config])

  // Use effect with proper dependencies
  useEffect(() => {
    validateConfig()
  }, [validateConfig])

  const handleToggle = useCallback(
    (isDerived: boolean) => {
      onChange({
        ...config,
        isDerived,
        parentFields: isDerived ? config.parentFields : [],
        formula: isDerived ? config.formula : "",
      })
    },
    [config, onChange],
  )

  const handleParentFieldsChange = useCallback(
    (fieldId: string) => {
      const currentFields = config.parentFields
      const newFields = currentFields.includes(fieldId)
        ? currentFields.filter((id) => id !== fieldId)
        : [...currentFields, fieldId]

      onChange({
        ...config,
        parentFields: newFields,
      })
    },
    [config, onChange],
  )

  const handleFormulaChange = useCallback(
    (formula: string) => {
      onChange({
        ...config,
        formula,
      })
    },
    [config, onChange],
  )

  const handleDescriptionChange = useCallback(
    (description: string) => {
      onChange({
        ...config,
        description,
      })
    },
    [config, onChange],
  )

  const testFormula = useCallback(() => {
    if (!config.formula) {
      setTestResult("No formula to test")
      return
    }

    try {
      const mockData: { [key: string]: any } = {}
      config.parentFields.forEach((fieldId) => {
        const field = allFields.find((f) => f.id === fieldId)
        if (field) {
          switch (field.type) {
            case "text":
              mockData[fieldId] = "Sample Text"
              break
            case "number":
              mockData[fieldId] = 42
              break
            case "date":
              mockData[fieldId] = "1990-01-01"
              break
            default:
              mockData[fieldId] = "Sample"
          }
        }
      })

      const context: { [key: string]: any } = {}
      config.parentFields.forEach((fieldId) => {
        const field = allFields.find((f) => f.id === fieldId)
        if (field) {
          const safeName = field.label.replace(/[^a-zA-Z0-9]/g, "")
          context[safeName] = mockData[fieldId]
        }
      })

      context.calculateAge = (dob: string) => {
        const today = new Date()
        const birthDate = new Date(dob)
        return today.getFullYear() - birthDate.getFullYear()
      }

      const func = new Function(...Object.keys(context), `return ${config.formula}`)
      const result = func(...Object.values(context))

      setTestResult(`Test result: ${result}`)
    } catch (error) {
      setTestResult(`Test failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }, [config.formula, config.parentFields, allFields])

  const commonFormulas = useMemo(
    () => [
      {
        name: "Full Name",
        formula: "FirstName + ' ' + LastName",
        description: "Concatenate first and last name",
      },
      {
        name: "Age Calculation",
        formula: "calculateAge(DateOfBirth)",
        description: "Calculate age from date of birth",
      },
      {
        name: "Total Price",
        formula: "Price * Quantity",
        description: "Multiply price by quantity",
      },
      {
        name: "Percentage",
        formula: "Math.round((Value / Total) * 100)",
        description: "Calculate percentage with rounding",
      },
    ],
    [],
  )

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Functions sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" color="primary">
          Derived Field Configuration
        </Typography>
      </Box>

      <FormControlLabel
        control={<Switch checked={config.isDerived} onChange={(e) => handleToggle(e.target.checked)} />}
        label="Make this a derived field"
        sx={{ mb: 2 }}
      />

      {config.isDerived && (
        <Card sx={{ border: 2, borderStyle: "dashed", borderColor: "primary.light", bgcolor: "primary.50" }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6" color="primary.dark">
                  Derived Field Settings
                </Typography>
                {validationErrors.length === 0 && config.formula && (
                  <Chip icon={<CheckCircle />} label="Valid" color="success" size="small" />
                )}
              </Box>
            }
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Parent Fields
                </Typography>
                <Grid container spacing={1}>
                  {allFields.map((field) => (
                    <Grid item xs={12} sm={6} key={field.id}>
                      <Card
                        sx={{
                          p: 1,
                          cursor: "pointer",
                          border: 1,
                          borderColor: config.parentFields.includes(field.id) ? "primary.main" : "grey.300",
                          bgcolor: config.parentFields.includes(field.id) ? "primary.50" : "white",
                          "&:hover": {
                            borderColor: "primary.main",
                          },
                        }}
                        onClick={() => handleParentFieldsChange(field.id)}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Typography variant="body2" fontWeight="medium">
                            {field.label}
                          </Typography>
                          <Chip label={field.type} size="small" variant="outlined" />
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {config.parentFields.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                    {config.parentFields.map((fieldId) => {
                      const field = allFields.find((f) => f.id === fieldId)
                      return <Chip key={fieldId} label={field?.label || fieldId} size="small" color="primary" />
                    })}
                  </Box>
                )}
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle2">Formula</Typography>
                  <Button startIcon={<Science />} onClick={testFormula} variant="outlined" size="small">
                    Test
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={config.formula}
                  onChange={(e) => handleFormulaChange(e.target.value)}
                  placeholder="e.g., calculateAge(DateOfBirth) or FirstName + ' ' + LastName"
                  sx={{ fontFamily: "monospace" }}
                />
                {testResult && (
                  <Alert severity={testResult.includes("failed") ? "error" : "success"} sx={{ mt: 1 }}>
                    {testResult}
                  </Alert>
                )}
              </Box>

              <TextField
                fullWidth
                label="Description"
                value={config.description || ""}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Describe how this field is calculated"
              />

              {/* Common Formulas */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Common Formulas
                </Typography>
                <Grid container spacing={1}>
                  {commonFormulas.map((formula, index) => (
                    <Grid item xs={12} key={index}>
                      <Card
                        sx={{
                          p: 1,
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "grey.50",
                          },
                        }}
                        onClick={() => handleFormulaChange(formula.formula)}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Typography variant="body2" fontWeight="medium">
                            {formula.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontFamily: "monospace", bgcolor: "grey.100", px: 1, py: 0.5, borderRadius: 1 }}
                          >
                            {formula.formula}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {formula.description}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Alert severity="error">
                  <AlertTitle>Validation Errors</AlertTitle>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {validationErrors.map((error, index) => (
                      <li key={index}>
                        <Typography variant="body2">{error}</Typography>
                      </li>
                    ))}
                  </Box>
                </Alert>
              )}

              <Alert severity="info">
                <AlertTitle>Available Functions</AlertTitle>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  <li>
                    <Typography variant="body2">
                      <code>calculateAge(dateField)</code> - Calculate age from date of birth
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <code>Math.*</code> - All Math functions (round, floor, ceil, etc.)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Field references: Use field labels without spaces and special characters
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Example: <code>FirstName + ' ' + LastName</code>
                    </Typography>
                  </li>
                </Box>
              </Alert>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default DerivedFieldConfig
