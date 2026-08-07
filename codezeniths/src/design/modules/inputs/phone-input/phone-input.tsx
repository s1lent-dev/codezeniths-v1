import * as React from "react"
import { Input, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@codezeniths/components"
import { cn } from "@codezeniths/design/cn"

export interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  countryCode?: string;
  onCountryCodeChange?: (value: string) => void;
  inputClassName?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, countryCode = "+1", onCountryCodeChange, inputClassName, ...props }, ref) => {
    return (
      <div className={cn("flex w-full items-end gap-4", className)}>
        <Select value={countryCode} onValueChange={onCountryCodeChange}>
          <SelectTrigger className="w-24 sm:w-28 h-14 border-0 border-b hover:bg-transparent dark:hover:bg-transparent border-muted-light/25 dark:border-muted-dark/25 focus-visible:border-none dark:focus-visible:border-none rounded-none bg-transparent px-0! shadow-none cursor-pointer text-base font-normal flex items-end pb-4">
            <SelectValue placeholder="Code" />
          </SelectTrigger>
          <SelectContent className="border border-muted-light/50 dark:border-muted-dark/50">
            <SelectGroup>
              <SelectItem value="+1" className="cursor-pointer">US +1</SelectItem>
              <SelectItem value="+44" className="cursor-pointer">UK +44</SelectItem>
              <SelectItem value="+91" className="cursor-pointer">IN +91</SelectItem>
              <SelectItem value="+61" className="cursor-pointer">AU +61</SelectItem>
              <SelectItem value="+81" className="cursor-pointer">JP +81</SelectItem>
              <SelectItem value="+49" className="cursor-pointer">DE +49</SelectItem>
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
