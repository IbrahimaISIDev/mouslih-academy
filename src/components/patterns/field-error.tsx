import { AlertCircle } from "lucide-react";

export interface FieldErrorProps {
  message?: string;
}

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-error">
      <AlertCircle className="size-[15px] shrink-0" strokeWidth={1.7} />
      {message}
    </p>
  );
}

export { FieldError };
