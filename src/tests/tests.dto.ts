import { IQuestion } from '../admin/exams/exam.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TestSummaryDto {
  @ApiProperty({
    description: 'Unique identifier for the exam/test',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the exam',
    example: 'JavaScript Fundamentals Quiz',
  })
  examName: string;

  @ApiProperty({
    description: 'Duration of the exam in minutes',
    example: 60,
  })
  examDuration: number;

  @ApiProperty({
    description: 'Total points available for the exam',
    example: 100,
  })
  totalPoint: number;

  @ApiProperty({
    description: 'Category of the exam',
    example: 1,
  })
  category: number;

  @ApiProperty({
    description: 'Difficulty level of the exam',
    example: 2,
  })
  difficulty: number;

  @ApiProperty({
    description: 'Timestamp when the exam was created',
    example: '2025-12-19T20:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the exam was last updated',
    example: '2025-12-19T20:00:00Z',
  })
  updatedAt: Date;
}

export class TestDetailDto extends TestSummaryDto {
  @ApiProperty({
    description: 'Array of questions in the exam',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        questionDisplayName: { type: 'string' },
        category: { type: 'string' },
        point: { type: 'number' },
        isRequired: { type: 'boolean' },
        correctAnswer: { type: 'boolean' },
        answers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              answerDisplayedText: { type: 'string' },
              isCorrect: { type: 'boolean' },
            },
          },
        },
      },
    },
    example: [
      {
        questionDisplayName: 'Is JavaScript a compiled language?',
        category: 'true_false',
        point: 10,
        isRequired: true,
        correctAnswer: false,
      },
      {
        questionDisplayName: 'What is the correct syntax for arrow function?',
        category: 'single_choice',
        point: 20,
        isRequired: true,
        answers: [
          { answerDisplayedText: '() => {}', isCorrect: true },
          { answerDisplayedText: '-> {}', isCorrect: false },
          { answerDisplayedText: 'function() {}', isCorrect: false },
        ],
      },
    ],
  })
  questions: IQuestion[];
}

export class SubmitTestQuestionDto {
  @ApiProperty({
    description: 'Index of the question in the questions array (0-based)',
    example: 0,
  })
  questionId: number;

  @ApiProperty({
    description:
      'For true/false questions: boolean value. For choice questions: true if selected, false if not',
    example: true,
  })
  answered: boolean;
}

export class SubmitTestDto {
  @ApiProperty({
    description: 'The ID of the exam being submitted',
    example: 1,
  })
  examId: number;

  @ApiProperty({
    description: 'Array of submitted answers for each question',
    type: 'array',
    items: { $ref: '#/components/schemas/SubmitTestQuestionDto' },
    example: [
      { questionId: 0, answered: true },
      { questionId: 1, answered: false },
      { questionId: 2, answered: true },
    ],
  })
  questions: SubmitTestQuestionDto[];
}

export class TestResultAnswerDto {
  @ApiProperty({
    description: 'Index of the question (0-based)',
    example: 0,
  })
  questionId: number;

  @ApiProperty({
    description: 'The user\'s answer (boolean value)',
    example: true,
  })
  answered: boolean;

  @ApiProperty({
    description: 'Whether the answer was correct',
    example: true,
  })
  isCorrect: boolean;
}

export class TestResultDto {
  @ApiProperty({
    description: 'Unique identifier for the test result record',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID of the exam that was taken',
    example: 1,
  })
  examId: number;

  @ApiProperty({
    description: 'Name of the exam',
    example: 'JavaScript Fundamentals Quiz',
  })
  examName: string;

  @ApiProperty({
    description: 'ID of the user who took the exam',
    example: 7,
  })
  userId: number;

  @ApiProperty({
    description: 'Total points possible in the exam',
    example: 100,
  })
  totalPoint: number;

  @ApiProperty({
    description: 'Points scored by the user',
    example: 85,
  })
  scorePoints: number;

  @ApiProperty({
    description: 'Percentage score (0-100)',
    example: 85.5,
  })
  percentage: number;

  @ApiProperty({
    description: 'Details of each submitted answer including correctness',
    type: 'array',
    items: { $ref: '#/components/schemas/TestResultAnswerDto' },
    example: [
      { questionId: 0, answered: true, isCorrect: true },
      { questionId: 1, answered: false, isCorrect: true },
      { questionId: 2, answered: true, isCorrect: false },
    ],
  })
  submittedAnswers: TestResultAnswerDto[];

  @ApiProperty({
    description: 'Timestamp when the test was submitted',
    example: '2025-12-19T21:30:00Z',
  })
  submittedAt: Date;
}
