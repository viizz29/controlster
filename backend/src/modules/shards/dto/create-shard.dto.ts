import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateShardDto {
  @ApiProperty({ example: 'db1.example.com' })
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty({ example: 5432 })
  @IsInt()
  @Min(1)
  @Max(65535)
  port: number;

  @ApiProperty({ example: 'worker' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'secret' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'app_db' })
  @IsString()
  @IsNotEmpty()
  database: string;
}
