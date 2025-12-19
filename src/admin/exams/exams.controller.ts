import { Controller, Post, Get, Put, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../guards/super-admin.guard';
import { ModeratorGuard } from '../guards/moderator.guard';

@ApiTags('admin / exams')
@Controller('admin/exams')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('jwt')
export class ExamsController {
  constructor(private examsService: ExamsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new exam (Admin only)',
    description: `
      Create a new comprehensive exam with embedded questions.
      
      IMPORTANT VALIDATIONS:
      1. Sum of all question points MUST equal totalPoint
      2. Each question must have an isRequired field (true/false) to indicate if frontend must enforce answering
      3. For TRUE_FALSE category questions:
         - correctAnswer field must be a boolean (true/false)
         - answers array must NOT be provided
      4. For SINGLE_CHOICE and MULTIPLE_CHOICE categories:
         - answers array is REQUIRED
         - At least ONE answer must have isCorrect: true
         - correctAnswer field must NOT be provided
      5. Each question must have a positive point value
      6. Exam must have at least one question
      
      This endpoint is restricted to Admin users only.
      
      Example workflow:
      1. Get question categories from /dictionaries/question-categories
      2. Get difficulty levels from /dictionaries/difficulties
      3. Get exam categories from /dictionaries/exam-categories
      4. Create exam with validated questions and correct total points
    `,
  })
  @ApiBody({
    description: 'Exam creation data with embedded questions',
    schema: {
      example: {
        examName: 'JavaScript Fundamentals Quiz',
        examDuration: 60,
        totalPoint: 100,
        category: 'javascript',
        difficulty: 'medium',
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
              {
                answerDisplayedText: '() => {}',
                isCorrect: true,
              },
              {
                answerDisplayedText: '() -> {}',
                isCorrect: false,
              },
              {
                answerDisplayedText: '() => ;',
                isCorrect: false,
              },
            ],
          },
          {
            questionDisplayName: 'Which of the following are JavaScript data types? (Select all that apply)',
            category: 'multiple_choice',
            point: 70,
            isRequired: false,
            answers: [
              {
                answerDisplayedText: 'String',
                isCorrect: true,
              },
              {
                answerDisplayedText: 'Number',
                isCorrect: true,
              },
              {
                answerDisplayedText: 'Boolean',
                isCorrect: true,
              },
              {
                answerDisplayedText: 'Character',
                isCorrect: false,
              },
            ],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Exam created successfully',
    schema: {
      example: {
        id: 1,
        examName: 'JavaScript Fundamentals Quiz',
        examDuration: 60,
        totalPoint: 100,
        category: 'javascript',
        difficulty: 'medium',
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
              {
                answerDisplayedText: '() => {}',
                isCorrect: true,
              },
              {
                answerDisplayedText: '() -> {}',
                isCorrect: false,
              },
            ],
          },
        ],
        createdAt: '2025-12-19T10:30:00.000Z',
        updatedAt: '2025-12-19T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - Invalid exam or question data',
    schema: {
      example: {
        statusCode: 400,
        message: 'Total points mismatch: Sum of question points (100) must equal totalPoint (120)',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can create exams',
  })
  async createExam(@Body() createExamDto: any) {
    return this.examsService.createExam(createExamDto);
  }

  @Get('list/without-questions')
  @ApiOperation({
    summary: 'Get all exams without questions (SuperAdmin only)',
    description: `
      Retrieve a list of all exams in the system without question details.
      
      Returns exam summaries with basic information (id, name, duration, total points, category, difficulty, etc.) 
      but excludes the questions array to reduce payload size.
      This endpoint is useful for listing exams where question details are not needed.
      This endpoint is restricted to SuperAdmin users only.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'List of all exams retrieved successfully (without questions)',
    schema: {
      example: [
        {
          id: 1,
          examName: 'JavaScript Fundamentals Quiz',
          examDuration: 60,
          totalPoint: 100,
          category: 'javascript',
          difficulty: 'medium',
          isActive: true,
          createdAt: '2025-12-19T10:30:00.000Z',
          updatedAt: '2025-12-19T10:30:00.000Z',
        },
        {
          id: 2,
          examName: 'Python Basics Test',
          examDuration: 45,
          totalPoint: 50,
          category: 'python',
          difficulty: 'easy',
          isActive: true,
          createdAt: '2025-12-19T11:00:00.000Z',
          updatedAt: '2025-12-19T11:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can access this resource',
  })
  async getAllExamsWithoutQuestions() {
    return this.examsService.findAllWithoutQuestions();
  }

  @Get()
  @ApiOperation({
    summary: 'Get all exams (SuperAdmin only)',
    description: `
      Retrieve a list of all exams in the system.
      
      Returns exam summaries with all details including embedded questions.
      This endpoint is restricted to SuperAdmin users only.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'List of all exams retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can access this resource',
  })
  async getAllExams() {
    return this.examsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific exam by ID (SuperAdmin only)',
    description: `
      Retrieve a single exam with all its details and embedded questions.
      
      This endpoint is restricted to SuperAdmin users only.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Exam retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Exam not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can access this resource',
  })
  async getExamById(@Param('id') id: string) {
    return this.examsService.findById(Number(id));
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing exam (SuperAdmin only)',
    description: `
      Update an exam with new data. You can update any field including questions.
      
      IMPORTANT:
      - All validations from exam creation apply to updates
      - Sum of question points must equal totalPoint
      - All category-specific question rules must be followed
      - This endpoint is restricted to SuperAdmin users only
    `,
  })
  @ApiBody({
    description: 'Exam update data (partial updates allowed)',
    schema: {
      example: {
        examName: 'Updated JavaScript Quiz',
        examDuration: 90,
        totalPoint: 100,
        category: 'javascript',
        difficulty: 'hard',
        questions: [
          {
            questionDisplayName: 'Updated question?',
            category: 'true_false',
            point: 100,
            correctAnswer: true,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Exam updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or exam not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can update exams',
  })
  async updateExam(@Param('id') id: string, @Body() updateExamDto: any) {
    return this.examsService.updateExam(Number(id), updateExamDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an exam (SuperAdmin only)',
    description: `
      Delete an exam and all its associated questions permanently.
      
      This action cannot be undone. This endpoint is restricted to SuperAdmin users only.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Exam deleted successfully',
    schema: {
      example: {
        message: 'Exam deleted successfully',
        id: 1,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Exam not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can delete exams',
  })
  async deleteExam(@Param('id') id: string) {
    return this.examsService.deleteExam(Number(id));
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, ModeratorGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Toggle exam active status (Moderator/Admin only)',
    description: `
      Enable or disable an exam. When an exam is inactive, users cannot view or take it.
      
      This endpoint is accessible to:
      - MODERATOR: Can toggle exam status for user-facing availability
      - ADMIN: Can toggle exam status along with managing all exam properties
      
      Use Cases:
      1. Temporarily disable an exam for maintenance
      2. Activate an exam when it's ready for users
      3. Disable an exam at the end of testing period
      4. Manage exam availability without deleting it
      
      The exam isActive status is returned in the response.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Exam active status toggled successfully',
    schema: {
      example: {
        message: 'Exam active status toggled',
        id: 1,
        isActive: false,
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only Moderator or Admin can toggle exam status',
  })
  async toggleExamActive(@Param('id') id: string) {
    return this.examsService.toggleExamActive(Number(id));
  }
}
