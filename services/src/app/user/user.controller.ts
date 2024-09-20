import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UserService } from './user.services';
import { UserCreateRequest } from './models/user-create.request';
import { UserIdRequest } from './models/userid.request';
import { UserResponse } from './models/user.response';
import { UserDetailedInfoResponse } from './models/user-detailed-info.response';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/createuser')
  async createUser(@Body() userData: UserCreateRequest): Promise<UserResponse> {
    return this.userService.createUser(userData);
  }

  @Post('/getUsersByUserIds/:userId')
  async getUsersByUserIds(@Body() req:  { userId: number }): Promise<UserDetailedInfoResponse> {
    return this.userService.getUsersByUserIds(req);
  }

  @Post('/deleteuser')
  async deleteUsersByUserIds(
    @Body() req: UserIdRequest
  ): Promise<UserResponse> {
    return this.userService.deleteUsersByUserIds(req);
  }

  @Post('/updateuser/:userId')
  async updateUser(@Body() req: UserCreateRequest): Promise<UserResponse> {
    return this.userService.updateUser(req);
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: number): Promise<UserResponse> {
    return this.userService.getUserById(userId);
  }
}