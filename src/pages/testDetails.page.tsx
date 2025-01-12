import React, { useState } from "react";
import {
  Button,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Typography,
  Form,
  InputNumber,
  Space,
  Spin,
  Tooltip,
  RadioChangeEvent,
} from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTestById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createOption,
  updateOption,
  deleteOption,
} from "../api/tests.query";
import { IOptions, IQuestion } from "../interfaces/test.interface";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface QuestionFormValues {
  question: string;
  question_score?: number;
}

const TestDetailsPage: React.FC = () => {
  const { id: testIdParam } = useParams<{ id: string }>();
  const testId = Number(testIdParam);
  const navigate = useNavigate();

  // --- STATE ---
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(
    null,
  );

  const [editedOptions, setEditedOptions] = useState<{
    [optionId: number]: string;
  }>({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["test", testId],
    queryFn: () => getTestById(testId),
    enabled: !!testId,
  });

  const createQuestionMutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: async () => {
      await refetch();
      // message.success("Savol muvaffaqiyatli qo‘shildi");
      setIsQuestionModalVisible(false);
      setEditingQuestion(null);
    },
    onError: (error: any) => {
      console.error("Savol qo‘shishda xatolik:", error);
      message.error(
        error.response?.data?.message || "Savol qo‘shishda xatolik yuz berdi",
      );
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: number;
      data: Partial<IQuestion>;
    }) => updateQuestion(questionId, data),

    onSuccess: async () => {
      await refetch();
      message.success("Вопрос успешно обновлён");
      setIsQuestionModalVisible(false);
      setEditingQuestion(null);
    },
    onError: (error: any) => {
      console.error("Savolni yangilashda xatolik:", error);
      message.error(
        error.response?.data?.message ||
          "Произошла ошибка при обновлении вопроса",
      );
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: async () => {
      await refetch();
      message.success("Вопрос успешно удалён");
    },
    onError: (error: any) => {
      console.error("Savolni o‘chirishda xatolik:", error);
      message.error(
        error.response?.data?.message ||
          "Произошла ошибка при обновлении вопроса",
      );
    },
  });

  const createOptionMutation = useMutation({
    mutationFn: createOption,
    onSuccess: async () => {
      await refetch();
      // message.success("Variant muvaffaqiyatli qo‘shildi");
    },
    onError: (error: any) => {
      console.error("Variant qo‘shishda xatolik:", error);
      message.error(
        error.response?.data?.message ||
          "Произошла ошибка при добавлении варианта",
      );
    },
  });

  const updateOptionMutation = useMutation({
    mutationFn: ({
      optionId,
      data,
    }: {
      optionId: number;
      data: Partial<IOptions>;
    }) => updateOption(optionId, data),

    onSuccess: async () => {
      await refetch();
      // message.success("Variant muvaffaqiyatli yangilandi");
    },
    onError: (error: any) => {
      console.error("Variantni tahrirlashda xatolik:", error);
      message.error(
        error.response?.data?.message ||
          "Произошла ошибка при редактировании варианта",
      );
    },
  });

  const deleteOptionMutation = useMutation({
    mutationFn: deleteOption,
    onSuccess: async () => {
      await refetch();
      message.success("Вариант успешно удалён");
    },
    onError: (error: any) => {
      console.error("Variantni o‘chirishda xatolik:", error);
      message.error(
        error.response?.data?.message ||
          "Произошла ошибка при удалении варианта",
      );
    },
  });

  // --- HANDLERS ---

  // Open the modal for creating or editing a question
  const openQuestionModal = (question?: IQuestion) => {
    setEditingQuestion(question || null);
    setIsQuestionModalVisible(true);
  };

  // Handle form submission for question modal
  const handleQuestionModalOk = (values: QuestionFormValues) => {
    const { question, question_score } = values;

    if (editingQuestion?.id) {
      // Update existing question
      updateQuestionMutation.mutate({
        questionId: editingQuestion.id,
        data: {
          question,
          question_score: question_score ?? undefined,
        },
      });
    } else {
      // Create new question
      createQuestionMutation.mutate({
        test_id: testId,
        question,
        question_score: question_score ?? 0,
      } as IQuestion);
    }
  };

  // Delete a question
  const handleDeleteQuestion = (questionId: number) => {
    deleteQuestionMutation.mutate(questionId);
  };

  // Handle radio button change to set the correct option
  const handleRadioChange = (e: RadioChangeEvent, question: IQuestion) => {
    const selectedOptionId = e.target.value;
    const allOptions = question.options || [];

    allOptions.forEach((option) => {
      if (option.id === selectedOptionId) {
        if (!option.isCorrect) {
          updateOptionMutation.mutate({
            optionId: option.id,
            data: { isCorrect: true },
          });
        }
      } else if (option.isCorrect) {
        updateOptionMutation.mutate({
          optionId: option.id,
          data: { isCorrect: false },
        });
      }
    });
  };

  // Handle changes in option input fields
  const handleOptionInputChange = (optionId: number, value: string) => {
    setEditedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  // Handle blur event on option input to save changes
  const handleOptionBlur = (option: IOptions) => {
    const optionId = option.id;
    const newValue = editedOptions[optionId] ?? option.option;

    if (newValue.trim() !== "") {
      updateOptionMutation.mutate({
        optionId,
        data: { option: newValue },
      });
    } else {
      // Variant bo‘sh bo‘lsa, variantni o‘chirish yoki boshqa kerakli holatni boshqarish
      message?.error("Текст варианта не может быть пустым!");
      setEditedOptions((prev) => {
        const updated = { ...prev };
        delete updated[optionId];
        return updated;
      });
    }
  };

  // Delete an option
  const handleDeleteOption = (optionId: number) => {
    deleteOptionMutation.mutate(optionId);
  };

  // Add a new option by creating it on the backend with empty string
  const handleAddOption = (questionId: number) => {
    createOptionMutation.mutate({
      question_id: questionId,
      option: "",
      isCorrect: false,
    } as IOptions);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <Text className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
          Информации об этом тесте нет
        </Text>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header Section */}
      <div className="flex flex-row items-start md:items-center justify-between mb-6 gap-2">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-2 md:mb-0"
          size="middle"
        >
          Назад
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openQuestionModal()}
          size="middle"
        >
          Добавить вопрос
        </Button>
      </div>

      {/* Test Details */}
      <div className="mb-6 border p-6 rounded-lg shadow-sm bg-white text-center">
        <div className="text-sm sm:text-md md:text-lg lg:text-xl font-bold">
          {data.name}
        </div>
        <div className="text-md mt-4">
          <Text strong>Количество вопросов: </Text>
          {data.questions?.length || 0} шт.
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {data.questions && data.questions.length > 0 ? (
          data.questions.map((question: IQuestion, index: number) => (
            <div
              key={question.id}
              className="border rounded-lg p-4 md:p-6 shadow-sm bg-white flex flex-col"
            >
              {/* Question Header with Numeration */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex items-center">
                  {/* Numeration */}
                  <div className="mr-3 text-sm sm:text-md font-semibold text-gray-700">
                    {index + 1})
                  </div>
                  {/* Question Text */}
                  <div className="font-semibold text-sm sm:text-md  ">
                    {question.question}
                    {question.question_score !== undefined && (
                      <span className="text-gray-500 ml-2 text-xs sm:text-sm">
                        (Ball: {question.question_score})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 mt-2 md:mt-0">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => openQuestionModal(question)}
                    className="text-xs sm:text-sm"
                    size="small"
                  >
                    Редактировать
                  </Button>
                  <Popconfirm
                    title="Вы подтверждаете удаление этого вопроса?"
                    onConfirm={() => handleDeleteQuestion(question.id)}
                    okText="Да"
                    cancelText="Нет"
                  >
                    <Button
                      type="text"
                      danger
                      className="text-xs sm:text-sm flex items-center"
                      size="small"
                      icon={<DeleteOutlined />}
                    >
                      {/* Mobile: faqat icon */}
                      <span className="block sm:hidden">Удалить</span>
                      {/* Desktop: icon va matn */}
                      <span className="hidden sm:block">Удалить вопрос</span>
                    </Button>
                  </Popconfirm>
                </div>
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {question.options && question.options.length > 0 ? (
                  question.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-3 text-sm sm:text-md  "
                    >
                      <Tooltip title="Tanlaganingiz javob hisoblanadi">
                        <Radio
                          checked={option.isCorrect}
                          onChange={(e) => handleRadioChange(e, question)}
                          value={option.id}
                        />
                      </Tooltip>
                      <Input
                        value={
                          editedOptions[option.id] !== undefined
                            ? editedOptions[option.id]
                            : option.option
                        }
                        onChange={(e) =>
                          handleOptionInputChange(option.id, e.target.value)
                        }
                        onBlur={() => handleOptionBlur(option)}
                        placeholder="Текст варианта"
                        className="w-full text-sm sm:text-md  "
                      />
                      <Popconfirm
                        title="Вы подтверждаете удаление варианта?"
                        onConfirm={() => handleDeleteOption(option.id)}
                        okText="Да"
                        cancelText="Нет"
                      >
                        <Button
                          danger
                          className="text-xs sm:text-sm flex items-center"
                          size="small"
                        >
                          {/* Mobile: faqat icon */}
                          <span className="block sm:hidden">
                            <DeleteOutlined />
                          </span>
                          {/* Desktop: icon va matn */}
                          <span className="hidden sm:block">Удалить</span>
                        </Button>
                      </Popconfirm>
                    </div>
                  ))
                ) : (
                  <Text className="text-xs sm:text-sm text-gray-500">
                    Никаких вариантов не существует.
                  </Text>
                )}

                {/* Add Option Button */}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddOption(question.id)}
                  className="text-xs sm:text-sm"
                  size="small"
                  loading={createOptionMutation.isPending}
                >
                  Добавить вариант
                </Button>
              </div>
            </div>
          ))
        ) : (
          <Text className="text-xs sm:text-sm text-gray-500">
            Никаких вопросов не существует.
          </Text>
        )}
      </div>

      {/* Question Modal */}
      {isQuestionModalVisible && (
        <Modal
          title={editingQuestion ? "Редактировать вопрос" : "Добавить вопрос"}
          open={isQuestionModalVisible}
          onCancel={() => {
            setIsQuestionModalVisible(false);
            setEditingQuestion(null);
          }}
          footer={null}
          destroyOnClose
        >
          <Form
            layout="vertical"
            onFinish={handleQuestionModalOk}
            initialValues={
              editingQuestion
                ? {
                    question: editingQuestion.question,
                    question_score: editingQuestion.question_score,
                  }
                : {}
            }
          >
            <Form.Item
              name="question"
              label="Текст вопроса"
              rules={[{ required: true, message: "Введите текст вопроса!" }]}
            >
              <Input.TextArea className="text-sm sm:text-md  " />
            </Form.Item>
            <Form.Item
              name="question_score"
              label="Баллы (необязательно)"
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: "Баллы не могут быть отрицательными!",
                },
              ]}
            >
              <InputNumber
                min={0}
                defaultValue={1}
                style={{ width: "100%" }}
                className="text-sm sm:text-md  "
              />
            </Form.Item>
            <Form.Item>
              <Space className="w-full justify-end">
                <Button
                  onClick={() => {
                    setIsQuestionModalVisible(false);
                    setEditingQuestion(null);
                  }}
                  className="text-xs sm:text-sm"
                  size="middle"
                >
                  Отменить
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="text-xs sm:text-sm"
                  size="middle"
                  loading={
                    editingQuestion
                      ? updateQuestionMutation.isPending
                      : createQuestionMutation.isPending
                  }
                >
                  Сохранить
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default TestDetailsPage;
