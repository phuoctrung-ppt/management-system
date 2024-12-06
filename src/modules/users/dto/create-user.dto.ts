import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
  })
  first_name?: string;

  @ApiProperty({
    type: String,
  })
  last_name?: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  password: string;
}
