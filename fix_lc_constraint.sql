
-- Add unique constraint
alter table local_curricula
add constraint local_curricula_unique
unique (country_code, year_group_code, subject_code);

-- Also check averra_super_curriculum columns
select column_name, data_type
from information_schema.columns
where table_name = 'averra_super_curriculum'
order by ordinal_position;
