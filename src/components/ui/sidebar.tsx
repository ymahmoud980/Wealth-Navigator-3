"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */
interface SidebarContextProps {
  isCollapsed: boolean
  isMobile: boolean
  collapsible: "icon" | "button"
  onCollapse: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

/* -------------------------------------------------------------------------- */
/*                                  Provider                                  */
/* -------------------------------------------------------------------------- */
interface SidebarProviderProps {
  children: React.ReactNode
  collapsed?: boolean
  collapsible?: "icon" | "button"
  onCollapse?: (collapsed: boolean) => void
}

function SidebarProvider({
  children,
  collapsed = false,
  collapsible = "icon",
  onCollapse,
}: SidebarProviderProps) {
  const isMobile = useIsMobile()

  // Always collapsed on mobile
  const isCollapsed = isMobile ? true : collapsed

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, isMobile, collapsible, onCollapse: onCollapse! }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Wrappers                                  */
/* -------------------------------------------------------------------------- */
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    Partial<SidebarProviderProps> & {
      variant?: "inset" | "default"
    }
>(
  (
    {
      className,
      children,
      variant = "default",
      collapsed,
      collapsible,
      onCollapse,
      ...props
    },
    ref
  ) => {
    return (
      <SidebarProvider
        collapsed={collapsed}
        onCollapse={onCollapse}
        collapsible={collapsible}
      >
        <div
          ref={ref}
          className={cn(
            "group flex h-full flex-col gap-4 border-r bg-background",
            {
              "data-[collapsible=icon]:w-14 data-[collapsible=button]:w-64":
                !collapsed,
              "data-[collapsible=button]:w-14": collapsed,
            },
            variant === "inset" && "border-0",
            className
          )}
          data-collapsible={collapsible}
          {...props}
        >
          {children}
        </div>
      </SidebarProvider>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed, isMobile } = useSidebar()
  if (!isCollapsed || isMobile) return null
  return <div ref={ref} className={cn("h-12", className)} {...props} />
})
SidebarInset.displayName = "SidebarInset"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-12 items-center border-b", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { onCollapse, collapsible } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full flex-col overflow-y-auto",
        collapsible === "button" && "group-data-[collapsible=button]:pt-12",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed, onCollapse, collapsible, isMobile } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "relative mt-auto flex items-center justify-end gap-2 border-t p-2",
        className
      )}
    >
      {collapsible === "button" && !isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapse(!isCollapsed)}
          className="absolute left-1/2 top-0 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background text-foreground transition-all group-data-[collapsed=false]:rotate-180 hover:bg-secondary"
        >
          <ChevronRight />
        </Button>
      ) : null}
      {props.children}
    </div>
  )
})
SidebarFooter.displayName = "SidebarFooter"

/* -------------------------------------------------------------------------- */
/*                                Sidebar Menu                               */
/* -------------------------------------------------------------------------- */
const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-1 p-2", className)} {...props} />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return <Comp ref={ref} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    isActive?: boolean
    asChild?: boolean
    tooltip?: Omit<
      React.ComponentPropsWithoutRef<typeof TooltipContent>,
      "children"
    > & {
      children: React.ReactNode
    }
  }
