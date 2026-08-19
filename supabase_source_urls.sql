-- Update source_url for all local_curricula records

update local_curricula
set source_url = 'https://nerdc.org.ng'
where country_code = 'NG' and source_url is null;

update local_curricula
set source_url = 'https://www.gov.uk/national-curriculum'
where country_code = 'GB' and source_url is null;

update local_curricula
set source_url = 'https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study'
where country_code = 'GB' and subject_code = 'GB_MATH';

update local_curricula
set source_url = 'https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study'
where country_code = 'GB' and subject_code = 'GB_ENG';

update local_curricula
set source_url = 'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study'
where country_code = 'GB' and subject_code = 'GB_SCI';

update local_curricula
set source_url = 'https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study'
where country_code = 'GB' and subject_code = 'GB_COMP';

update local_curricula
set source_url = 'https://www.gov.uk/government/publications/national-curriculum-in-england-history-programmes-of-study'
where country_code = 'GB' and subject_code = 'GB_HIST';

update local_curricula
set source_url = 'https://www.gov.uk/government/publications/national-curriculum-in-england-geography-programmes-of-study'
where country_code = 'GB' and subject_code = 'GB_GEO';

update local_curricula
set source_url = 'https://www.ges.gov.gh'
where country_code = 'GH' and source_url is null;

update local_curricula
set source_url = 'https://www.ges.gov.gh/curriculum/'
where country_code = 'GH' and subject_code = 'GH_MATH';

update local_curricula
set source_url = 'https://www.ges.gov.gh/curriculum/'
where country_code = 'GH' and subject_code = 'GH_ENG';

update local_curricula
set source_url = 'https://www.ges.gov.gh/curriculum/'
where country_code = 'GH' and subject_code = 'GH_SCI';

update local_curricula
set source_url = 'https://kicd.ac.ke/curriculum-designs/'
where country_code = 'KE' and source_url is null;

update local_curricula
set source_url = 'https://kicd.ac.ke/curriculum-designs/'
where country_code = 'KE' and subject_code = 'KE_MATH';

update local_curricula
set source_url = 'https://kicd.ac.ke/curriculum-designs/'
where country_code = 'KE' and subject_code = 'KE_ENG';

update local_curricula
set source_url = 'https://kicd.ac.ke/curriculum-designs/'
where country_code = 'KE' and subject_code = 'KE_SCI';

update local_curricula
set source_url = 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS).aspx'
where country_code = 'ZA' and source_url is null;

update local_curricula
set source_url = 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS).aspx'
where country_code = 'ZA' and subject_code = 'ZA_MATH';

update local_curricula
set source_url = 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS).aspx'
where country_code = 'ZA' and subject_code = 'ZA_ENG';

update local_curricula
set source_url = 'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements(CAPS).aspx'
where country_code = 'ZA' and subject_code = 'ZA_NS';

update local_curricula
set source_url = 'https://www.australiancurriculum.edu.au'
where country_code = 'AU' and source_url is null;

update local_curricula
set source_url = 'https://v9.australiancurriculum.edu.au/f-10-curriculum/learning-areas/mathematics'
where country_code = 'AU' and subject_code = 'AU_MATH';

update local_curricula
set source_url = 'https://v9.australiancurriculum.edu.au/f-10-curriculum/learning-areas/english'
where country_code = 'AU' and subject_code = 'AU_ENG';

update local_curricula
set source_url = 'https://v9.australiancurriculum.edu.au/f-10-curriculum/learning-areas/science'
where country_code = 'AU' and subject_code = 'AU_SCI';

update local_curricula
set source_url = 'https://www.curriculumonline.ie'
where country_code = 'IE' and source_url is null;

update local_curricula
set source_url = 'https://www.curriculumonline.ie/Primary/Curriculum-Areas/Mathematics/'
where country_code = 'IE' and subject_code = 'IE_MATH';

update local_curricula
set source_url = 'https://www.curriculumonline.ie/Primary/Curriculum-Areas/English/'
where country_code = 'IE' and subject_code = 'IE_ENG';

update local_curricula
set source_url = 'https://www.curriculumonline.ie/Senior-cycle/Senior-Cycle-Subjects/Science/'
where country_code = 'IE' and subject_code = 'IE_SCI';

