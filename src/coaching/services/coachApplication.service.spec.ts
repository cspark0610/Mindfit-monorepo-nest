import { Test, TestingModule } from '@nestjs/testing';
import { CoachApplicationService } from 'src/coaching/services/coachApplication.service';
import { CoachApplicationRepository } from 'src/coaching/repositories/coachApplication.repository';
import { DocumentService } from 'src/coaching/services/document.service';
import { CoachApplicationDto } from 'src/coaching/dto/coachApplication.dto';

describe('CoachApplicationService', () => {
  let service: CoachApplicationService;

  const documentMock = {
    id: 1,
    coachApplication: {
      id: 1,
    },
    name: 'TEST_DOCUMENT_NAME',
    type: 'TEST_DOCUMENT_TYPE',
    file: 'TEST_DOCUMENT_FILE',
  };
  const coachApplicationMock = {
    id: 1,
    documents: [{ ...documentMock }, { ...documentMock, id: 2 }] as any,
    coach: {
      id: 1,
    },
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    phoneNumber: 'TEST_PHONE_NUMBER',
    approved: true,
  };
  const coachApplicationDtoMock = {
    coachId: 1,
    documents: [{ ...documentMock }, { ...documentMock, id: 2 }] as any,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    phoneNumber: 'TEST_PHONE_NUMBER',
  };

  const CoachApplicationRepositoryMock = {
    create: jest.fn(),
  };
  const DocumentServiceMock = {
    createMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachApplicationService,
        {
          provide: CoachApplicationRepository,
          useValue: CoachApplicationRepositoryMock,
        },
        {
          provide: DocumentService,
          useValue: DocumentServiceMock,
        },
      ],
    }).compile();

    service = module.get<CoachApplicationService>(CoachApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFullCoachApplication', () => {
    it('should return a coachApplication when validations are passed', async () => {
      const fromSpy = jest
        .spyOn(CoachApplicationDto, 'from')
        .mockImplementation()
        .mockResolvedValue(coachApplicationDtoMock);

      CoachApplicationRepositoryMock.create.mockResolvedValue(
        coachApplicationMock,
      );
      DocumentServiceMock.createMany.mockResolvedValue(
        coachApplicationMock.documents,
      );
      const result = await service.createFullCoachApplication(
        coachApplicationDtoMock,
      );
      expect(fromSpy).toHaveBeenCalled();
      expect(fromSpy).toHaveBeenCalledWith(coachApplicationDtoMock);
      expect(result).toBeDefined();
      expect(result).toEqual(coachApplicationMock);
      expect(result.documents).toBeInstanceOf(Array);
      expect(result.documents.length).toBeGreaterThanOrEqual(0);
    });
  });
});
