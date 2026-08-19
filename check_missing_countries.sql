
-- Find all active countries and their year group + subject status
select 
  ac.country_code,
  ac.country_name,
  ac.flag,
  ac.is_active,
  count(distinct yg.year_group_code) as year_group_count,
  count(distinct cs.id) as subject_count
from academy_countries ac
left join year_group_equivalencies yg on yg.country_code = ac.country_code
left join country_subjects cs on cs.country_code = ac.country_code
where ac.is_active = true
group by ac.country_code, ac.country_name, ac.flag, ac.is_active
order by year_group_count asc, ac.country_name;
