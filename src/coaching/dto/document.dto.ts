import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { CoachApplication } from 'src/coaching/models/coachApplication.model';
import { Document } from 'src/coaching/models/document.model';
import { getEntity } from 'src/common/functions/getEntity';

export class DocumentDto {
  @IsPositive()
  @IsOptional()
  coachApplicationId?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  file: string;

  public static async from(dto: DocumentDto): Promise<Partial<Document>> {
    const { coachApplicationId, ...documentData } = dto;

    return {
      ...documentData,
      coachApplication: await getEntity(coachApplicationId, CoachApplication),
    };
  }

  public static async fromArray(
    dto: DocumentDto[],
  ): Promise<Partial<Document>[]> {
    return Promise.all(
      dto.map(async (documentDto) => {
        const { coachApplicationId, ...documentData } = documentDto;

        return {
          ...documentData,
          coachApplication: await getEntity(
            coachApplicationId,
            CoachApplication,
          ),
        };
      }),
    );
  }
}
