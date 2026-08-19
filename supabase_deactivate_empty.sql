
-- Deactivate all countries with no year groups or subjects
update academy_countries
set is_active = false
where country_code in ('BE','DK','FR','IT','NL','NO','PT','QA','SA','ES','SE');

-- Confirm what remains active
select country_code, country_name, flag, is_active
from academy_countries
where is_active = true
order by country_name;
