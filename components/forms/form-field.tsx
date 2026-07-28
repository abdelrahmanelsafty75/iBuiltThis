import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

interface FormFieldProps {
  label: string;
  name: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value?: string;
  error?: string | string[];
  helperText?: string;
  textarea?: boolean;
}

const errorMessage = (error: string | string[] | undefined): string | null => {
  if (!error) return null;
  if (Array.isArray(error)) return error.filter(Boolean).join(", ") || null;
  return error || null;
};

export const FormField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(
  (
    {
      label,
      name,
      id,
      placeholder,
      required,
      onChange,
      onBlur,
      value,
      error,
      helperText,
      textarea,
    },
    ref
  ) => {
    const message = errorMessage(error);

    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        {textarea ? (
          <Textarea
            id={id}
            name={name}
            placeholder={placeholder}
            required={required}
            onChange={
              onChange as React.ChangeEventHandler<HTMLTextAreaElement>
            }
            onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
            value={value}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            aria-invalid={!!message}
          />
        ) : (
          <Input
            id={id}
            name={name}
            placeholder={placeholder}
            required={required}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
            value={value}
            ref={ref as React.Ref<HTMLInputElement>}
            aria-invalid={!!message}
          />
        )}
        {helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
        {message && <p className="text-sm text-destructive">{message}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";
