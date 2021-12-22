import { Identifier, where } from 'sequelize/types';
import { CreateStaffUserDto, CreateUserDto } from '../dto/users.dto';
import { User } from '../models/users.model';

export async function createUser(userData: CreateUserDto, isVerified = false) {
  const user = await User.create({
    ...userData,
    isVerified,
    isStaff: false,
    isSuperuser: false,
  });
  return user;
}

export async function createStaffUser(
  userData: CreateStaffUserDto,
  isVerified = false,
  isSuperuser = false,
) {
  const user = await User.create({
    ...userData,
    isVerified,
    isStaff: true,
    isSuperuser,
  });
  return user;
}

// Add isStaff and isSuperUser false by default
export async function getUsers(where: object) {
  const users = await User.findAll({
    where,
    attributes: [
      'email',
      'Coach',
      'Coachee',
      'Organization',
      'isActive',
      'isStaff',
      'isSuperUser',
    ],
    order: ['email', 'DESC'],
  });
  return users;
}

// Add isStaff and isSuperUser false by default
export async function getUser(pk: Identifier) {
  const user = await User.findByPk(pk);

  if (user === null) {
    console.log('User not Found'); //TODO Add an appropiate return
  }
  return user;
}

export async function deactivateUser(pk: Identifier) {
  const [number, users] = await User.update(
    { isActive: false },
    {
      where: { pk },
    },
  );

  if (number <= 0) {
    console.log('User not Found'); //TODO Add an appropiate return
  }

  return users[0];
}

export async function deleteUser(pk: Identifier) {
  const user = await getUser(pk);
  await user.destroy();
}
