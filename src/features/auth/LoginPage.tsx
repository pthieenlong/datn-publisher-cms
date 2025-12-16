import { useState } from "react";
import { Typography } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useAppStore } from "@/app/store";
import { useToast } from "@/hooks/useToast";
import { login } from "./services/auth.service";
import { LoginForm } from "./components";
import type { LoginFormValues } from "./components";
import "./LoginPage.scss";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAppStore();
  const toast = useToast();

  const handleSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const profile = await login(values);
      setUser(profile);
      toast.success("Đăng nhập thành công", "Chào mừng bạn trở lại.");
      navigate({ to: "/" });
    } catch (error) {
      const errorMessage = (() => {
        if (error instanceof AxiosError) {
          const responseMessage =
            (error.response?.data as { message?: string })?.message;
          return (
            responseMessage || "Vui lòng kiểm tra lại thông tin đăng nhập."
          );
        }
        if (error instanceof Error) {
          return error.message;
        }
        return "Vui lòng kiểm tra lại thông tin đăng nhập.";
      })();
      toast.error("Không thể đăng nhập", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__card">
        <div className="login-page__header">
          <Title level={2}>Publisher CMS</Title>
          <Text>Đăng nhập để quản lý kho nội dung của bạn.</Text>
        </div>
        <LoginForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
