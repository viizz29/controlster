import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Switch,
  Slider,
  FormControl,
  InputLabel,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import * as Yup from "yup";

export type FieldType =
  | "textfield"
  | "string"
  | "number"
  | "date"
  | "select"
  | "range"
  | "boolean";

export type Option = {
  label: string;
  value: string | number;
};

export type DynamicFieldValue = string | number | boolean | number[];

type Props<T = DynamicFieldValue> = {
  name: string;
  label: string;
  type: FieldType;
  value: T;
  onValueChange: (value: T) => void;
  onBlur?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
  error?: boolean;
  helperText?: React.ReactNode;

  // Optional props
  options?: Option[]; // for select
  min?: number; // for range
  max?: number; // for range
  step?: number; // for range
  validationSchema?: Yup.Schema<T>; // optional validation
};

const DynamicField = <T,>({
  name,
  label,
  type,
  value,
  onValueChange,
  onBlur,
  inputRef,
  error: externalError = false,
  helperText: externalHelperText,
  options = [],
  min = 0,
  max = 100,
  step = 1,
  validationSchema,
}: Props<T>) => {
  const [error, setError] = useState<string | null>(null);
  const hasError = externalError || !!error;
  const displayedHelperText = error ?? externalHelperText;
  const themedFieldSx = {
    "& .MuiInputLabel-root": {
      color: "var(--color-muted-foreground)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "var(--color-foreground)",
    },
    "& .MuiOutlinedInput-root": {
      color: "var(--color-foreground)",
      backgroundColor: "color-mix(in srgb, var(--color-muted) 45%, transparent)",
      borderRadius: "0.875rem",
      "& fieldset": {
        borderColor: "var(--color-border)",
      },
      "&:hover fieldset": {
        borderColor: "var(--color-muted-foreground)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--color-primary)",
      },
    },
    "& .MuiFormHelperText-root": {
      color: "var(--color-muted-foreground)",
      marginLeft: 0,
    },
  } as const;

  const handleChange = async (newValue: T) => {
    if (validationSchema) {
      try {
        await validationSchema.validate(newValue);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Invalid value");
        return;
      }
    }

    onValueChange(newValue);
  };

  switch (type) {
    case "textfield":
    case "string":
      return (
        <TextField
          name={name}
          inputRef={inputRef}
          fullWidth
          label={label}
          value={value || ""}
          onChange={(e) => handleChange(e.target.value as T)}
          onBlur={() => onBlur?.()}
          error={hasError}
          helperText={displayedHelperText}
          sx={themedFieldSx}
        />
      );

    case "number":
      return (
        <TextField
          name={name}
          inputRef={inputRef}
          fullWidth
          type="number"
          label={label}
          value={value ?? ""}
          onChange={(e) => handleChange(Number(e.target.value) as T)}
          onBlur={() => onBlur?.()}
          error={hasError}
          helperText={displayedHelperText}
          sx={themedFieldSx}
        />
      );

    case "date":
      return (
        <TextField
          name={name}
          inputRef={inputRef}
          fullWidth
          type="date"
          label={label}
          slotProps={{ inputLabel: { shrink: true } }}
          value={value || ""}
          onChange={(e) => handleChange(e.target.value as T)}
          onBlur={() => onBlur?.()}
          error={hasError}
          helperText={displayedHelperText}
          sx={themedFieldSx}
        />
      );

    case "select":
      return (
        <FormControl fullWidth error={hasError} sx={themedFieldSx}>
          <InputLabel>{label}</InputLabel>
          <Select
            name={name}
            value={value ?? ""}
            label={label}
            onChange={(e) => handleChange(e.target.value as T)}
            onBlur={() => onBlur?.()}
            MenuProps={{
              PaperProps: {
                sx: {
                  mt: 1,
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-background)",
                  color: "var(--color-foreground)",
                  backgroundImage: "none",
                },
              },
            }}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{displayedHelperText}</FormHelperText>
        </FormControl>
      );

    case "range":
      return (
        <FormControl
          fullWidth
          error={hasError}
          sx={{
            "& .MuiFormHelperText-root": {
              color: "var(--color-muted-foreground)",
              marginLeft: 0,
            },
          }}
        >
          <Slider
            name={name}
            value={Number(value) || 0}
            min={min}
            max={max}
            step={step}
            onChange={(_, val) => handleChange(val as T)}
            valueLabelDisplay="auto"
            sx={{
              color: "var(--color-primary)",
              "& .MuiSlider-valueLabel": {
                backgroundColor: "var(--color-foreground)",
                color: "var(--color-background)",
              },
            }}
          />
          <FormHelperText>{displayedHelperText}</FormHelperText>
        </FormControl>
      );

    case "boolean":
      return (
        <FormControl
          error={hasError}
          sx={{
            "& .MuiFormHelperText-root": {
              color: "var(--color-muted-foreground)",
              marginLeft: 0,
            },
          }}
        >
          <FormControlLabel
            control={
              <Switch
                name={name}
                checked={Boolean(value)}
                onChange={(e) => handleChange(e.target.checked as T)}
                onBlur={() => onBlur?.()}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "var(--color-primary)",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "var(--color-primary)",
                  },
                }}
              />
            }
            label={label}
            sx={{ color: "var(--color-foreground)" }}
          />
          <FormHelperText>{displayedHelperText}</FormHelperText>
        </FormControl>
      );

    default:
      return null;
  }
};

export default DynamicField;