>(
  (
    {
      className,
      children,
      isActive,
      asChild = false,
      variant = "ghost",
      size = "sm",
      tooltip,
      ...props
    },
    ref
  ) => {
    const { isCollapsed, isMobile } = useSidebar()

    if (isCollapsed && !isMobile) {
      if (!tooltip) {
        throw new Error(
          "SidebarMenuButton must have a tooltip when collapsed on desktop"
        )
      }
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              variant={variant}
              size="icon"
              className={cn("size-10", isActive && "bg-muted")}
              {...props}
            >
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent {...tooltip} />
        </Tooltip>
      )
    }

    const Comp = asChild ? Slot : "button"
    return (
      <Button
        ref={ref}
        asChild={asChild}
        variant={variant}
        size={size}
        className={cn(
          "w-full justify-start",
          isActive && "bg-muted",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuCollapsible = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed, isMobile } = useSidebar()

  if (isCollapsed && !isMobile) {
    return <SidebarMenu {...props} ref={ref} />
  }

  return (
    <Collapsible
      ref={ref}
      className={cn("space-y-1", className)}
      {...props}
    />
  )
})
SidebarMenuCollapsible.displayName = "SidebarMenuCollapsible"

const SidebarMenuCollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof SidebarMenuButton> & {
    asChild?: boolean
  }
>(({ asChild = false, ...props }, ref) => {
  const { isCollapsed, isMobile } = useSidebar()

  if (isCollapsed && !isMobile) {
    return (
      <SidebarMenuItem ref={ref as React.Ref<HTMLDivElement>} {...props}>
        {props.children}
      </SidebarMenuItem>
    )
  }

  const Comp = asChild ? Slot : CollapsibleTrigger
  return (
    <Comp ref={ref} asChild>
      <SidebarMenuButton {...props} />
    </Comp>
  )
})
SidebarMenuCollapsibleTrigger.displayName = "SidebarMenuCollapsibleTrigger"

const SidebarMenuCollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CollapsibleContent>
>(({ className, ...props }, ref) => {
  return (
    <CollapsibleContent
      ref={ref}
      className={cn("ml-6 space-y-1", className)}
      {...props}
    />
  )
})
SidebarMenuCollapsibleContent.displayName = "SidebarMenuCollapsibleContent"

/* -------------------------------------------------------------------------- */
/*                                Sidebar Sheet                              */
/* -------------------------------------------------------------------------- */
const SidebarSheet = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { isMobile, isCollapsed } = useSidebar()
  if (!isMobile && isCollapsed) {
    return null
  }
  return <div ref={ref} {...props} />
})
SidebarSheet.displayName = "SidebarSheet"

const SidebarSheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side: "left" | "right" | "top" | "bottom"
  }
>(({ side, className, ...props }, ref) => {
  const { isCollapsed, isMobile } = useSidebar()

  if (!isCollapsed || !isMobile) {
    return null
  }

  const direction =
    side === "left"
      ? "-translate-x-full"
      : side === "right"
        ? "translate-x-full"
        : side === "top"
          ? "-translate-y-full"
          : "translate-y-full"

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-40 bg-background/50 backdrop-blur-sm transition-all data-[state=closed]:-translate-x-full data-[state=open]:-translate-x-0",
        direction,
        className
      )}
      {...props}
    />
  )
})
SidebarSheetContent.displayName = "SidebarSheetContent"

/* -------------------------------------------------------------------------- */
/*                                Sidebar Misc                               */
/* -------------------------------------------------------------------------- */
const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "children">
>((props, ref) => {
  const { onCollapse, collapsible } = useSidebar()
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={() => onCollapse(false)}
      {...props}
    />
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarClose = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "children">
>((props, ref) => {
  const { onCollapse, collapsible } = useSidebar()
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={() => onCollapse(true)}
      {...props}
    >
      <ChevronLeft />
    </Button>
  )
})
SidebarClose.displayName = "SidebarClose"

const SidebarHeaderMenu = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "children">
>(({ ...props }, ref) => {
  const { isCollapsed, isMobile } = useSidebar()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={ref}
          variant="ghost"
          size={isCollapsed && !isMobile ? "icon" : "sm"}
          className={cn(
            isCollapsed && !isMobile && "size-10",
            !isCollapsed && "w-full justify-start"
          )}
          {...props}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>New file</DropdownMenuItem>
        <DropdownMenuItem>New folder</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
SidebarHeaderMenu.displayName = "SidebarHeaderMenu"

const SidebarFooterMenu = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    tooltip?: React.ComponentPropsWithoutRef<typeof TooltipContent>
  }
>(({ tooltip, ...props }, ref) => {
  const { isCollapsed, isMobile } = useSidebar()

  if (isCollapsed && !isMobile) {
    if (!tooltip) {
      throw new Error(
        "SidebarMenuButton must have a tooltip when collapsed on desktop"
      )
    }
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="icon"
            className="size-10"
            {...props}
          />
        </TooltipTrigger>
        <TooltipContent {...tooltip} />
      </Tooltip>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={ref}
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          {...props}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>New file</DropdownMenuItem>
        <DropdownMenuItem>New folder</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
SidebarFooterMenu.displayName = "SidebarFooterMenu"

export {
  // Provider
  SidebarProvider,
  // Wrappers
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  // Menu
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuCollapsible,
  SidebarMenuCollapsibleTrigger,
  SidebarMenuCollapsibleContent,
  // Sheet
  SidebarSheet,
  SidebarSheetContent,
  // Misc
  SidebarTrigger,
  SidebarClose,
  SidebarHeaderMenu,
  SidebarFooterMenu,
}
