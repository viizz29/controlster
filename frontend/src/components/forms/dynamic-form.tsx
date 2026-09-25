import { Button, Box } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import * as Yup from "yup";
import DynamicField, {
  type DynamicFieldValue,
  type FieldType,
  type Option,
} from "./dynamic-field";

export type FormField = {
  name: string;
  label?: string;
  type?: FieldType;
  options?: Option[];
  min?: number;
  max?: number;
  step?: number;
};

type Props = {
  fields: Array<string | FormField>;
  validationSchema: { [key: string]: Yup.AnySchema };
  onSubmit: (values: Record<string, DynamicFieldValue>) => void;
  initialValues?: Record<string, DynamicFieldValue>;
  submitLabel?: string;
};

export default function DynamicForm({
  fields,
  validationSchema,
  onSubmit,
  initialValues: providedValues,
  submitLabel,
}: Props) {
  const fieldRefs = useRef<(HTMLInputElement | null)[]>([]);
  const normalizedFields = fields.map((field) =>
    typeof field === "string"
      ? { name: field, label: field, type: "textfield" as const }
      : {
        ...field,
        label: field.label ?? field.name,
        type: field.type ?? "textfield",
      },
  );

  // Create initial values dynamically
  const initialValues = normalizedFields.reduce(
    (acc, field) => {
      acc[field.name] = providedValues?.[field.name] ?? "";
      return acc;
    },
    {} as Record<string, DynamicFieldValue>,
  );

  // Create Yup schema dynamically
  const schema = Yup.object(validationSchema);

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit,
    enableReinitialize: true,
  });

  const focusFirstItem = () => {
    if (fieldRefs.current[0]) {
      fieldRefs.current[0].focus();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      focusFirstItem();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        color: "var(--color-foreground)",
      }}
    >
      {normalizedFields.map((field, index) => {
        const fieldError = formik.touched[field.name]
          ? formik.errors[field.name]
          : undefined;

        return (
          <DynamicField
            key={field.name}
            name={field.name}
            label={field.label ?? field.name}
            type={field.type ?? "textfield"}
            value={formik.values[field.name]}
            onValueChange={(value) => {
              formik.setFieldValue(field.name, value);
            }}
            onBlur={() => {
              formik.setFieldTouched(field.name, true);
            }}
            inputRef={(el: HTMLInputElement | null) => {
              fieldRefs.current[index] = el;
            }}
            error={
              formik.touched[field.name] && Boolean(formik.errors[field.name])
            }
            helperText={typeof fieldError === "string" ? fieldError : undefined}
            options={field.options}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );
      })}

      <Button
        type="submit"
        variant="contained"
        sx={{
          alignSelf: "flex-start",
          borderRadius: "0.75rem",
          px: 2.5,
          py: 1,
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "var(--color-primary)",
            filter: "brightness(0.95)",
            boxShadow: "none",
          },
        }}
      >
        {submitLabel ?? "Submit"}
      </Button>
    </Box>
  );
}
