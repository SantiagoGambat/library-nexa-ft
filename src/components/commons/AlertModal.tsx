import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertModalProps {
  open: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
}

const config = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-600 bg-emerald-100",
    button: "primary" as const,
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-600 bg-red-100",
    button: "danger" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-600 bg-amber-100",
    button: "primary" as const,
  },
  info: {
    icon: Info,
    iconClass: "text-blue-600 bg-blue-100",
    button: "primary" as const,
  },
};

export default function AlertModal({
  open,
  type,
  title,
  message,
  onClose,
}: AlertModalProps) {
  const { icon: Icon, iconClass, button } = config[type];

  return (
    <Modal open={open} title="" onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div
          className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${iconClass}`}
        >
          <Icon size={32} strokeWidth={2} />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {message}
        </p>

        <Button
          type="button"
          variant={button}
          onClick={onClose}
          className="mt-6 min-w-28"
        >
          Entendido
        </Button>
      </div>
    </Modal>
  );
}
