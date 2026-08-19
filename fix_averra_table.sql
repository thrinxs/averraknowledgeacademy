
-- Add country_code to averra_super_curriculum
alter table averra_super_curriculum
add column if not exists country_code text references academy_countries(country_code);

-- Add unique constraint to averra_super_curriculum
alter table averra_super_curriculum
add constraint averra_curriculum_unique
unique (country_code, year_group_code, subject_code);
