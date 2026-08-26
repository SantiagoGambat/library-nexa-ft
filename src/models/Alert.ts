export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertState {
  open: boolean;
  type: AlertType;
  title: string;
  message: string;
}

export const initialAlert: AlertState = {
  open: false,
  type: "info",
  title: "",
  message: "",
};
