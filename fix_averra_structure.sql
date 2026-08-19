
-- Step 1: Drop the old unique constraint that includes country_code
alter table averra_super_curriculum
drop constraint if exists averra_curriculum_unique;

-- Step 2: Make country_code nullable since averra curriculum is not per country
alter table averra_super_curriculum
alter column country_code drop not null;

-- Step 3: Add new unique constraint on year_group_code + subject_code only
alter table averra_super_curriculum
add constraint averra_curriculum_unique_v2
unique (year_group_code, subject_code);

-- Step 4: Verify
select constraint_name, constraint_type
from information_schema.table_constraints
where table_name = 'averra_super_curriculum';
