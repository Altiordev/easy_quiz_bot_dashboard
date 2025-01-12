import React, { useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Button, Card, message, Tag, Typography, Popconfirm } from "antd";
import { BookOutlined } from "@ant-design/icons";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineQuestionCircle,
  AiOutlineCalendar,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ITopic } from "../interfaces/test.interface.ts";
import { deleteTopic, getTopics } from "../api/tests.query.ts";
import TopicsModel from "../components/modals/topicsModal.tsx";

const { Text } = Typography;

const TopicsPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Partial<ITopic> | undefined>(
    undefined,
  );
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["topics"],
    queryFn: ({ pageParam = 1 }) => getTopics({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.totalPages ?? 0;
      const currentPage = allPages.length;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTopic,
    onSuccess: async () => {
      await refetch();
      message.success("Тема успешно удалена");
    },
    onError: () => {
      message?.error("Произошла ошибка при удалении темы");
    },
  });

  const handleDelete = (testId: number) => {
    deleteMutation.mutate(testId);
  };

  const handleEdit = (test: ITopic) => {
    setEditingTopic(test);
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setEditingTopic(undefined);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setEditingTopic(undefined);
    setIsModalVisible(false);
  };

  const handleAddTest = (topicId: number) => {
    navigate(`/${topicId}`);
  };

  const testsCount = data?.pages?.[0]?.totalCount ?? 0;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold italic">Темы ({testsCount})</h1>
        <Button type="primary" onClick={handleCreate} size="large">
          <strong>Создать тему</strong>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data?.pages.flatMap((page) =>
            page?.data?.map((topic) => (
              <Card
                key={topic.id}
                title={<Text strong>{topic.name}</Text>}
                extra={
                  <span>
                    {topic.active ? (
                      <Tag color="green">Активный</Tag>
                    ) : (
                      <Tag color="red">Неактивный</Tag>
                    )}
                  </span>
                }
                className="shadow-lg border rounded-lg hover:shadow-2xl"
                actions={[
                  <Button
                    type="text"
                    onClick={() => handleEdit(topic)}
                    icon={<AiFillEdit style={{ color: "blue" }} />}
                  >
                    <Text italic>Редактировать</Text>
                  </Button>,
                  <Button
                    type="text"
                    onClick={() => handleAddTest(topic.id)}
                    icon={<BookOutlined style={{ color: "green" }} />}
                  >
                    <Text italic>Добавить тест</Text>
                  </Button>,
                  <Popconfirm
                    title="Вы подтверждаете удаление темы?"
                    onConfirm={() => handleDelete(topic.id)}
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
                  <Text strong>Количество тестов:</Text>{" "}
                  {topic.tests?.length || 0} шт.
                </p>
                <p className="flex items-center gap-2">
                  <AiOutlineCalendar /> <Text strong>Дата создания:</Text>{" "}
                  {new Date(topic.createdAt || "").toLocaleDateString()}
                </p>
              </Card>
            )),
          )
        )}
      </div>
      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
            Загрузить больше
          </Button>
        </div>
      )}
      {isModalVisible && (
        <TopicsModel
          visible={isModalVisible}
          onClose={handleModalClose}
          initialValues={editingTopic}
          isEditing={!!editingTopic}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default TopicsPage;