update local_curricula
set source_url = 'https://ncert.nic.in/textbook.php'
where country_code = 'IN' and source_url is null;

update local_curricula
set source_url = 'https://ncert.nic.in/textbook.php?lemh1=0-14'
where country_code = 'IN' and subject_code = 'IN_MATH';

update local_curricula
set source_url = 'https://ncert.nic.in/textbook.php?lesc1=0-16'
where country_code = 'IN' and subject_code = 'IN_SCI';

update local_curricula
set source_url = 'https://ncert.nic.in/textbook.php?lfhb1=0-7'
where country_code = 'IN' and subject_code = 'IN_ENG';

update local_curricula
set source_url = 'https://www.mext.go.jp/en/policy/education/elsec/title02/detail02/index.htm'
where country_code = 'JP' and source_url is null;

update local_curricula
set source_url = 'https://www.oppekava.ee'
where country_code = 'EE' and source_url is null;

update local_curricula
set source_url = 'https://www.dcp.edu.gov.on.ca/en/'
where country_code = 'CA' and source_url is null;

update local_curricula
set source_url = 'https://www.moe.gov.sg/education-in-sg/educational-stages/primary/curriculum'
where country_code = 'SG' and source_url is null;

update local_curricula
set source_url = 'https://www.moe.gov.sg/primary/curriculum/syllabus'
where country_code = 'SG' and subject_code = 'SG_MATH';

update local_curricula
set source_url = 'https://www.moe.gov.sg/primary/curriculum/syllabus'
where country_code = 'SG' and subject_code = 'SG_ENG';

update local_curricula
set source_url = 'https://www.moe.gov.sg/primary/curriculum/syllabus'
where country_code = 'SG' and subject_code = 'SG_SCI';

update local_curricula
set source_url = 'https://www.oph.fi/en/education-and-qualifications/national-core-curricula'
where country_code = 'FI' and source_url is null;

update local_curricula
set source_url = 'https://www.oph.fi/en/education-and-qualifications/national-core-curricula'
where country_code = 'FI' and subject_code = 'FI_MATH';

update local_curricula
set source_url = 'https://www.oph.fi/en/education-and-qualifications/national-core-curricula'
where country_code = 'FI' and subject_code = 'FI_ENG';

update local_curricula
set source_url = 'https://www.ares-ac.be'
where country_code = 'BE' and source_url is null;

update local_curricula
set source_url = 'https://www.emu.dk/grundskole'
where country_code = 'DK' and source_url is null;

update local_curricula
set source_url = 'https://eduscol.education.fr/programmes'
where country_code = 'FR' and source_url is null;

update local_curricula
set source_url = 'https://www.miur.gov.it/indicazioni-nazionali-e-nuovi-scenari'
where country_code = 'IT' and source_url is null;

update local_curricula
set source_url = 'https://www.slo.nl/sectoren/po/kerndoelen/'
where country_code = 'NL' and source_url is null;

update local_curricula
set source_url = 'https://www.udir.no/lk20/'
where country_code = 'NO' and source_url is null;

update local_curricula
set source_url = 'https://www.dge.mec.pt/programas-e-metas-curriculares'
where country_code = 'PT' and source_url is null;

update local_curricula
set source_url = 'https://www.moehe.gov.qa/en/education/Educational-Stages'
where country_code = 'QA' and source_url is null;

update local_curricula
set source_url = 'https://moe.gov.sa/en/EducationalSystem/Pages/curriculum.aspx'
where country_code = 'SA' and source_url is null;

update local_curricula
set source_url = 'https://www.educacion.gob.es/educabase/menu.do?type=pcaxis&path=/Educacion/Alumnado&file=pcaxis&l=s0'
where country_code = 'ES' and source_url is null;

update local_curricula
set source_url = 'https://www.skolverket.se/undervisning/grundskolan/laroplan-och-kursplaner-for-grundskolan'
where country_code = 'SE' and source_url is null;


-- Verify
select country_code, count(*) as records,
  count(source_url) as with_url
from local_curricula
group by country_code
order by country_code;
