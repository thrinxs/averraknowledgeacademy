
-- Step 1: Delete subjects linked to old year group codes (null stage)
delete from country_subjects
where year_group_code in (
  select year_group_code 
  from year_group_equivalencies 
  where stage is null
);

-- Step 2: Delete old year group codes
delete from year_group_equivalencies
where stage is null;

-- Step 3: Deactivate countries not in our 13
update academy_countries
set is_active = false
where country_code in ('AE','DE','US');

-- Step 4: Verify what remains
select 
  yg.country_code,
  count(*) as year_group_count,
  sum(case when yg.stage is not null then 1 else 0 end) as with_stage,
  sum(case when yg.stage is null then 1 else 0 end) as without_stage
from year_group_equivalencies yg
group by yg.country_code
order by yg.country_code;
