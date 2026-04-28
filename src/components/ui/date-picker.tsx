"use client";

import { forwardRef } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input as OriginalInput } from "@/components/ui/input";

const Input = forwardRef<HTMLInputElement, React.ComponentProps<typeof OriginalInput>>((props, ref) => (
  <OriginalInput ref={ref} {...props} />
));
Input.displayName = "Input";

interface DatePickerInputProps {
  value?: Date;
  onChange: (date?: Date) => void;
}

export function DatePickerInput({ value, onChange }: DatePickerInputProps) {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Input
          readOnly
          value={value ? format(value, "dd MMM yyyy", { locale: ru }) : ""}
          placeholder={t("common.choose_date")}
          className="cursor-pointer"
        />
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4">
        <DayPicker
          mode="single"
          selected={value}
          onSelect={onChange}
          locale={ru}
          className="text-sm"
          classNames={{
            caption: "mb-2 flex items-center justify-between text-sm font-semibold",
            table: "w-full border-collapse",
            head_row: "flex",
            head_cell: "h-10 w-10 text-center font-medium text-gray-500",
            row: "flex",
            cell: "h-10 w-10 p-1 text-center",
            day: "cursor-pointer rounded-full transition-colors hover:bg-primary hover:text-primary-foreground",
            selected: "bg-primary text-primary-foreground",
            today: "rounded-full border border-primary",
            outside: "cursor-not-allowed text-gray-300",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
