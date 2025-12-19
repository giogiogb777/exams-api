import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../admin/exams/exam.entity';
import { TestResult } from './test-result.entity';
import { TestSummaryDto, TestDetailDto, SubmitTestDto, TestResultDto } from './tests.dto';
import { QuestionCategoryEnum } from '../dictionaries/dictionaries.service';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Exam)
    private examsRepository: Repository<Exam>,
    @InjectRepository(TestResult)
    private testResultsRepository: Repository<TestResult>,
  ) {}

  async getAllTests(active?: boolean): Promise<TestSummaryDto[]> {
    let exams = await this.examsRepository.find();

    // Filter by active status if provided (isActive is stored as 1/0 in SQLite)
    if (active !== undefined) {
      exams = exams.filter(exam => !!exam.isActive === active);
    }
    
    return exams.map((exam) => this.mapToTestSummary(exam));
  }

  async getTestById(id: number): Promise<TestDetailDto> {
    const exam = await this.examsRepository.findOne({ where: { id } });
    if (!exam) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }
    return this.mapToTestDetail(exam);
  }

  async submitTest(userId: number, submitTestDto: SubmitTestDto): Promise<TestResultDto> {
    // Validate input
    if (!submitTestDto || !submitTestDto.examId || !submitTestDto.questions) {
      throw new BadRequestException('Invalid submission data');
    }

    // Validate exam exists
    const exam = await this.examsRepository.findOne({ where: { id: submitTestDto.examId } });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${submitTestDto.examId} not found`);
    }

    // Validate all required questions are answered
    const requiredQuestions = exam.questions.filter((q) => q.isRequired);
    for (const requiredQuestion of requiredQuestions) {
      const questionIndex = exam.questions.indexOf(requiredQuestion);
      const submittedAnswer = submitTestDto.questions.find((a) => a.questionId === questionIndex);
      
      if (!submittedAnswer || submittedAnswer.answered === false) {
        throw new BadRequestException(
          `Required question "${requiredQuestion.questionDisplayName}" (index ${questionIndex}) was not answered`,
        );
      }
    }

    // Calculate correct answers
    const submittedAnswers = submitTestDto.questions.map((answer) => {
      const question = exam.questions.find((q, index) => index === answer.questionId);
      if (!question) {
        throw new BadRequestException(`Question with index ${answer.questionId} not found`);
      }

      let isCorrect = false;

      // Check answer based on question category
      const isTrueFalse = question.category === QuestionCategoryEnum.TRUE_FALSE || 
                          (question.category as any) === 'true_false';
      
      if (isTrueFalse) {
        // For TRUE_FALSE: answered should match correctAnswer
        isCorrect = answer.answered === question.correctAnswer;
      } else {
        // For SINGLE_CHOICE and MULTIPLE_CHOICE:
        // answered=true means user selected this answer
        // We need to check if user's selection matches what's correct
        // This logic needs to be on the client side - they send selected answer indices
        // For now, we'll mark as correct if answered matches any correct answer
        if (question.answers && question.answers.length > 0) {
          // Check if any correct answer was selected
          isCorrect = question.answers.some((a) => a.isCorrect && answer.answered);
        }
      }

      return {
        questionId: answer.questionId,
        answered: answer.answered,
        isCorrect,
      };
    });

    // Calculate score
    let scorePoints = 0;
    submittedAnswers.forEach((answer) => {
      if (answer.isCorrect) {
        const question = exam.questions[answer.questionId];
        if (question) {
          scorePoints += question.point;
        }
      }
    });

    // Save result
    const testResult = this.testResultsRepository.create({
      examId: exam.id,
      userId,
      totalPoint: exam.totalPoint,
      scorePoints,
      submittedAnswers,
    });

    const savedResult = await this.testResultsRepository.save(testResult);

    return this.mapToTestResultDto(savedResult, exam.examName);
  }

  private mapToTestSummary(exam: Exam): TestSummaryDto {
    return {
      id: exam.id,
      examName: exam.examName,
      examDuration: exam.examDuration,
      totalPoint: exam.totalPoint,
      category: exam.category,
      difficulty: exam.difficulty,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    };
  }

  private mapToTestDetail(exam: Exam): TestDetailDto {
    return {
      id: exam.id,
      examName: exam.examName,
      examDuration: exam.examDuration,
      totalPoint: exam.totalPoint,
      category: exam.category,
      difficulty: exam.difficulty,
      questions: exam.questions,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    };
  }

  private mapToTestResultDto(result: TestResult, examName: string): TestResultDto {
    const percentage = (result.scorePoints / result.totalPoint) * 100;
    return {
      id: result.id,
      examId: result.examId,
      examName,
      userId: result.userId,
      totalPoint: result.totalPoint,
      scorePoints: result.scorePoints,
      percentage: Math.round(percentage * 100) / 100,
      submittedAnswers: result.submittedAnswers,
      submittedAt: result.submittedAt,
    };
  }
}
