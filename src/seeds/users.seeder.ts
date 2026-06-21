import { inArray } from 'drizzle-orm';
import type { NewUser } from '../schema';
import { facilities, permissions, userPermissions, users } from '../schema';
import { hashPassword } from '../password.util';
import type { SeedDatabase } from './seed-database.type';
import { HOU_FACILITY_SEEDS } from './facilities.seeder';
import { PERMISSION_SEEDS } from './permissions.seeder';
import { runSeeder } from './run-seeder';

const DEFAULT_PASSWORD = process.env.SEED_USER_PASSWORD ?? 'Password@123';
const SEED_EMAIL_DOMAIN = 'hou.edu.vn';

type SeedFacility = Pick<
  typeof facilities.$inferSelect,
  'id' | 'name' | 'code'
>;

export function buildOuUserSeeds(
  seededFacilities: SeedFacility[],
  password: string,
  now = new Date(),
): NewUser[] {
  const usersByFacility = seededFacilities.flatMap((facility, index) => {
    const code = facility.code.toLowerCase();
    const createdAt = new Date(now);
    createdAt.setUTCDate(createdAt.getUTCDate() - index * 2);
    const recentLoginAt = new Date(now);
    recentLoginAt.setUTCDate(recentLoginAt.getUTCDate() - 10);

    return [
      {
        facilityId: facility.id,
        name: `Quản trị ${facility.name}`,
        email: `admin.${code}@${SEED_EMAIL_DOMAIN}`,
        password,
        role: 'facility_admin' as const,
        status: 'active' as const,
        lastLoginAt: now,
        createdAt,
        updatedAt: now,
      },
      {
        facilityId: facility.id,
        name: `Chuyên viên 1 - ${facility.name}`,
        email: `staff01.${code}@${SEED_EMAIL_DOMAIN}`,
        password,
        role: 'facility_staff' as const,
        status: 'active' as const,
        lastLoginAt: recentLoginAt,
        createdAt,
        updatedAt: now,
      },
      {
        facilityId: facility.id,
        name: `Chuyên viên 2 - ${facility.name}`,
        email: `staff02.${code}@${SEED_EMAIL_DOMAIN}`,
        password,
        role: 'facility_staff' as const,
        status: 'active' as const,
        lastLoginAt: null,
        createdAt,
        updatedAt: now,
      },
    ];
  });

  return [
    {
      facilityId: null,
      name: 'OU Super Admin',
      email: `superadmin@${SEED_EMAIL_DOMAIN}`,
      password,
      role: 'super_admin',
      status: 'active',
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    },
    ...usersByFacility,
  ];
}

export async function seedUsers(db: SeedDatabase): Promise<void> {
  const facilityCodes = HOU_FACILITY_SEEDS.map((facility) => facility.code);
  const seededFacilities = await db
    .select({ id: facilities.id, name: facilities.name, code: facilities.code })
    .from(facilities)
    .where(inArray(facilities.code, facilityCodes));

  if (seededFacilities.length !== HOU_FACILITY_SEEDS.length) {
    throw new Error(
      `Expected ${HOU_FACILITY_SEEDS.length} OU facilities before seeding users, found ${seededFacilities.length}.`,
    );
  }

  const password = await hashPassword(DEFAULT_PASSWORD);
  const userSeeds = buildOuUserSeeds(seededFacilities, password);

  for (const user of userSeeds) {
    await db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          facilityId: user.facilityId,
          name: user.name,
          password: user.password,
          role: user.role,
          status: user.status,
          lastLoginAt: user.lastLoginAt,
          updatedAt: new Date(),
        },
      });
  }

  const staffEmails = userSeeds
    .filter((user) => user.role === 'facility_staff')
    .map((user) => user.email);
  const staffUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(inArray(users.email, staffEmails));
  const staffPermissions = await db
    .select({ id: permissions.id })
    .from(permissions)
    .where(
      inArray(
        permissions.name,
        PERMISSION_SEEDS.map((permission) => permission.name),
      ),
    );

  if (staffUsers.length > 0 && staffPermissions.length > 0) {
    await db
      .insert(userPermissions)
      .values(
        staffUsers.flatMap((staff) =>
          staffPermissions.map((permission) => ({
            userId: staff.id,
            permissionId: permission.id,
          })),
        ),
      )
      .onConflictDoNothing();
  }

  console.log(
    `Seeded ${userSeeds.length} users: 1 super admin and 3 users for each OU facility.`,
  );
  console.log(`Super admin: superadmin@${SEED_EMAIL_DOMAIN}`);
  console.log(`Default seed password: ${DEFAULT_PASSWORD}`);
}

if (require.main === module) {
  void runSeeder('Users', seedUsers).catch((error) => {
    console.error('Users seed failed.');
    console.error(error);
    process.exit(1);
  });
}
