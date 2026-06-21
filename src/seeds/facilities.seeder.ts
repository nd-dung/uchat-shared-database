import { eq } from 'drizzle-orm';
import { facilities } from '../schema';
import type { SeedDatabase } from './seed-database.type';
import { runSeeder } from './run-seeder';

// Source: https://ou.edu.vn/ - mục "Khoa - Ban", accessed 2026-06-13.
export const HOU_FACILITY_SEEDS = [
  {
    name: 'Khoa Đào tạo Sau đại học',
    code: 'SDH',
    slug: 'khoa-dao-tao-sau-dai-hoc',
    description: 'Khoa Đào tạo Sau đại học, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Đào tạo Đặc biệt',
    code: 'DTDB',
    slug: 'khoa-dao-tao-dac-biet',
    description: 'Khoa Đào tạo Đặc biệt, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Công nghệ Sinh học',
    code: 'CNSH',
    slug: 'khoa-cong-nghe-sinh-hoc',
    description: 'Khoa Công nghệ Sinh học, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Công nghệ Thông tin',
    code: 'CNTT',
    slug: 'khoa-cong-nghe-thong-tin',
    description: 'Khoa Công nghệ Thông tin, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Kế toán - Kiểm toán',
    code: 'KTKT',
    slug: 'khoa-ke-toan-kiem-toan',
    description: 'Khoa Kế toán - Kiểm toán, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Luật',
    code: 'LUAT',
    slug: 'khoa-luat',
    description: 'Khoa Luật, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Kinh tế và Quản lý công',
    code: 'KTQLC',
    slug: 'khoa-kinh-te-va-quan-ly-cong',
    description: 'Khoa Kinh tế và Quản lý công, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Ngoại ngữ',
    code: 'NN',
    slug: 'khoa-ngoai-ngu',
    description: 'Khoa Ngoại ngữ, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Quản trị Kinh doanh',
    code: 'QTKD',
    slug: 'khoa-quan-tri-kinh-doanh',
    description: 'Khoa Quản trị Kinh doanh, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Tài chính - Ngân hàng',
    code: 'TCNH',
    slug: 'khoa-tai-chinh-ngan-hang',
    description: 'Khoa Tài chính - Ngân hàng, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Xây dựng',
    code: 'XD',
    slug: 'khoa-xay-dung',
    description: 'Khoa Xây dựng, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Khoa học Xã hội',
    code: 'KHXH',
    slug: 'khoa-khoa-hoc-xa-hoi',
    description: 'Khoa Khoa học Xã hội, Trường Đại học Mở     ',
  },
  {
    name: 'Khoa Khoa học Cơ bản',
    code: 'KHCB',
    slug: 'khoa-khoa-hoc-co-ban',
    description: 'Khoa Khoa học Cơ bản, Trường Đại học Mở     ',
  },
] as const;

export async function seedFacilities(db: SeedDatabase): Promise<void> {
  const [legacyComputerScienceFacility] = await db
    .select({ id: facilities.id })
    .from(facilities)
    .where(eq(facilities.code, 'KHMT'))
    .limit(1);
  const [basicSciencesFacility] = await db
    .select({ id: facilities.id })
    .from(facilities)
    .where(eq(facilities.code, 'KHCB'))
    .limit(1);

  if (legacyComputerScienceFacility && !basicSciencesFacility) {
    const basicSciencesSeed = HOU_FACILITY_SEEDS.find(
      (facility) => facility.code === 'KHCB',
    )!;
    await db
      .update(facilities)
      .set({
        ...basicSciencesSeed,
        status: 'active',
        updatedAt: new Date(),
      })
      .where(eq(facilities.id, legacyComputerScienceFacility.id));
  }

  for (const facility of HOU_FACILITY_SEEDS) {
    await db
      .insert(facilities)
      .values({ ...facility, status: 'active' })
      .onConflictDoUpdate({
        target: facilities.code,
        set: {
          name: facility.name,
          slug: facility.slug,
          description: facility.description,
          status: 'active',
          updatedAt: new Date(),
        },
      });
  }

  console.log(
    `Seeded ${HOU_FACILITY_SEEDS.length} OU facilities: ${HOU_FACILITY_SEEDS.map((item) => item.code).join(', ')}`,
  );
}

if (require.main === module) {
  void runSeeder('Facilities', seedFacilities).catch((error) => {
    console.error('Facilities seed failed.');
    console.error(error);
    process.exit(1);
  });
}
