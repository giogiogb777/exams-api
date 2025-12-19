import { Injectable } from '@nestjs/common';

export enum QuestionCategory {
  TRUE_FALSE = 'true_false',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum ExamCategory {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  REACT = 'react',
  ANGULAR = 'angular',
  VUE = 'vue',
  HTML_CSS = 'html_css',
  GENERAL = 'general',
}

@Injectable()
export class DictionariesService {
  getQuestionCategories() {
    return [
      { key: 'true_false', value: QuestionCategory.TRUE_FALSE, label: 'True/False' },
      { key: 'single_choice', value: QuestionCategory.SINGLE_CHOICE, label: 'Single Choice' },
      { key: 'multiple_choice', value: QuestionCategory.MULTIPLE_CHOICE, label: 'Multiple Choice' },
    ];
  }

  getDifficulties() {
    return [
      { key: 'easy', value: Difficulty.EASY, label: 'Easy' },
      { key: 'medium', value: Difficulty.MEDIUM, label: 'Medium' },
      { key: 'hard', value: Difficulty.HARD, label: 'Hard' },
    ];
  }

  getExamCategories() {
    return [
      { key: 'javascript', value: ExamCategory.JAVASCRIPT, label: 'JavaScript' },
      { key: 'typescript', value: ExamCategory.TYPESCRIPT, label: 'TypeScript' },
      { key: 'react', value: ExamCategory.REACT, label: 'React' },
      { key: 'angular', value: ExamCategory.ANGULAR, label: 'Angular' },
      { key: 'vue', value: ExamCategory.VUE, label: 'Vue' },
      { key: 'html_css', value: ExamCategory.HTML_CSS, label: 'HTML & CSS' },
      { key: 'general', value: ExamCategory.GENERAL, label: 'General' },
    ];
  }
}
