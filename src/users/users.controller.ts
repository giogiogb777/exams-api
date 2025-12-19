import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserRole } from './user.entity';
import { CurrentUserResponseDto } from './users.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

//   @Post('signup')
//   @ApiOperation({
//     summary: 'Create a new user account',
//     description: `
//       Create a new user account with specified username, password, and role.
      
//       This is a temporary endpoint for testing purposes. In production, user creation would typically be restricted and require admin privileges.
      
//       Available Roles:
//       - 1 = USER (Basic user role - can take tests)
//       - 2 = MODERATOR (Moderator privileges - can manage test results and exam status)
//       - 4 = ADMIN (Administrator privileges - can create and manage exams)
      
//       Username must be unique and is case-sensitive.
//       Password will be hashed using bcrypt for security.
//     `,
//   })
//   @ApiBody({
//     description: 'User account details for signup',
//     schema: {
//       properties: {
//         username: {
//           type: 'string',
//           description: 'Unique username for the new account (case-sensitive)',
//           example: 'john_doe',
//         },
//         password: {
//           type: 'string',
//           description: 'Password for the new account (will be hashed)',
//           example: 'SecurePassword123!',
//         },
//         role: {
//           type: 'number',
//           description:
//             'User role ID. Valid values: 1 (USER), 2 (MODERATOR), 4 (ADMIN)',
//           enum: [1, 2, 4],
//           example: 1,
//         },
//       },
//       required: ['username', 'password', 'role'],
//     },
//   })
//   @ApiResponse({
//     status: 201,
//     description: 'User account created successfully',
//     schema: {
//       example: {
//         id: 5,
//         username: 'john_doe',
//         role: 1,
//         message: 'User created successfully',
//       },
//     },
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Invalid input or username already exists',
//     schema: {
//       example: {
//         statusCode: 400,
//         message: 'Username already exists',
//       },
//     },
//   })
//   async signup(
//     @Body() body: { username: string; password: string; role: number },
//   ) {
//     const role = body.role as UserRole;
//     const user = await this.usersService.create(body.username, body.password, role);
//     return {
//       id: user.id,
//       username: user.username,
//       role: user.role,
//       message: 'User created successfully',
//     };
//   }

//   @Get()
//   @ApiOperation({
//     summary: 'Get all users',
//     description: `
//       Retrieve a list of all user accounts in the system.
      
//       Returns basic user information including ID, username, assigned role, and creation timestamp.
      
//       Role Values:
//       - 1 = USER
//       - 2 = MODERATOR
//       - 4 = ADMIN
//     `,
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'List of all users retrieved successfully',
//     schema: {
//       example: [
//         {
//           id: 1,
//           username: 'admin',
//           role: 4,
//           createdAt: '2025-12-19T10:00:00.000Z',
//         },
//         {
//           id: 2,
//           username: 'moderator',
//           role: 2,
//           createdAt: '2025-12-19T10:01:00.000Z',
//         },
//       ],
//     },
//   })
//   async getAllUsers() {
//     const users = await this.usersService.getAllUsers();
//     return users.map((user) => ({
//       id: user.id,
//       username: user.username,
//       role: user.role,
//       createdAt: user.createdAt,
//     }));
//   }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Get current authenticated user information',
    description: `
      Retrieve the current authenticated user's profile information.
      
      This endpoint requires a valid JWT token in the Authorization header.
      
      Returns the authenticated user's username and role.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved current user information',
    type: CurrentUserResponseDto,
    schema: {
      example: {
        username: 'john_doe',
        role: 1,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  getCurrentUser(@CurrentUser() user: any): CurrentUserResponseDto {
    return {
      username: user.username,
      role: user.role,
    };
  }
}
