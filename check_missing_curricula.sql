
-- Find all country + year_group + subject combinations
-- that exist in country_subjects but have NO local_curricula record
select 
  cs.country_code,
  ac.country_name,
  cs.year_group_code,
  yg.year_group_label,
  yg.stage,
  cs.subject_code,
  cs.subject_name,
  cs.averra_teaches
from country_subjects cs
join academy_countries ac on ac.country_code = cs.country_code
join year_group_equivalencies yg 
  on yg.country_code = cs.country_code 
  and yg.year_group_code = cs.year_group_code
left join local_curricula lc 
  on lc.country_code = cs.country_code 
  and lc.year_group_code = cs.year_group_code 
  and lc.subject_code = cs.subject_code
where ac.is_active = true
  and lc.id is null
order by ac.country_name, yg.sort_order, cs.subject_name;
