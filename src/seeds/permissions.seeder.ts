import { permissions } from '../schema';
import type { SeedDatabase } from './seed-database.type';
import { runSeeder } from './run-seeder';

export const PERMISSION_SEEDS = [
  {
    name: 'conversation.view',
    description: 'Xem conversation và message thuộc khoa.',
  },
  {
    name: 'conversation.reply',
    description: 'Gửi message staff trong conversation thuộc khoa.',
  },
  {
    name: 'conversation.close',
    description: 'Đóng conversation thuộc khoa.',
  },
  {
    name: 'handoff_request.view',
    description: 'Xem handoff request thuộc khoa.',
  },
  {
    name: 'handoff_request.assign',
    description: 'Tiếp nhận hoặc gán handoff request thuộc khoa.',
  },
  {
    name: 'handoff_request.resolve',
    description: 'Cập nhật hoặc resolve handoff request thuộc khoa.',
  },
  {
    name: 'feedback.view',
    description: 'Xem feedback conversation thuộc khoa.',
  },
  {
    name: 'feedback.update',
    description: 'Cập nhật trạng thái review hoặc ignore feedback thuộc khoa.',
  },
  {
    name: 'feedback.resolve',
    description: 'Đánh dấu feedback thuộc khoa đã được xử lý.',
  },
  {
    name: 'chatbot_behavior.view',
    description: 'Xem behavior setting của chatbot thuộc khoa.',
  },
  {
    name: 'chatbot_behavior.update',
    description: 'Cập nhật behavior setting của chatbot thuộc khoa.',
  },
];

export async function seedPermissions(db: SeedDatabase): Promise<void> {
  await db.insert(permissions).values(PERMISSION_SEEDS).onConflictDoNothing();
  console.log(
    `Seeded permissions: ${PERMISSION_SEEDS.map((item) => item.name).join(', ')}`,
  );
}

if (require.main === module) {
  void runSeeder('Permissions', seedPermissions).catch((error) => {
    console.error('Permissions seed failed.');
    console.error(error);
    process.exit(1);
  });
}
