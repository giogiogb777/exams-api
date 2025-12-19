import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TestsService } from './tests.service';
import {
  TestSummaryDto,
  TestDetailDto,
  SubmitTestDto,
  TestResultDto,
} from './tests.dto';

@ApiTags('Tests')
@Controller('tests')
export class TestsController {
  constructor(private testsService: TestsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Get all available tests',
    description: `
      Retrieve a list of all available tests/exams.
      
      Optional Filtering:
      - Use ?active=true to get only active tests (for frontend use)
      - Omit the parameter or use ?active=false to get all tests
      
      Response includes test summaries WITHOUT detailed questions.
      To get full question details, use GET /tests/:id
    `,
  })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description:
      'Filter by active tests. Use true for active tests only, false/omit for all tests',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of test summaries (without questions)',
    type: [TestSummaryDto],
    schema: {
      example: [
        {
          id: 1,
          examName: 'JavaScript Fundamentals Quiz',
          examDuration: 60,
          totalPoint: 100,
          category: 'javascript',
          difficulty: 'medium',
          createdAt: '2025-12-19T20:00:00Z',
          updatedAt: '2025-12-19T20:00:00Z',
        },
        {
          id: 2,
          examName: 'React Advanced Concepts',
          examDuration: 90,
          totalPoint: 150,
          category: 'react',
          difficulty: 'advanced',
          createdAt: '2025-12-19T20:15:00Z',
          updatedAt: '2025-12-19T20:15:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  async getAllTests(@Query('active') active?: string): Promise<TestSummaryDto[]> {
    const activeFlag = active === 'true' ? true : active === 'false' ? false : undefined;
    return this.testsService.getAllTests(activeFlag);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Get full test details with all questions',
    description: `
      Retrieve complete test details including all questions with their answers.
      
      Use this endpoint when:
      1. Starting a test - to get all questions and options
      2. Reviewing test structure before submission
      
      Response includes detailed question data:
      - Question text and category (true_false, single_choice, multiple_choice)
      - Point value for each question
      - Answer options with display text (for choice questions)
      - Correct answer indicator (for scoring purposes)
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the exam/test to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Complete test details with all questions and answers',
    type: TestDetailDto,
    schema: {
      example: {
        id: 1,
        examName: 'JavaScript Fundamentals Quiz',
        examDuration: 60,
        totalPoint: 100,
        category: 'javascript',
        difficulty: 'medium',
        createdAt: '2025-12-19T20:00:00Z',
        updatedAt: '2025-12-19T20:00:00Z',
        questions: [
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
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Test not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Test with ID 999 not found',
      },
    },
  })
  async getTestById(@Param('id') id: string): Promise<TestDetailDto> {
    return this.testsService.getTestById(Number(id));
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Submit test answers and receive scored results',
    description: `
      Submit your answers for a test exam and receive your score immediately.
      
      IMPORTANT NOTES:
      1. The exam ID in the URL must match the examId in the request body
      2. Questions array must contain all questions from the exam
      3. All REQUIRED questions must be answered (answered: true)
      4. For TRUE_FALSE category questions: answered should be true/false
      5. For CHOICE category questions: answered should be true if selected, false if not
      6. The backend calculates the score automatically based on correct answers
      7. Response includes score breakdown and percentage
      
      Example submission for a 3-question exam where questions 0 and 2 are required:
      - Question 0 (true/false, required): Answered true
      - Question 1 (single choice, optional): Not answered (false)
      - Question 2 (multiple choice, required): Answered true
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the exam being submitted',
    example: 1,
  })
  @ApiBody({
    description: 'Test submission with all question answers. All required questions must be answered.',
    type: SubmitTestDto,
    examples: {
      example1: {
        summary: 'Valid submission (all required questions answered)',
        value: {
          examId: 1,
          questions: [
            { questionId: 0, answered: true },
            { questionId: 1, answered: false },
            { questionId: 2, answered: true },
          ],
        },
      },
      example2: {
        summary: 'Invalid submission (missing required question)',
        value: {
          examId: 1,
          questions: [
            { questionId: 0, answered: false },
            { questionId: 1, answered: false },
            { questionId: 2, answered: true },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Test submitted successfully - returns detailed score breakdown',
    type: TestResultDto,
    schema: {
      example: {
        id: 5,
        examId: 1,
        examName: 'JavaScript Fundamentals Quiz',
        userId: 7,
        totalPoint: 100,
        scorePoints: 85,
        percentage: 85.0,
        submittedAnswers: [
          { questionId: 0, answered: true, isCorrect: true },
          { questionId: 1, answered: false, isCorrect: true },
          { questionId: 2, answered: true, isCorrect: false },
        ],
        submittedAt: '2025-12-19T21:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid submission - exam ID mismatch, missing required question, or exam not found',
    schema: {
      examples: {
        missingRequired: {
          value: {
            statusCode: 400,
            message: 'Required question "Is JavaScript a compiled language?" (index 0) was not answered',
          },
        },
        idMismatch: {
          value: {
            statusCode: 400,
            message: 'Exam ID mismatch',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Exam not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Exam with ID 999 not found',
      },
    },
  })
  async submitTest(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() submitTestDto: SubmitTestDto,
  ): Promise<TestResultDto> {
    // Validate exam ID matches URL param
    if (Number(id) !== submitTestDto.examId) {
      throw new Error('Exam ID mismatch');
    }
    return this.testsService.submitTest(user.id, submitTestDto);
  }
}
