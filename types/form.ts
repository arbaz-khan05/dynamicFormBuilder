export type FieldType = "text" | "number" | "textarea" | "select" | "radio" | "checkbox" | "date"

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "email" | "password"
  value?: number
  message: string
}

export interface SelectOption {
  label: string
  value: string
}

export interface DerivedFieldConfig {
  isDerived: boolean
  parentFields: string[]
  formula: string // JavaScript expression
  description?: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  required: boolean
  defaultValue?: any
  validationRules: ValidationRule[]
  options?: SelectOption[] // For select, radio fields
  derivedConfig?: DerivedFieldConfig
  order: number
}

export interface FormSchema {
  id: string
  name: string
  createdAt: string
  updatedAt?: string // Add optional updated timestamp
  fields: FormField[]
}

export interface FormData {
  [fieldId: string]: any
}

export interface FieldError {
  fieldId: string
  message: string
}
