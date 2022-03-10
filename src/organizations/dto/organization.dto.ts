import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { S3BufferDto } from 'src/aws/dto/s3Buffer.dto';
import { getEntity } from 'src/common/functions/getEntity';
import { User } from 'src/users/models/users.model';
import { Organization } from 'src/organizations/models/organization.model';
import { IsPositiveNumberCustomDecorator } from 'src/common/decorators/isPositiveNumber.decorator';

@InputType()
export class OrganizationDto {
  // se debio poner como optional el userId para ser usado en el signUpCoachee
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositiveNumberCustomDecorator()
  userId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  about: string;

  @Field({ nullable: true })
  @IsOptional()
  picture?: S3BufferDto;

  public static async from(dto: OrganizationDto) {
    const { userId, ...organizationData } = dto;
    return {
      ...organizationData,
      owner: dto.userId ? await getEntity(userId, User) : null,
    } as Organization;
  }
}

@InputType()
export class EditOrganizationDto extends PartialType(OrganizationDto) {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  picture?: S3BufferDto;
}
