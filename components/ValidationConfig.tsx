"use client"

import React from "react"
import { Box, Typography, TextField, Chip, IconButton, Card, CardContent, CardHeader } from "@mui/material"
import { Delete } from "@mui/icons-material"
import type { ValidationRule, FieldType } from "@/types/form"

interface ValidationConfigProps {
  validationRules: ValidationRule[]
  onChange: (rules: ValidationRule[]) => void
  fieldType: FieldType
}

const ValidationConfig: React.FC<ValidationConfigProps> = ({ validationRules, onChange, fieldType }) => {
  const availableRules = React.useMemo(() => {
    const rules = ["required"]

    if (["text", "textarea"].includes(fieldType)) {
      rules.push("minLength", "maxLength", "email", "password")
    }

    return rules
  }, [fieldType])

  const hasRule = (type: string) => validationRules.some((rule) => rule.type === type)

  const addRule = (type: string) => {
    const defaultMessages = {
      required: "This field is required",
      minLength: "Minimum length not met",
      maxLength: "Maximum length exceeded",
      email: "Please enter a valid email address",
      password: "Password must be at least 8 characters and contain a number",
    }

    const newRule: ValidationRule = {
      type: type as any,
      message: defaultMessages[type as keyof typeof defaultMessages],
      value: ["minLength", "maxLength"].includes(type) ? 1 : undefined,
    }

    onChange([...validationRules, newRule])
  }

  const removeRule = (type: string) => {
    onChange(validationRules.filter((rule) => rule.type !== type))
  }

  const updateRule = (type: string, updates: Partial<ValidationRule>) => {
    onChange(validationRules.map((rule) => (rule.type === type ? { ...rule, ...updates } : rule)))
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Validation Rules
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {availableRules.map((ruleType) => (
          <Chip
            key={ruleType}
            label={ruleType}
            onClick={() => (hasRule(ruleType) ? removeRule(ruleType) : addRule(ruleType))}
            color={hasRule(ruleType) ? "primary" : "default"}
            variant={hasRule(ruleType) ? "filled" : "outlined"}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Box>

      {validationRules.map((rule) => (
        <Card key={rule.type} sx={{ mb: 2, borderLeft: 4, borderLeftColor: "primary.main" }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ textTransform: "capitalize" }}>
                  {rule.type} Validation
                </Typography>
                <IconButton size="small" onClick={() => removeRule(rule.type)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            }
            sx={{ pb: 1 }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Error Message"
                value={rule.message}
                onChange={(e) => updateRule(rule.type, { message: e.target.value })}
                placeholder="Enter error message"
                size="small"
              />

              {["minLength", "maxLength"].includes(rule.type) && (
                <TextField
                  type="number"
                  label="Value"
                  value={rule.value || ""}
                  onChange={(e) => updateRule(rule.type, { value: Number.parseInt(e.target.value) || 0 })}
                  placeholder="Enter numeric value"
                  size="small"
                  sx={{ maxWidth: 200 }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default ValidationConfig
