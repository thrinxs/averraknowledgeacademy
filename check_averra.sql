
-- Check current state of averra_super_curriculum
select count(*) as total_rows from averra_super_curriculum;

-- Check unique constraints
select constraint_name from information_schema.table_constraints
where table_name = 'averra_super_curriculum';
