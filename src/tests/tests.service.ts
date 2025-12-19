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
    console.log('getAllTests called with active:', active);
    
    let exams = await this.examsRepository.find();
    console.log('All exams from DB:', exams.map(e => ({ id: e.id, name: e.examName, isActive: e.isActive })));

    // Filter by active status if provided (isActive is stored as 1/0 in SQLite)
    if (active !== undefined) {
      exams = exams.filter(exam => !!exam.isActive === active);
      console.log('Filtered exams:', exams.map(e => ({ id: e.id, name: e.examName, isActive: e.isActive })));
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
    // Validate exam exists
    const exam = await this.examsRepository.findOne({ where: { id: submitTestDto.examId } });
    if (!exam) {
      throw new BadRequestException(`Exam with ID ${submitTestDto.examId} not found`);
    }

    // Validate exam ID matches
    if (exam.id !== submitTestDto.examId) {
      throw new BadRequestException('Exam ID mismatch');
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
      if (question.category === QuestionCategoryEnum.TRUE_FALSE) {
        isCorrect = answer.answered === question.correctAnswer;
      } else {
        // For single/multiple choice, we need to match against correct answers
        if (question.answers) {
          const correctAnswers = question.answers.filter((a) => a.isCorrect).length;
          const userCorrectAnswers = question.answers.filter((a) => a.isCorrect && answer.answered).length;
          isCorrect = userCorrectAnswers === correctAnswers && correctAnswers > 0;
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
    submittedAnswers.forEach((answer, index) => {
      if (answer.isCorrect) {
        const question = exam.questions[index];
        scorePoints += question.point;
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
