import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { ToastContainer } from "../components/Toast";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ConfigProvider>
      {children}
      <ToastContainer />
    </ConfigProvider>
  );
};
