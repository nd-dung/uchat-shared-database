import { HOU_FACILITY_SEEDS } from './facilities.seeder';
import { buildOuUserSeeds } from './users.seeder';

describe('OU database seeds', () => {
  it('contains the 13 faculties listed by Ho Chi Minh City Open University', () => {
    expect(HOU_FACILITY_SEEDS).toHaveLength(13);
    expect(
      new Set(HOU_FACILITY_SEEDS.map((facility) => facility.code)).size,
    ).toBe(13);
    expect(
      new Set(HOU_FACILITY_SEEDS.map((facility) => facility.slug)).size,
    ).toBe(13);
    expect(HOU_FACILITY_SEEDS.map((facility) => facility.code)).toEqual([
      'SDH',
      'DTDB',
      'CNSH',
      'CNTT',
      'KTKT',
      'LUAT',
      'KTQLC',
      'NN',
      'QTKD',
      'TCNH',
      'XD',
      'KHXH',
      'KHCB',
    ]);
  });

  it('builds one super admin and three users per faculty', () => {
    const now = new Date('2026-06-13T00:00:00.000Z');
    const facilities = HOU_FACILITY_SEEDS.map((facility, index) => ({
      id: index + 1,
      name: facility.name,
      code: facility.code,
    }));
    const userSeeds = buildOuUserSeeds(facilities, 'hashed-password', now);

    expect(userSeeds).toHaveLength(40);
    expect(
      userSeeds.filter((user) => user.role === 'super_admin'),
    ).toHaveLength(1);
    expect(
      userSeeds.filter((user) => user.role === 'facility_admin'),
    ).toHaveLength(13);
    expect(
      userSeeds.filter((user) => user.role === 'facility_staff'),
    ).toHaveLength(26);
    expect(new Set(userSeeds.map((user) => user.email)).size).toBe(40);

    for (const facility of facilities) {
      expect(
        userSeeds.filter((user) => user.facilityId === facility.id),
      ).toHaveLength(3);
    }
  });

  it('creates predictable seed credentials and login activity data', () => {
    const now = new Date('2026-06-13T00:00:00.000Z');
    const [facility] = HOU_FACILITY_SEEDS;
    const userSeeds = buildOuUserSeeds(
      [{ id: 1, name: facility.name, code: facility.code }],
      'hashed-password',
      now,
    );

    expect(userSeeds.map((user) => user.email)).toEqual([
      'superadmin@hou.edu.vn',
      'admin.sdh@hou.edu.vn',
      'staff01.sdh@hou.edu.vn',
      'staff02.sdh@hou.edu.vn',
    ]);
    expect(userSeeds[1].lastLoginAt).toEqual(now);
    expect(userSeeds[2].lastLoginAt).toEqual(
      new Date('2026-06-03T00:00:00.000Z'),
    );
    expect(userSeeds[3].lastLoginAt).toBeNull();
  });
});
