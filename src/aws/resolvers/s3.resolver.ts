import { UseGuards } from '@nestjs/common';
import { Resolver, Args, Query } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { S3UploadSignedUrlDto } from 'src/aws/dto/s3UploadSignedUrl.dto';
import { AwsS3Service } from 'src/aws/services/s3.service';

@Resolver()
export class AwsS3Resolver {
  constructor(private awsS3Service: AwsS3Service) {}

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async getUploadSignedUrl(
    @Args('data', { type: () => S3UploadSignedUrlDto })
    data: S3UploadSignedUrlDto,
  ): Promise<string> {
    return this.awsS3Service.getUploadSignedUrl(data);
  }
}
