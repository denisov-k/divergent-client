"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { forwardRef } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Оборачиваем Input через forwardRef
import { Input as OriginalInput } from "@/components/ui/input";

const Input = forwardRef<HTMLInputElement, React.ComponentProps<typeof OriginalInput>>(
  (props, ref) => <OriginalInput ref={ref} {...props} />
);
Input.displayName = "Input";

interface DatePickerInputProps {
  value?: Date;
  onChange: (date?: Date) => void;
}

export function DatePickerInput({ value, onChange }: DatePickerInputProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Input
          readOnly
          value={value ? format(value, "dd MMM yyyy", { locale: ru }) : ""}
          placeholder="Выберите дату"
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
            caption: "flex justify-between items-center mb-2 text-sm font-semibold",
            table: "w-full border-collapse",
            head_row: "flex",
            head_cell: "w-10 h-10 text-center font-medium text-gray-500",
            //root: `p-5`,
            row: "flex",
            cell: "w-10 h-10 text-center p-1",
            day: "rounded-full cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors",
            selected: "bg-primary text-primary-foreground",
            today: "border border-primary rounded-full",
            outside: "text-gray-300 cursor-not-allowed",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
