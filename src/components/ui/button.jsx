import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Beige — main action button used across all pages
        primary: "bg-custom-primary text-custom-black hover:bg-custom-primary/80 shadow-sm",
        // Green filled — Checkout (POS), Add Product (Manager Inventory)
        success: "bg-custom-green text-custom-white hover:bg-custom-green/80 shadow-sm",
        // Red filled — Cancel transaction (POS)
        destructive: "bg-custom-red text-custom-white hover:bg-custom-red/80 shadow-sm",
        // White with border — Filter button (POS), View button (Accounts)
        outline: "border border-custom-gray-2 bg-white text-custom-black hover:bg-custom-gray-2/50 shadow-sm",
        // Dashed red border — Clear Filters button
        "outline-destructive": "border border-dashed border-custom-red/60 text-custom-red/60 hover:bg-custom-red/10",
        // Green border — Items Received (Request Details modal)
        "success-outline": "border-2 border-custom-green text-custom-green hover:bg-custom-green/10 font-bold",
        // Red border — Cancel Request (Request Details modal)
        "destructive-outline": "border-2 border-custom-red text-custom-red hover:bg-custom-red/10 font-bold",
        // No background — View All (Dashboard), Add/Remove Discount (POS)
        ghost: "text-custom-gray hover:text-custom-black hover:bg-custom-gray-2/50",
      },
      size: {
        default:
          "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants };

