
-- Add official_curriculum_url column to academy_countries
alter table academy_countries
add column if not exists official_curriculum_url text;

-- Update all 24 countries
update academy_countries set official_curriculum_url = 'https://nerdc.org.ng' where country_code = 'NG';
update academy_countries set official_curriculum_url = 'https://www.gov.uk/national-curriculum' where country_code = 'GB';
update academy_countries set official_curriculum_url = 'https://www.mext.go.jp/en/policy/education/elsec/title02/detail02/index.htm' where country_code = 'JP';
update academy_countries set official_curriculum_url = 'https://www.oppekava.ee' where country_code = 'EE';
update academy_countries set official_curriculum_url = 'https://www.dcp.edu.gov.on.ca/en/' where country_code = 'CA';
update academy_countries set official_curriculum_url = 'https://www.moe.gov.sg/education-in-sg/educational-stages/primary/curriculum' where country_code = 'SG';
update academy_countries set official_curriculum_url = 'https://www.oph.fi/en/education-and-qualifications/national-core-curricula' where country_code = 'FI';
update academy_countries set official_curriculum_url = 'https://www.ges.gov.gh/curriculum/' where country_code = 'GH';
update academy_countries set official_curriculum_url = 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS).aspx' where country_code = 'ZA';
update academy_countries set official_curriculum_url = 'https://kicd.ac.ke/curriculum-designs/' where country_code = 'KE';
update academy_countries set official_curriculum_url = 'https://v9.australiancurriculum.edu.au' where country_code = 'AU';
update academy_countries set official_curriculum_url = 'https://www.curriculumonline.ie' where country_code = 'IE';
update academy_countries set official_curriculum_url = 'https://ncert.nic.in/textbook.php' where country_code = 'IN';
update academy_countries set official_curriculum_url = 'https://www.ares-ac.be' where country_code = 'BE';
update academy_countries set official_curriculum_url = 'https://www.emu.dk/grundskole' where country_code = 'DK';
update academy_countries set official_curriculum_url = 'https://eduscol.education.fr/programmes' where country_code = 'FR';
update academy_countries set official_curriculum_url = 'https://www.miur.gov.it/indicazioni-nazionali-e-nuovi-scenari' where country_code = 'IT';
update academy_countries set official_curriculum_url = 'https://www.slo.nl/sectoren/po/kerndoelen/' where country_code = 'NL';
update academy_countries set official_curriculum_url = 'https://www.udir.no/lk20/' where country_code = 'NO';
update academy_countries set official_curriculum_url = 'https://www.dge.mec.pt/programas-e-metas-curriculares' where country_code = 'PT';
update academy_countries set official_curriculum_url = 'https://www.moehe.gov.qa/en/education/Educational-Stages' where country_code = 'QA';
update academy_countries set official_curriculum_url = 'https://moe.gov.sa/en/EducationalSystem/Pages/curriculum.aspx' where country_code = 'SA';
update academy_countries set official_curriculum_url = 'https://www.educacion.gob.es' where country_code = 'ES';
update academy_countries set official_curriculum_url = 'https://www.skolverket.se/undervisning/grundskolan/laroplan-och-kursplaner-for-grundskolan' where country_code = 'SE';

-- Verify
select country_code, country_name, official_curriculum_url
from academy_countries
where is_active = true
order by country_name;
