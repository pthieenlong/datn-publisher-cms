import { useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useAppStore } from "@/app/store";
import { useToast } from "@/hooks/useToast";
import { login, type LoginPayload } from "./services/auth.service";
import "./LoginPage.scss";

const { Title, Text } = Typography;

const initialValues: LoginPayload = {
  email: "",
  password: "",
};

function LoginPage() {
  const [form] = Form.useForm<LoginPayload>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAppStore();
  const toast = useToast();

  const handleSubmit = async (values: LoginPayload) => {
    setIsSubmitting(true);
    try {
      const profile = await login(values);
      setUser(profile);
      toast.success("Đăng nhập thành công", "Chào mừng bạn trở lại.");
      navigate({ to: "/" });
    } catch (error) {
      const message = (() => {
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
      toast.error("Không thể đăng nhập", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <Title level={2}>Publisher CMS</Title>
          <Text>Đăng nhập để quản lý kho nội dung của bạn.</Text>
        </div>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          className="login-form"
          onFinish={handleSubmit}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email không được để trống." },
              {
                type: "email",
                message: "Email chưa đúng định dạng.",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Nhập email công việc"
              prefix={<Mail size={20} strokeWidth={1.5} />}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Mật khẩu không được để trống." }]}
          >
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu"
              prefix={<Lock size={20} strokeWidth={1.5} />}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isSubmitting}
            className="login-submit-btn"
            block
          >
            Đăng nhập
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;

