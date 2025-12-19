import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User Login - Authenticate and get JWT token',
    description: `
      Authenticate a user with their username and password credentials.
      
      This endpoint validates the provided credentials against the user database and returns a JWT access token if authentication is successful.
      
      The returned JWT token can be used to authenticate subsequent API requests by including it in the Authorization header as a Bearer token.
      
      Token Details:
      - Expires in 24 hours
      - Contains user information: username, user ID, and role
      - Used for protected endpoint access
      
      Pre-made test users available:
      - Default accounts: admin (password: admin123), moderator (password: moderator123), user (password: user123)
      - Additional user: jdoe (password: Aa123123)
      - Student accounts (15 students × 3 variants each):
        * [student_name] (USER role, password: Aa123123)
        * [student_name]_admin (ADMIN role, password: Aa123123)
        * [student_name]_moderator (MODERATOR role, password: Aa123123)
      
      Example student usernames: msvanidze, ajijiashvili, bsherazadishvili, dkhoshtaria, gpipia, gburduladze, gvakhtangishvili, gtediashvili, larveladze, msilagava, nsaghliani, nshvangiradze, nmaghaldadze, sgudadze, usephiskveradze
    `,
  })
  @ApiBody({
    description: 'User login credentials',
    schema: {
      properties: {
        username: {
          type: 'string',
          description: 'The username of the user account',
          example: 'admin',
        },
        password: {
          type: 'string',
          description: 'The password of the user account',
          example: 'admin123',
        },
      },
      required: ['username', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful - JWT token returned',
    schema: {
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT Bearer token for authenticating future requests. Valid for 24 hours.',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJyb2xlIjo0LCJpYXQiOjE3MzQ2Mjg4MzUsImV4cCI6MTczNDcxNTIzNX0.xyz...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed - Invalid username or password',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
      },
    },
  })
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'User Logout - Invalidate JWT token',
    description: `
      Logout the currently authenticated user by invalidating their JWT token.
      
      This endpoint requires a valid JWT Bearer token in the Authorization header.
      
      Upon successful logout:
      - The token is invalidated (in production, added to a blacklist)
      - User session is terminated
      - Subsequent requests with this token will be rejected
      
      To use this endpoint, include the Authorization header:
      Authorization: Bearer <your_jwt_token>
      
      The token can be obtained from the login endpoint.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
    schema: {
      example: {
        message: 'Successfully logged out',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid or expired token',
      },
    },
  })
  async logout(@Request() req: any) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    return this.authService.logout(token);
  }
}
