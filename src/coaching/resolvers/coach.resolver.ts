import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Int, Info } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CoachDto, EditCoachDto } from 'src/coaching/dto/coach.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachService } from 'src/coaching/services/coach.service';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { HistoricalCoacheeData } from 'src/coaching/models/historicalCoacheeData.model';
import { Roles } from 'src/users/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { CoachDashboardData } from 'src/coaching/models/coachDashboardData.model';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';

@Resolver(() => Coach)
@UseGuards(JwtAuthGuard)
export class CoachResolver extends BaseResolver(Coach, {
  create: CoachDto,
  update: EditCoachDto,
}) {
  constructor(
    protected readonly service: CoachService,
    private historicalAssigmentService: HistoricalAssigmentService,
  ) {
    super();
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Query(() => Coach, { name: `findCoachById` })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Coach> {
    return this.service.findOne(id);
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Query(() => Coach, { name: `getCoachProfile` })
  async getCoachProfile(
    @CurrentSession() session: UserSession,
  ): Promise<Coach> {
    console.time('start getCoachProfile');
    const res = this.service.getCoachByUserEmail(session.email);
    console.timeEnd('start getCoachProfile');
    return res;
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Query(() => Coach, { name: `getDinamicCoachProfile` })
  async getDinamicCoachProfile(
    @CurrentSession() session: UserSession,
    @Info() info,
  ): Promise<Coach> {
    console.time('start getDinamicCoachProfile');
    const selections: any[] =
      info.operation.selectionSet.selections[0].selectionSet.selections;
    const fieldsArr: string[] = selections.map((s) => s.name.value);
    const res = this.service.getDinamicCoachByUserEmail(
      session.email,
      fieldsArr,
    );
    console.timeEnd('start getDimanicCoachProfile');
    return res;
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => Coach, { name: `createCoach` })
  async create(
    @Args('data', { type: () => CoachDto }) data: CoachDto,
  ): Promise<Coach> {
    return this.service.create(data);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => [Coach], { name: `createManyCoach` })
  async createMany(
    @Args('data', { type: () => [CoachDto] }) coachData: CoachDto[],
  ): Promise<Coach[]> {
    return this.service.createManyCoach(coachData);
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => Coach, { name: `updateCoach` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => EditCoachDto }) data: EditCoachDto,
  ): Promise<Coach> {
    return this.service.updateCoach(session, data);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => Coach, { name: `updateCoachById` })
  async updateBySuperUser(
    @Args('coachId', { type: () => Int }) coachId: number,
    @Args('data', { type: () => EditCoachDto }) data: EditCoachDto,
  ): Promise<Coach> {
    return this.service.updateCoachById(coachId, data);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => [Coach], { name: `updateManyCoaches` })
  async updateMany(
    @CurrentSession() session: UserSession,
    @Args('coachIds', { type: () => [Int] }) coachIds: number[],
    @Args('data', { type: () => EditCoachDto })
    editCoachDto: EditCoachDto,
  ): Promise<Coach[]> {
    return this.service.updateManyCoaches(session, coachIds, editCoachDto);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => Number, { name: `deleteManyCoaches` })
  async deleteMany(
    @CurrentSession() session: UserSession,
    @Args('coachIds', { type: () => [Int] }) coachIds: number[],
  ): Promise<number> {
    return this.service.deleteManyCoaches(session, coachIds);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => Number, { name: `deleteCoach` })
  async delete(
    @CurrentSession() session: UserSession,
    @Args('coachId', { type: () => Int }) coachId: number,
  ): Promise<number> {
    return this.service.deleteCoach(session, coachId);
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Query(() => HistoricalCoacheeData, { name: `getHistoricalCoacheeData` })
  async getHistoricalCoacheeData(
    @Args('coacheeId', { type: () => Int }) coacheeId: number,
    @CurrentSession() session: UserSession,
  ): Promise<HistoricalCoacheeData> {
    return this.service.getHistoricalCoacheeData(session, coacheeId);
  }

  // query para enviar la data del dashboard del coach
  @UseGuards(RolesGuard(Roles.COACH, Roles.SUPER_USER))
  @Query(() => CoachDashboardData, { name: `getCoachDashboardData` })
  async getCoachDashboardData(
    @CurrentSession() session: UserSession,
  ): Promise<CoachDashboardData> {
    return this.service.getCoachDashboardData(session);
  }

  //query para consultar todos las rows de historial de asignaciones por coachId
  @UseGuards(RolesGuard(Roles.COACH))
  @Query(() => [HistoricalAssigment], {
    name: `getAllHistoricalAssigmentsByCoachId`,
  })
  async getAllHistoricalAssigmentsByCoachId(
    @CurrentSession() session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    return this.historicalAssigmentService.getAllHistoricalAssigmentsByCoachId(
      session,
    );
  }

  //query para consultar todos las rows de historial de asignaciones MAS RECIENTES por coachId
  @UseGuards(RolesGuard(Roles.COACH))
  @Query(() => [HistoricalAssigment], {
    name: `getRecentHistoricalAssigmentsByCoachId`,
  })
  async getRecentHistoricalAssigmentsByCoachId(
    @CurrentSession() session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    return this.historicalAssigmentService.getRecentHistoricalAssigmentByCoachId(
      session,
    );
  }
}
