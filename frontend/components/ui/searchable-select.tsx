"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SearchableSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: string[]
  placeholder?: string
  emptyText?: string
  searchPlaceholder?: string
  allowCustom?: boolean
  className?: string
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  emptyText = "No options found.",
  searchPlaceholder = "Search...",
  allowCustom = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    return options.filter((option) =>
      option.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

  // Check if current value is a custom value (not in predefined options)
  const isCustomValue = value && value !== "all" && !options.includes(value)

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === value) {
      onValueChange("all") // Deselect if same value is clicked
    } else {
      onValueChange(selectedValue)
    }
    setOpen(false)
    setSearchValue("")
  }

  const handleCustomAdd = () => {
    if (searchValue && !options.includes(searchValue) && allowCustom) {
      onValueChange(searchValue)
      setOpen(false)
      setSearchValue("")
    }
  }

  const clearSelection = () => {
    onValueChange("all")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          <span className="truncate">
            {value === "all" || !value ? placeholder : value}
          </span>
          <div className="flex items-center gap-1">
            {value && value !== "all" && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  clearSelection()
                }}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {allowCustom && searchValue ? (
                <div className="p-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    {emptyText}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCustomAdd}
                    className="w-full"
                  >
                    Add "{searchValue}"
                  </Button>
                </div>
              ) : (
                emptyText
              )}
            </CommandEmpty>
            <CommandGroup>
              {/* All option */}
              <CommandItem onSelect={() => handleSelect("all")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                All {placeholder.toLowerCase()}
              </CommandItem>
              
              {/* Predefined options */}
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
              
              {/* Custom value if it exists and not in options */}
              {isCustomValue && (
                <CommandItem onSelect={() => handleSelect(value)}>
                  <Check className="mr-2 h-4 w-4 opacity-100" />
                  {value}
                  <span className="ml-auto text-xs text-muted-foreground">
                    (Custom)
                  </span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
