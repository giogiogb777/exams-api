import { Injectable } from '@nestjs/common';

export enum QuestionCategoryEnum {
  TRUE_FALSE = 1,
  SINGLE_CHOICE = 2,
  MULTIPLE_CHOICE = 3,
}

export enum DifficultyEnum {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}

export enum ExamCategoryEnum {
  JAVASCRIPT = 1,
  TYPESCRIPT = 2,
  REACT = 3,
  ANGULAR = 4,
  VUE = 5,
  HTML_CSS = 6,
  GENERAL = 7,
}

export enum PermissionEnum {
  USER = 1,
  MODERATOR = 2,
  ADMIN = 4,
}

export enum StatusEnum {
  ACTIVE = 1,
  INACTIVE = 2,
}

@Injectable()
export class DictionariesService {
  getQuestionCategories() {
    return [
      { label: 'True/False', value: QuestionCategoryEnum.TRUE_FALSE },
      { label: 'Single Choice', value: QuestionCategoryEnum.SINGLE_CHOICE },
      { label: 'Multiple Choice', value: QuestionCategoryEnum.MULTIPLE_CHOICE },
    ];
  }

  getDifficulties() {
    return [
      { label: 'Easy', value: DifficultyEnum.EASY },
      { label: 'Medium', value: DifficultyEnum.MEDIUM },
      { label: 'Hard', value: DifficultyEnum.HARD },
    ];
  }

  getExamCategories() {
    return [
      { label: 'JavaScript', value: ExamCategoryEnum.JAVASCRIPT },
      { label: 'TypeScript', value: ExamCategoryEnum.TYPESCRIPT },
      { label: 'React', value: ExamCategoryEnum.REACT },
      { label: 'Angular', value: ExamCategoryEnum.ANGULAR },
      { label: 'Vue', value: ExamCategoryEnum.VUE },
      { label: 'HTML & CSS', value: ExamCategoryEnum.HTML_CSS },
      { label: 'General', value: ExamCategoryEnum.GENERAL },
    ];
  }

  getPermissions() {
    return [
      {
        label: 'User',
        value: PermissionEnum.USER,
      },
      {
        label: 'Moderator',
        value: PermissionEnum.MODERATOR,
      },
      {
        label: 'Admin',
        value: PermissionEnum.ADMIN,
      },
    ];
  }

  getStatuses() {
    return [
      { label: 'Active', value: StatusEnum.ACTIVE },
      { label: 'Inactive', value: StatusEnum.INACTIVE },
    ];
  }
}
