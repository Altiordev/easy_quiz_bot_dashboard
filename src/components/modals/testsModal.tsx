import React, { useEffect } from "react";
import { ITest } from "../../interfaces/test.interface.ts";
import { Form, Input, message, Modal, Select, Switch, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { createTest, updateTest } from "../../api/tests.query.ts";
import { TestDifficultyLevelEnum } from "../../enums/test.enum.ts";
import { useParams } from "react-router-dom";

const { Text } = Typography;

const TestsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  initialValues?: Partial<ITest>;
  refetch?: () => void;
}> = ({ visible, onClose, initialValues, isEditing, refetch }) => {
  const [form] = Form.useForm();
  const { id: topicIdParam } = useParams<{ id: string }>();
  const topicId = Number(topicIdParam);

  useEffect(() => {
    if (isEditing && initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    } else {
      form.resetFields();
    }
  }, [isEditing, initialValues, form]);

  const mutation = useMutation<void | null, Error, Partial<ITest>>({
    mutationFn: async (values: Partial<ITest>) => {
      if (isEditing && initialValues?.id) {
        await updateTest(initialValues.id, values);
        return null;
      }
      await createTest(values as ITest);
      return null;
    },
    onSuccess: () => {
      message?.success(
        isEditing
          ? "Test muvaffaqiyatli yangilandi"
          : "Test muvaffaqiyatli yaratildi",
      );
      form.resetFields();
      refetch?.();
      onClose();
    },
    onError: () => {
      message?.error("Произошла ошибка при выполнении действия");
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        values.topic_id = topicId;
        mutation.mutate(values);
      })
      .catch((info) => console.log("Tasdiqlashda xatolik:", info));
  };

  return (
    <Modal
      title={
        isEditing ? (
          <Text strong italic>
            Testni tahrirlash
          </Text>
        ) : (
          <Text strong italic>
            Test yaratish
          </Text>
        )
      }
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={mutation.isPending}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          label={<Text strong>Nomi</Text>}
          name="name"
          rules={[
            { required: true, message: "Iltimos, test nomini kiriting!" },
            { max: 255, message: "Test nomi 255 belgidan oshmasligi kerak!" },
          ]}
        >
          <Input.TextArea
            rows={3}
            maxLength={255}
            showCount
            placeholder="Test nomini kiriting..."
          />
        </Form.Item>

        <Form.Item
          label={<Text strong>Qiyinchilik darajasi</Text>}
          name="difficulty_level"
        >
          <Select allowClear placeholder="Tanlanmagan">
            <Select.Option key="null" value={null}>
              Tanlanmagan
            </Select.Option>
            {Object.values(TestDifficultyLevelEnum).map((level) => (
              <Select.Option key={level} value={level}>
                {level}
              </Select.Option>
            ))}
          </Select>
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

export default TestsModal;
