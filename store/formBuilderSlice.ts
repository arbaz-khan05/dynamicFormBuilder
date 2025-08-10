import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { FormField, FormSchema, FormData, FieldError } from "@/types/form"
import { v4 as uuidv4 } from "uuid"

interface FormBuilderState {
  currentForm: {
    id?: string
    name: string
    fields: FormField[]
  }
  formData: FormData
  errors: FieldError[]
  savedForms: FormSchema[]
}

const initialState: FormBuilderState = {
  currentForm: {
    name: "",
    fields: [],
  },
  formData: {},
  errors: [],
  savedForms: [],
}

const formBuilderSlice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload
    },
    addField: (state, action: PayloadAction<Omit<FormField, "id" | "order">>) => {
      const newField: FormField = {
        ...action.payload,
        id: uuidv4(),
        order: state.currentForm.fields.length,
      }
      state.currentForm.fields.push(newField)
    },
    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.currentForm.fields.findIndex((f) => f.id === action.payload.id)
      if (index !== -1) {
        state.currentForm.fields[index] = action.payload
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter((f) => f.id !== action.payload)
      state.currentForm.fields.forEach((field, index) => {
        field.order = index
      })
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      state.currentForm.fields = action.payload.map((field, index) => ({
        ...field,
        order: index,
      }))
    },
    saveForm: (state) => {
      try {
        const savedForms = JSON.parse(localStorage.getItem("formSchemas") || "[]")

        if (state.currentForm.id) {
          // Update existing form
          const existingIndex = savedForms.findIndex((f: FormSchema) => f.id === state.currentForm.id)
          if (existingIndex !== -1) {
            const updatedForm: FormSchema = {
              ...savedForms[existingIndex],
              name: state.currentForm.name,
              fields: [...state.currentForm.fields],
              updatedAt: new Date().toISOString(),
            }
            savedForms[existingIndex] = updatedForm

            const stateIndex = state.savedForms.findIndex((f) => f.id === state.currentForm.id)
            if (stateIndex !== -1) {
              state.savedForms[stateIndex] = updatedForm
            }
          }
        } else {
          // Create new form
          const formSchema: FormSchema = {
            id: uuidv4(),
            name: state.currentForm.name,
            createdAt: new Date().toISOString(),
            fields: [...state.currentForm.fields],
          }
          savedForms.push(formSchema)
          state.savedForms.push(formSchema)

          // Reset form after creating new one
          state.currentForm = {
            name: "",
            fields: [],
          }
          state.formData = {}
          state.errors = []
        }

        localStorage.setItem("formSchemas", JSON.stringify(savedForms))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    },
    loadSavedForms: (state) => {
      try {
        const savedForms = JSON.parse(localStorage.getItem("formSchemas") || "[]")
        state.savedForms = savedForms
      } catch (error) {
        console.error("Error loading from localStorage:", error)
        state.savedForms = []
      }
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find((f) => f.id === action.payload)
      if (form) {
        state.currentForm = {
          id: form.id,
          name: form.name,
          fields: [...form.fields],
        }
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      try {
        state.savedForms = state.savedForms.filter((f) => f.id !== action.payload)
        const savedForms = state.savedForms
        localStorage.setItem("formSchemas", JSON.stringify(savedForms))

        if (state.currentForm.id === action.payload) {
          state.currentForm = {
            name: "",
            fields: [],
          }
          state.formData = {}
          state.errors = []
        }
      } catch (error) {
        console.error("Error deleting form:", error)
      }
    },
    clearForm: (state) => {
      state.currentForm = {
        name: "",
        fields: [],
      }
      state.formData = {}
      state.errors = []
    },
    updateFormData: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      state.formData[action.payload.fieldId] = action.payload.value
    },
    setErrors: (state, action: PayloadAction<FieldError[]>) => {
      state.errors = [...action.payload]
    },
    clearErrors: (state) => {
      state.errors = []
    },
  },
})

export const {
  setFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadSavedForms,
  loadForm,
  deleteForm,
  clearForm,
  updateFormData,
  setErrors,
  clearErrors,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer
