import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ModeratorGuard } from '../guards/moderator.guard';
import { ResultsService } from './results.service';

@ApiTags('admin / results')
@Controller('admin/results')
@UseGuards(JwtAuthGuard, ModeratorGuard)
@ApiBearerAuth('jwt')
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all test results (Moderator/Admin only)',
    description: `
      Retrieve all test results submitted by users.
      
      This endpoint is accessible to:
      - MODERATOR: Can view, filter, and manage test results
      - ADMIN: Can view and manage all test results and exams
      
      Returns a comprehensive list of all test submissions with:
      - User information
      - Exam details
      - Score and percentage
      - Submission timestamp
      - All submitted answers
      
      Useful for:
      1. Monitoring test completion rates
      2. Identifying problematic questions
      3. Analyzing student performance
      4. Clearing invalid test results
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'List of all test results',
    schema: {
      example: [
        {
          id: 1,
          examId: 1,
          examName: 'JavaScript Fundamentals Quiz',
          userId: 7,
          totalPoint: 100,
          scorePoints: 85,
          percentage: 85.0,
          submittedAnswers: [
            { questionId: 0, answered: true, isCorrect: true },
            { questionId: 1, answered: false, isCorrect: true },
          ],
          submittedAt: '2025-12-19T21:30:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only Moderator or Admin can access this resource',
  })
  async getAllResults() {
    return this.resultsService.findAll();
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Clear a specific test result (Moderator/Admin only)',
    description: `
      Delete a specific test result record. This is useful for:
      1. Removing test submissions with invalid data
      2. Re-testing a user after technical issues
      3. Clearing test attempts when user was not ready
      4. Administrative cleanup of test data
      
      This action cannot be undone. Use with caution.
      
      This endpoint is accessible to:
      - MODERATOR: Can delete test results
      - ADMIN: Can delete any test results
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the test result to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Test result deleted successfully',
    schema: {
      example: {
        message: 'Test result deleted successfully',
        id: 1,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Test result not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Test result with ID 999 not found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only Moderator or Admin can access this resource',
  })
  async deleteResult(@Param('id') id: string) {
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      throw new Error('Invalid result ID');
    }
    return this.resultsService.deleteResult(numId);
  }
}
