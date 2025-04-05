
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#222222] group-[.toaster]:text-white group-[.toaster]:border-[#333333] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-300",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "group-[.toast]:bg-[#2A1E1E] group-[.toast]:border-[#452525]",
          success: "group-[.toast]:bg-[#1E2A1E] group-[.toast]:border-[#254525]",
          info: "group-[.toast]:bg-[#1E222A] group-[.toast]:border-[#252C45]",
          warning: "group-[.toast]:bg-[#2A261E] group-[.toast]:border-[#453D25]",
          closeButton: "group-[.toast]:text-white group-[.toast]:hover:bg-[#333333]",
        },
      }}
      closeButton
      position="top-right"
      {...props}
    />
  );
};

export { Toaster, Sonner };
