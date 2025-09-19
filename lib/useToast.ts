import { useToast as shadToast } from "@/components/ui/toast"

export function useToast() {
  const { toast } = shadToast()

  return {
    success: (message: string) => toast({ title: "Success", description: message }),
    error: (message: string) => toast({ title: "Error", description: message, variant: "destructive" }),
    info: (message: string) => toast({ title: "Info", description: message }),
    warn: (message: string) => toast({ title: "Warning", description: message, variant: "destructive" }),
  }
}
