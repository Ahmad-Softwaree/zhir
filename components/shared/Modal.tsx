"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/lib/store/modal.store";

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}
export type ModalTypes =
  | "add"
  | "delete"
  | "restore"
  | "update"
  | "filter"
  | "info"
  | "warning";

function Modal({
  open,
  onOpenChange,
  children,
  title,
  description,
  maxWidth = "!max-w-2xl",
}: ModalProps) {
  const { closeModal } = useModalStore();

  return (
    <Dialog open={open || true} onOpenChange={onOpenChange || closeModal}>
      <DialogContent
        className={`overflow-y-auto max-h-[80vh]  w-full ${maxWidth}`}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
