"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TextField, Alert } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { type Dayjs } from "dayjs"

interface DatePickerFieldProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  error?: boolean
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ value, onChange, readOnly = false, error = false }) => {
  const [hasError, setHasError] = useState(false)
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)

  useEffect(() => {
    try {
      setDateValue(value ? dayjs(value) : null)
      setHasError(false)
    } catch (err) {
      console.error("Date parsing error:", err)
      setHasError(true)
      setDateValue(null)
    }
  }, [value])

  const handleDateChange = (newValue: Dayjs | null) => {
    try {
      if (newValue && newValue.isValid()) {
        const formattedDate = newValue.format("YYYY-MM-DD")
        setDateValue(newValue)
        onChange(formattedDate)
        setHasError(false)
      } else {
        setDateValue(null)
        onChange("")
        setHasError(false)
      }
    } catch (err) {
      console.error("Date change error:", err)
      setHasError(true)
    }
  }

  // Fallback to regular text input if DatePicker fails
  if (hasError) {
    return (
      <>
        <TextField
          fullWidth
          type="date"
          value={value || ""}
          onChange={(e) => !readOnly && onChange(e.target.value)}
          InputProps={{ readOnly }}
          variant="outlined"
          error={error}
          label="Select date"
          InputLabelProps={{ shrink: true }}
        />
        <Alert severity="info" sx={{ mt: 1 }}>
          Using fallback date input due to DatePicker initialization issue.
        </Alert>
      </>
    )
  }

  try {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select date"
          value={dateValue}
          onChange={handleDateChange}
          readOnly={readOnly}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "outlined",
              error: error,
            },
          }}
        />
      </LocalizationProvider>
    )
  } catch (err) {
    console.error("DatePicker render error:", err)
    return (
      <>
        <TextField
          fullWidth
          type="date"
          value={value || ""}
          onChange={(e) => !readOnly && onChange(e.target.value)}
          InputProps={{ readOnly }}
          variant="outlined"
          error={error}
          label="Select date"
          InputLabelProps={{ shrink: true }}
        />
        <Alert severity="warning" sx={{ mt: 1 }}>
          DatePicker failed to load. Using fallback date input.
        </Alert>
      </>
    )
  }
}

export default DatePickerField
