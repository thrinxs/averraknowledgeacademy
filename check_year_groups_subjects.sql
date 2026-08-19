
-- Check what year groups exist and which have subjects
select 
  yg.country_code,
  yg.year_group_code,
  yg.year_group_label,
  yg.stage,
  count(cs.id) as subject_count
from year_group_equivalencies yg
left join country_subjects cs 
  on cs.country_code = yg.country_code 
  and cs.year_group_code = yg.year_group_code
group by yg.country_code, yg.year_group_code, yg.year_group_label, yg.stage
order by yg.country_code, yg.year_group_code;
