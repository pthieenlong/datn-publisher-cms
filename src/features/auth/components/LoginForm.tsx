import { Button, Form, Input } from "antd";
import { Lock, Mail } from "lucide-react";
import "./LoginForm.scss";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  isSubmitting: boolean;
  onSubmit: (values: LoginFormValues) => void;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

export default function LoginForm({ isSubmitting, onSubmit }: LoginFormProps) {
  const [form] = Form.useForm<LoginFormValues>();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      className="login-form"
      onFinish={onSubmit}
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
        className="login-form__submit-btn"
        block
      >
        Đăng nhập
      </Button>
    </Form>
  );
}
