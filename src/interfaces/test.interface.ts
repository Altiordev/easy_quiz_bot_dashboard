import { TestDifficultyLevelEnum } from "../enums/test.enum.ts";

export interface ITopic {
  id: number;
  name: string;
  description: string;
  active: boolean;
  tests?: ITest[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITest {
  id: number;
  name: string;
  difficulty_level: TestDifficultyLevelEnum;
  active: boolean;
  questions?: IQuestion[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuestion {
  id: number;
  test_id: number;
  test?: ITest;
  question: string;
  question_score: number;
  options?: IOptions[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOptions {
  id: number;
  question_id: number;
  question?: IQuestion;
  option: string;
  isCorrect: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
