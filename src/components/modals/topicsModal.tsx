import React, { useEffect } from "react";
import { Form, Input, message, Modal, Switch, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { ITopic } from "../../interfaces/test.interface.ts";
import { createTopic, updateTopic } from "../../api/tests.query.ts";

const { Text } = Typography;

const TopicsModel: React.FC<{
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  initialValues?: Partial<ITopic>;
  refetch?: () => void;
}> = ({ visible, onClose, initialValues, isEditing, refetch }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditing && initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    } else {
      form.resetFields();
    }
  }, [isEditing, initialValues, form]);

  const mutation = useMutation<void | null, Error, Partial<ITopic>>({
    mutationFn: async (values: Partial<ITopic>) => {
      if (isEditing && initialValues?.id) {
        await updateTopic(initialValues.id, values);
        return null;
      }
      console.log(values);
      await createTopic(values as ITopic);
      return null;
    },
    onSuccess: () => {
      message?.success(
        isEditing ? "Тема успешно обновлена" : "Тема успешно создана",
      );
      form.resetFields();
      refetch?.();
      onClose();
    },
    onError: (e) => {
      console.log(e);
      message?.error("Произошла ошибка при выполнении действия");
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        mutation.mutate(values);
      })
      .catch((info) => console.log("Tasdiqlashda xatolik:", info));
  };

  return (
    <Modal
      title={
        isEditing ? (
          <Text strong italic>
            Редактировать тему
          </Text>
        ) : (
          <Text strong italic>
            Создать тему
          </Text>
        )
      }
      width={1000}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={mutation.isPending}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          label={<Text strong>Название темы</Text>}
          name="name"
          rules={[
            { required: true, message: "Пожалуйста, введите название темы!" },
          ]}
        >
          <Input.TextArea rows={3} showCount />
        </Form.Item>

        <Form.Item
          label={<Text strong>Подробнее о теме</Text>}
          name="description"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите подробнее о теме!",
            },
          ]}
        >
          <Input.TextArea rows={5} showCount />
        </Form.Item>

        <Form.Item
          label={<Text strong>Активный</Text>}
          name="active"
          valuePropName="checked"
        >
          <Switch defaultChecked />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TopicsModel;
