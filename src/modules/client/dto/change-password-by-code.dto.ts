import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNumberString, IsString } from 'class-validator';
import { ToLowerCase, Trim } from 'src/shares/decorators/transforms.decorator';

export class ChangePasswordByCodeDto {
  @ApiProperty({
    required: true,
    example: 'jonh@gmail.com',
  })
  @IsDefined()
  @Trim()
  @ToLowerCase()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @IsDefined()
  @IsNumberString()
  verifyCode: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @IsDefined()
  @IsString()
  password: string;
}

export default ChangePasswordByCodeDto;
