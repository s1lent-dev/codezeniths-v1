import { cva } from "class-variance-authority";

/**
 * @variants stepIndicatorVariants
 * Controls the appearance of the numbered / check circle for each step.
 * Supports three axes: visual style (variant), progression state (status),
 * and display density (size).
 */

export const stepIndicatorVariants = cva(
  // Base: always a flex circle with smooth transitions
  "relative z-10 flex items-center justify-center rounded-full font-semibold transition-all duration-200 shrink-0 select-none",
  {
    variants: {
      // -- status: where is this step in the flow?
      status: {
        upcoming:
          "bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 hover:bg-foreground-light-shade3/90 dark:hover:bg-foreground-dark-shade3/90",
        active:
          "bg-primary text-foreground-dark dark:text-foreground-light shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark",
        completed: "bg-primary text-foreground-dark dark:text-foreground-light",
      },

      // -- size: compact / default / large
      size: {
        sm: "h-xl-1 w-xl-1 text-span",
        md: "h-xl-2 w-xl-2 text-p",
        lg: "h-xxl-1 w-xxl-1 text-base",
      },

      // -- variant: filled (default) / outlined / ghost
      variant: {
        default: "",
        outline: "border-2 border-current bg-background-light",
        ghost: "bg-transparent border-2",
      },
    },

    // Compound: override colours when outline/ghost meets a specific status
    compoundVariants: [
      // outline × upcoming
      {
        variant: "outline",
        status: "upcoming",
        className: "border-muted-dark text-muted-dark",
      },
      // outline × active
      {
        variant: "outline",
        status: "active",
        className: "border-primary text-primary bg-primary/5",
      },
      // outline × completed
      {
        variant: "outline",
        status: "completed",
        className: "border-primary text-primary bg-primary/10",
      },
      // ghost × upcoming
      {
        variant: "ghost",
        status: "upcoming",
        className: "border-muted-dark text-muted-dark",
      },
      // ghost × active
      {
        variant: "ghost",
        status: "active",
        className: "border-primary text-primary",
      },
      // ghost × completed
      {
        variant: "ghost",
        status: "completed",
        className: "border-primary/50 text-primary/70",
      },
    ],

    defaultVariants: {
      status: "upcoming",
      size: "md",
      variant: "default",
    },
  },
);

/**
 * @variants stepConnectorVariants
 * Controls the appearance of the line connecting step indicators.
 * Supports two axes: orientation (horizontal vs. vertical) and progression (filled vs. unfilled).
 */

export const stepConnectorVariants = cva("transition-all duration-500 rounded-full", {
  variants: {
    // -- orientation: horizontal flow vs. vertical list
    orientation: {
      horizontal: "h-xs-1 flex-1 mx-sm-2",
      vertical: "w-xs-1 flex-1 my-xs-1 mx-auto min-h-lg-2",
    },

    // -- filled: has the user passed through this connector?
    filled: {
      true: "bg-primary shadow-sm",
      false: "bg-foreground-light-shade3 dark:bg-foreground-dark-shade3",
    },
  },

  defaultVariants: {
    orientation: "horizontal",
    filled: false,
  },
});

/**
 * @variants stepLabelVariants
 * Lightweight helper so status-based label colours stay in one place.
 * Supports two axes: progression state (status) and display density (size).
 */

export const stepLabelVariants = cva("font-semibold leading-tight", {
  variants: {
    status: {
      upcoming: "text-body-light dark:text-body-dark",
      active: "text-foreground-dark-shade3 dark:text-foreground-light-shade3",
      completed: "text-muted-light dark:text-muted-dark",
    },
    size: {
      sm: "text-[10px]",
      md: "text-span",
      lg: "text-p",
    },
  },
  defaultVariants: {
    status: "upcoming",
    size: "md",
  },
});
