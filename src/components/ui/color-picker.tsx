'use client'

import { useMemo, useState, forwardRef } from 'react'
import { HexColorPicker } from 'react-colorful'
import { cn } from '@/lib/utils'
import { useForwardedRef } from '@/lib/use-forwarded-ref'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

type ColorPickerProps = {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  name?: string
} & Omit<ButtonProps, 'value' | 'onChange' | 'onBlur' | 'name'>

const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  (
    {
      value,
      onChange,
      onBlur,
      name,
      disabled,
      className,
      size,
      variant = 'outline',
      ...props
    },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef)
    const [open, setOpen] = useState(false)

    const parsedValue = useMemo(() => value || '#FFFFFF', [value])

    const handleColorChange = (val: string) => {
      onChange?.(val)
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            {...props}
            type="button"
            name={name}
            size={size}
            variant={variant}
            disabled={disabled}
            onClick={() => setOpen((prev) => !prev)}
            className={cn('h-10 w-10 rounded-md border cursor-pointer', className)}
            style={{ backgroundColor: parsedValue }}
          >
            <span className="sr-only">Open color picker</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 space-y-2">
          <HexColorPicker color={parsedValue} onChange={handleColorChange} />
          <Input
            ref={ref}
            maxLength={7}
            value={parsedValue}
            onChange={(e) => handleColorChange(e.currentTarget.value)}
            onBlur={onBlur}
          />
        </PopoverContent>
      </Popover>
    )
  }
)

ColorPicker.displayName = 'ColorPicker'

export { ColorPicker }
