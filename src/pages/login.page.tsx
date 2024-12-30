import React from "react";
import { useMutation } from "@tanstack/react-query";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Button, Input, Form, Typography, notification } from "antd";
import { login } from "../api/auth.ts";

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem("chat_id", String(data?.chat_id));
      notification.success({ message: "Muvaffaqiyatli kirildi!" });
      navigate("/");

      if (data?.chat_id) {
        window.location.reload();
      }
    },
    onError: (error: any) => {
      console.log(error);
      notification.error({
        message: "Kirishda xatolik",
        description: error?.response?.data?.message || "Kutilmagan xatolik!",
      });
    },
  });

  const onFinish = (values: { chat_id: number }) => {
    mutation.mutate(values.chat_id);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-10 w-96">
        <Title level={3} className="text-center mb-5 text-gray-700">
          Easy Quiz Tests
        </Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="CHAT ID"
            name="chat_id"
            rules={[{ required: true, message: "Iltimos chat_id yozing!" }]}
          >
            <Input type="number" placeholder="Telegram chat_id" />
          </Form.Item>

          <Form.Item className="text-center mt-8">
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              className="w-full bg-blue-500 hover:bg-blue-600 border-none text-white text-lg"
            >
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
