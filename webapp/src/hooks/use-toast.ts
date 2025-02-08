import { toast } from 'sonner';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export function useToast() {
  const showToast = {
    success: (message: string, options?: ToastOptions) => {
      toast.success(message, options);
    },
    error: (message: string, options?: ToastOptions) => {
      toast.error(message, options);
    },
    loading: (message: string, options?: ToastOptions) => {
      toast.loading(message, options);
    },
    dismiss: (toastId?: string) => {
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
    },
  };

  return showToast;
} 