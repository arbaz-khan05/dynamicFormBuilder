import type { FormField, FormData } from "@/types/form"

export const computeDerivedValue = (field: FormField, formData: FormData, allFields: FormField[]): any => {
  if (!field.derivedConfig?.isDerived) {
    return formData[field.id] || field.defaultValue
  }

  const { parentFields, formula } = field.derivedConfig

  // Return default value if formula is empty or invalid
  if (!formula || formula.trim() === "") {
    return field.defaultValue || ""
  }

  try {
    // Create a context with parent field values
    const context: { [key: string]: any } = {}

    parentFields.forEach((parentId) => {
      const parentField = allFields.find((f) => f.id === parentId)
      if (parentField) {
        const parentValue = formData[parentId] || parentField.defaultValue
        // Create safe variable names by removing spaces and special characters
        const safeName = parentField.label.replace(/[^a-zA-Z0-9]/g, "")
        if (safeName) {
          context[safeName] = parentValue
        }
      }
    })

    // Add utility functions and constants
    context.Math = Math
    context.Date = Date
    context.parseInt = Number.parseInt
    context.parseFloat = Number.parseFloat
    context.Number = Number
    context.String = String
    context.Boolean = Boolean

    // Calculate age from date of birth utility
    context.calculateAge = (dob: string | Date) => {
      if (!dob) return 0
      try {
        const today = new Date()
        const birthDate = new Date(dob)
        if (isNaN(birthDate.getTime())) return 0

        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        return Math.max(0, age)
      } catch {
        return 0
      }
    }

    // String concatenation helper
    context.concat = (...args: any[]) => {
      return args.filter((arg) => arg !== null && arg !== undefined).join("")
    }

    // Safe division helper
    context.divide = (a: number, b: number) => {
      if (b === 0) return 0
      return a / b
    }

    // Validate formula before execution
    const sanitizedFormula = sanitizeFormula(formula)
    if (!sanitizedFormula) {
      console.warn("Invalid formula detected:", formula)
      return field.defaultValue || ""
    }

    // Create function with context variables
    const contextKeys = Object.keys(context)
    const contextValues = Object.values(context)

    // Safely evaluate the formula
    const func = new Function(
      ...contextKeys,
      `
      try {
        return ${sanitizedFormula};
      } catch (error) {
        console.error("Formula execution error:", error);
        return "";
      }
    `,
    )

    const result = func(...contextValues)

    // Validate result
    if (result === null || result === undefined) {
      return field.defaultValue || ""
    }

    return result
  } catch (error) {
    console.error("Error computing derived field:", error)
    console.error("Formula:", formula)
    console.error("Context:", parentFields)
    return field.defaultValue || ""
  }
}

// Sanitize formula to prevent dangerous code execution
const sanitizeFormula = (formula: string): string | null => {
  if (!formula || typeof formula !== "string") {
    return null
  }

  // Remove dangerous patterns
  const dangerousPatterns = [
    /eval\s*\(/gi,
    /function\s*\(/gi,
    /constructor/gi,
    /prototype/gi,
    /__proto__/gi,
    /import\s+/gi,
    /require\s*\(/gi,
    /process\./gi,
    /global\./gi,
    /window\./gi,
    /document\./gi,
    /alert\s*\(/gi,
    /confirm\s*\(/gi,
    /prompt\s*\(/gi,
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(formula)) {
      console.warn("Dangerous pattern detected in formula:", formula)
      return null
    }
  }

  // Basic syntax validation
  try {
    // Try to parse as a simple expression
    new Function(`return ${formula}`)
    return formula
  } catch {
    // If direct parsing fails, try some common fixes
    const trimmed = formula.trim()

    // Handle simple concatenation
    if (trimmed.includes("+") && !trimmed.match(/^\d+\s*[+\-*/]/)) {
      return trimmed
    }

    // Handle function calls
    if (trimmed.match(/^[a-zA-Z_][a-zA-Z0-9_]*\s*\(/)) {
      return trimmed
    }

    // Handle simple arithmetic
    if (trimmed.match(/^[\w\s+\-*/$$$$.]+$/)) {
      return trimmed
    }

    console.warn("Could not sanitize formula:", formula)
    return null
  }
}

// Validate derived field configuration
export const validateDerivedFieldConfig = (config: any, allFields: FormField[]): string[] => {
  const errors: string[] = []

  if (!config.isDerived) {
    return errors
  }

  if (!config.formula || config.formula.trim() === "") {
    errors.push("Formula is required for derived fields")
  }

  if (!config.parentFields || config.parentFields.length === 0) {
    errors.push("At least one parent field is required for derived fields")
  }

  // Validate parent fields exist
  config.parentFields?.forEach((parentId: string) => {
    const parentField = allFields.find((f) => f.id === parentId)
    if (!parentField) {
      errors.push(`Parent field with ID ${parentId} not found`)
    }
  })

  // Basic formula validation
  if (config.formula) {
    const sanitized = sanitizeFormula(config.formula)
    if (!sanitized) {
      errors.push("Formula contains invalid or dangerous syntax")
    }
  }

  return errors
}
