import React, { useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Button, Card, message, Tag, Typography, Popconfirm } from "antd";
import { getTests, deleteTest } from "../api/tests.query";
import { ITest } from "../interfaces/test.interface";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineQuestionCircle,
  AiOutlineCalendar,
} from "react-icons/ai";
import { SiLevelsdotfyi } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import TestsModal from "../components/modals/testsModal.tsx";

const { Text } = Typography;

const difficultyTagColors = {
  EASY: "green",
  MEDIUM: "blue",
  HARD: "orange",
  EXPERT: "red",
  DEFAULT: "gray",
} as const;

const TestsPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTest, setEditingTest] = useState<Partial<ITest> | undefined>(
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
    queryKey: ["tests"],
    queryFn: ({ pageParam = 1 }) => getTests({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.totalPages ?? 0;
      const currentPage = allPages.length;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTest,
    onSuccess: async () => {
      await refetch();
      message.success("Test muvaffaqiyatli o‘chirildi");
    },
    onError: () => {
      message?.error("Testni o‘chirishda xatolik yuz berdi");
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
    navigate(`/${testId}`);
  };

  const testsCount = data?.pages?.[0]?.totalCount ?? 0;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold italic">Testlar ({testsCount})</h1>
        <Button type="primary" onClick={handleCreate} size="large">
          <strong>Test yaratish</strong>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Yuklanmoqda...</p>
        ) : (
          data?.pages.flatMap((page) =>
            page?.data?.map((test) => (
              <Card
                key={test.id}
                title={<Text strong>{test.name}</Text>}
                extra={
                  <span>
                    {test.active ? (
                      <Tag color="green"> Faol</Tag>
                    ) : (
                      <Tag color="red">Faol emas</Tag>
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
                    <Text italic>Tahrirlash</Text>
                  </Button>,
                  <Button
                    type="text"
                    onClick={() => handleAddQuestion(test.id)}
                    icon={
                      <AiOutlineQuestionCircle style={{ color: "green" }} />
                    }
                  >
                    <Text italic>Savol qo‘shish</Text>
                  </Button>,
                  <Popconfirm
                    title="Testni o‘chirishni tasdiqlaysizmi?"
                    onConfirm={() => handleDelete(test.id)}
                    okText="Ha"
                    cancelText="Yo‘q"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<AiFillDelete style={{ color: "red" }} />}
                    >
                      <Text italic>O‘chirish</Text>
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <p className="flex items-center gap-2">
                  <AiOutlineQuestionCircle /> <Text strong>Savollar soni:</Text>{" "}
                  {test.questions?.length || 0} ta
                </p>
                <p className="flex items-center gap-2">
                  <AiOutlineCalendar /> <Text strong>Yaratilgan sana:</Text>{" "}
                  {new Date(test.createdAt || "").toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2">
                  <SiLevelsdotfyi />
                  <Text strong>Qiyinlik darajasi:</Text>{" "}
                  <Tag
                    color={
                      difficultyTagColors[
                        (test.difficulty_level?.toUpperCase() as keyof typeof difficultyTagColors) ||
                          "DEFAULT"
                      ]
                    }
                  >
                    {test.difficulty_level || "Tanlanmagan"}
                  </Tag>
                </p>
              </Card>
            )),
          )
        )}
      </div>
      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
            Ko‘proq yuklash
          </Button>
        </div>
      )}
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
