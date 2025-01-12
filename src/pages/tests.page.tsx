import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  message,
  Tag,
  Typography,
  Popconfirm,
  Spin,
  Tooltip,
} from "antd";
import { deleteTest, getTopicById } from "../api/tests.query";
import { ITest } from "../interfaces/test.interface";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineQuestionCircle,
  AiOutlineCalendar,
} from "react-icons/ai";
import { SiLevelsdotfyi } from "react-icons/si";
import { useNavigate, useParams } from "react-router-dom";
import TestsModal from "../components/modals/testsModal.tsx";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Text } = Typography;

const difficultyTagColors = {
  EASY: "green",
  MEDIUM: "blue",
  HARD: "orange",
  EXPERT: "red",
  DEFAULT: "gray",
} as const;

const TestsPage: React.FC = () => {
  const { id: topicIdParam } = useParams<{ id: string }>();
  const topicId = Number(topicIdParam);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTest, setEditingTest] = useState<Partial<ITest> | undefined>(
    undefined,
  );
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["topicDetail", topicId],
    queryFn: () => getTopicById(topicId),
    enabled: !!topicId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTest,
    onSuccess: async () => {
      await refetch();
      message.success("Тест успешно удалён");
    },
    onError: () => {
      message?.error("Произошла ошибка при удалении теста");
    },
  });

  const handleDelete = (testId: number) => {
    deleteMutation.mutate(testId);
  };

  const handleEdit = (test: ITest) => {
    setEditingTest(test);
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setEditingTest(undefined);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setEditingTest(undefined);
    setIsModalVisible(false);
  };

  const handleAddQuestion = (testId: number) => {
    navigate(`/test/${testId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }
  if (!data) return <div>Ничего нет</div>;

  const testsCount = data?.tests?.length ?? 0;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className={`flex gap-5 items-center`}>
          <Tooltip title={"Вернуться на страницу тем"}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/")}
            />
          </Tooltip>
          <h4 className="text-2xl font-bold italic">
            {data.name} ({testsCount})
          </h4>
        </div>
        <Button type="primary" onClick={handleCreate} size="large">
          <strong>Создать тест</strong>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.tests?.map((test) => (
          <Card
            key={test.id}
            title={<Text strong>{test.name}</Text>}
            extra={
              <span>
                {test.active ? (
                  <Tag color="green"> Активный</Tag>
                ) : (
                  <Tag color="red">Неактивный</Tag>
                )}
              </span>
            }
            className="shadow-lg border rounded-lg hover:shadow-2xl"
            actions={[
              <Button
                type="text"
                onClick={() => handleEdit(test)}
                icon={<AiFillEdit style={{ color: "blue" }} />}
              >
                <Text italic>Редактировать</Text>
              </Button>,
              <Button
                type="text"
                onClick={() => handleAddQuestion(test.id)}
                icon={<AiOutlineQuestionCircle style={{ color: "green" }} />}
              >
                <Text italic>Добавить вопрос</Text>
              </Button>,
              <Popconfirm
                title="Вы подтверждаете удаление теста?"
                onConfirm={() => handleDelete(test.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  type="text"
                  danger
                  icon={<AiFillDelete style={{ color: "red" }} />}
                >
                  <Text italic>Удалить</Text>
                </Button>
              </Popconfirm>,
            ]}
          >
            <p className="flex items-center gap-2">
              <AiOutlineQuestionCircle />{" "}
              <Text strong>Количество вопросов:</Text>{" "}
              {test.questions?.length || 0} шт.
            </p>
            <p className="flex items-center gap-2">
              <AiOutlineCalendar /> <Text strong>Дата создания:</Text>{" "}
              {new Date(test.createdAt || "").toLocaleDateString()}
            </p>
            <p className="flex items-center gap-2">
              <SiLevelsdotfyi />
              <Text strong>Уровень сложности:</Text>{" "}
              <Tag
                color={
                  difficultyTagColors[
                    (test.difficulty_level?.toUpperCase() as keyof typeof difficultyTagColors) ||
                      "DEFAULT"
                  ]
                }
              >
                {test.difficulty_level || "Не выбрано"}
              </Tag>
            </p>
          </Card>
        ))}
      </div>

      {isModalVisible && (
        <TestsModal
          visible={isModalVisible}
          onClose={handleModalClose}
          initialValues={editingTest}
          isEditing={!!editingTest}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default TestsPage;
