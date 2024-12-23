import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsObject, IsIn, IsInt, IsOptional} from 'class-validator';
import {IsNull} from "typeorm";

export class ConfigDto {

   @IsOptional()
   @IsInt()
   id: number

   @IsOptional()
   @ApiProperty()
   @IsString()
   name: string;

   @ApiProperty()
   @IsObject()
   config: object;

   @IsOptional()
   @ApiProperty()
   @IsString()
   version: string;

}
