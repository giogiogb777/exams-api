import { AppDataSource } from './database.config';
import { User, UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedDatabase() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const userRepository = AppDataSource.getRepository(User);

  // Check if users already exist
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('Database already seeded, skipping seed process');
    return;
  }

  // Create premade users
  const users = [
    {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
    },
    {
      username: 'moderator',
      password: await bcrypt.hash('moderator123', 10),
      role: UserRole.MODERATOR,
    },
    {
      username: 'user',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
    },
    {
      username: 'jdoe',
      password: await bcrypt.hash('Aa123123', 10),
      role: UserRole.USER,
    },
  ];

  // Add all students with admin, moderator, and user variants
  const students = [
    'msvanidze',
    'ajijiashvili',
    'bsherazadishvili',
    'dkhoshtaria',
    'gpipia',
    'gburduladze',
    'gvakhtangishvili',
    'gtediashvili',
    'larveladze',
    'msilagava',
    'nsaghliani',
    'nshvangiradze',
    'nmaghaldadze',
    'sgudadze',
    'usephiskveradze',
  ];

  for (const student of students) {
    // Admin variant
    users.push({
      username: `${student}_admin`,
      password: await bcrypt.hash('Aa123123', 10),
      role: UserRole.ADMIN,
    });

    // Moderator variant
    users.push({
      username: `${student}_moderator`,
      password: await bcrypt.hash('Aa123123', 10),
      role: UserRole.MODERATOR,
    });

    // User variant
    users.push({
      username: student,
      password: await bcrypt.hash('Aa123123', 10),
      role: UserRole.USER,
    });
  }

  for (const userData of users) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
  }

  console.log(`Database seeded with ${users.length} users (3 default + 45 student variants)`);
}
