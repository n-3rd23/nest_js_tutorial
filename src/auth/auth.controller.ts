import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto';

@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('signup')
  // dto => data transfer objects
  // refer pipes
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }
}
