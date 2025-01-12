import {
  IGetAllPagination,
  IPaginationOptions,
} from "../interfaces/interface.ts";
import {
  IOptions,
  IQuestion,
  ITest,
  ITopic,
} from "../interfaces/test.interface.ts";
import api from "./axios.instance.ts";

async function getTopics(
  pagination: IPaginationOptions,
): Promise<IGetAllPagination<ITopic> | null> {
  const response = await api.get(
    `/tests/topic?page=${pagination.page}&limit=${pagination.limit}`,
  );

  if (!response.data) {
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: pagination.page,
    };
  }
  return response.data;
}

async function getTopicById(topicId: number): Promise<ITopic | null> {
  const response = await api.get(`/tests/topic/${topicId}`);
  return response.data;
}

async function createTopic(data: ITopic): Promise<ITopic | null> {
  const response = await api.post("/tests/topic", data);
  return response.data;
}
async function updateTopic(
  topicId: number,
  data: Partial<ITopic>,
): Promise<void> {
  const response = await api.put(`/tests/topic/${topicId}`, data);
  return response.data;
}
async function deleteTopic(topicId: number): Promise<void> {
  await api.delete(`/tests/topic/${topicId}`);
}

async function getTests(
  pagination: IPaginationOptions,
): Promise<IGetAllPagination<ITest> | null> {
  const response = await api.get(
    `/tests/test?page=${pagination.page}&limit=${pagination.limit}`,
  );

  if (!response.data) {
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: pagination.page,
    };
  }
  return response.data;
}

async function getTestById(testId: number): Promise<ITest | null> {
  const response = await api.get(`/tests/test/${testId}`);
  return response.data;
}

async function createTest(data: ITest): Promise<ITest | null> {
  const response = await api.post("/tests/test", data);
  return response.data;
}
async function updateTest(testId: number, data: Partial<ITest>): Promise<void> {
  const response = await api.put(`/tests/test/${testId}`, data);
  return response.data;
}
async function deleteTest(testId: number): Promise<void> {
  await api.delete(`/tests/test/${testId}`);
}

// async function getQuestionsByTestId(testId: number): Promise<IQuestion[] | []> {
//   const response = await api.get(`/tests/question/${testId}`);
//   return response.data;
// }

async function createQuestion(data: IQuestion): Promise<IQuestion | null> {
  const response = await api.post("/tests/question", data);
  return response.data;
}
async function updateQuestion(
  questionId: number,
  data: Partial<IQuestion>,
): Promise<void> {
  const response = await api.put(`/tests/question/${questionId}`, data);
  return response.data;
}
async function deleteQuestion(questionId: number): Promise<void> {
  await api.delete(`/tests/question/${questionId}`);
}

async function createOption(data: IOptions): Promise<IOptions | null> {
  const response = await api.post("/tests/option", data);
  return response.data;
}
async function updateOption(
  optionId: number,
  data: Partial<IOptions>,
): Promise<void> {
  const response = await api.put(`/tests/option/${optionId}`, data);
  return response.data;
}
async function deleteOption(optionId: number): Promise<void> {
  await api.delete(`/tests/option/${optionId}`);
}

export {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createOption,
  updateOption,
  deleteOption,
  getTopics,
  getTopicById,
  createTopic,
  deleteTopic,
  updateTopic,
};
