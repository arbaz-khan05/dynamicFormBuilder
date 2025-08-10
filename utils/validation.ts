import type { FormField, FieldError, FormData } from "@/types/form"

export const validateField = (field: FormField, value: any): string | null => {
  for (const rule of field.validationRules) {
    switch (rule.type) {
      case "required":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return rule.message
        }
        break
      case "minLength":
        if (typeof value === "string" && value.length < (rule.value || 0)) {
          return rule.message
        }
        break
      case "maxLength":
        if (typeof value === "string" && value.length > (rule.value || 0)) {
          return rule.message
        }
        break
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (typeof value === "string" && !emailRegex.test(value)) {
          return rule.message
        }
        break
      case "password":
        if (typeof value === "string") {
          if (value.length < 8 || !/\d/.test(value)) {
            return rule.message
          }
        }
        break
    }
  }
  return null
}

export const validateForm = (fields: FormField[], formData: FormData): FieldError[] => {
  const errors: FieldError[] = []

  fields.forEach((field) => {
    const value = formData[field.id]
    const error = validateField(field, value)
    if (error) {
      errors.push({ fieldId: field.id, message: error })
    }
  })

  return errors
}
