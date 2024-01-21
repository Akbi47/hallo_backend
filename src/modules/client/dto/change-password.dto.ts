import { IsDefined, IsEmail, IsString } from 'class-validator';
import { ToLowerCase, Trim } from 'src/shares/decorators/transforms.decorator';

export class ChangePasswordDto {
  @IsDefined()
  @Trim()
  @ToLowerCase()
  @IsEmail()
  @IsString()
  email: string;

  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsString()
  newPassword: string;
}

export default ChangePasswordDto;
