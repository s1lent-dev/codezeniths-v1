import * as React from "react"
import { Input, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@codezeniths/components"
import { cn } from "@codezeniths/design/cn"
import { COUNTRY_OPTIONS, DEFAULT_COUNTRY_CODE } from "@/utils/phone.utils"

export interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  countryCode?: string;
  onCountryCodeChange?: (value: string) => void;
  inputClassName?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, countryCode = DEFAULT_COUNTRY_CODE, onCountryCodeChange, inputClassName, ...props }, ref) => {
    return (
      <div className={cn("flex w-full items-end gap-4", className)}>
        <Select value={countryCode} onValueChange={onCountryCodeChange}>
          <SelectTrigger className="w-24 sm:w-28 h-14 border-0 border-b hover:bg-transparent dark:hover:bg-transparent border-muted-light/25 dark:border-muted-dark/25 focus-visible:border-none dark:focus-visible:border-none rounded-none bg-transparent px-0! shadow-none cursor-pointer text-base font-normal flex items-end pb-4">
            <SelectValue placeholder="Code" />
          </SelectTrigger>
          <SelectContent className="border border-muted-light/50 dark:border-muted-dark/50 max-h-60">
            <SelectGroup>
              {COUNTRY_OPTIONS.map((country) => (
                <SelectItem key={`${country.code}-${country.value}`} value={country.value} className="cursor-pointer">
                  {country.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Input
            type="tel"
            ref={ref}
            className={cn("border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-lg w-full", inputClassName)}
            {...props}
          />
        </div>
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"

