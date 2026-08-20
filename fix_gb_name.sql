
update academy_countries
set country_name = 'United Kingdom'
where country_code = 'GB';

-- Verify
select country_code, country_name, flag from academy_countries where country_code = 'GB';
