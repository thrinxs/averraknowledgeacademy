
-- ─────────────────────────────────────────────
-- ACTIVATE ALL 11 COUNTRIES
-- ─────────────────────────────────────────────
update academy_countries set is_active = true
where country_code in ('BE','DK','FR','IT','NL','NO','PT','QA','SA','ES','SE');

-- Update curriculum info for each
update academy_countries set
  curriculum_name = 'Belgian Core Curriculum',
  curriculum_authority = 'ARES / GO! / VLOR',
  year_group_system = 'Grade 1-6 Primary, Grade 1-6 Secondary',
  currency = 'EUR', language = 'French / Dutch',
  exam_system = ARRAY['CEB','CESS','CE6']
where country_code = 'BE';

update academy_countries set
  curriculum_name = 'Danish Folkeskole Curriculum',
  curriculum_authority = 'Ministry of Children and Education',
  year_group_system = 'Grade 0-9 Folkeskole, Grade 10-12 Gymnasium',
  currency = 'DKK', language = 'Danish',
  exam_system = ARRAY['Folkeskolens Afgangseksamen','Studentereksamen']
where country_code = 'DK';

update academy_countries set
  curriculum_name = 'French National Curriculum',
  curriculum_authority = 'Ministere de l Education Nationale',
  year_group_system = 'CP-CM2 Primary, 6eme-3eme College, 2nde-Terminale Lycee',
  currency = 'EUR', language = 'French',
  exam_system = ARRAY['Brevet','Baccalaureat']
where country_code = 'FR';

update academy_countries set
  curriculum_name = 'Italian National Curriculum',
  curriculum_authority = 'MIUR / Ministry of Education',
  year_group_system = 'Classe 1-5 Primary, Classe 1-3 Media, Anno 1-5 Liceo',
  currency = 'EUR', language = 'Italian',
  exam_system = ARRAY['Esame di Stato (Maturita)']
where country_code = 'IT';

update academy_countries set
  curriculum_name = 'Dutch National Curriculum',
  curriculum_authority = 'Ministry of Education (OCW)',
  year_group_system = 'Groep 1-8 Primary, VMBO/HAVO/VWO Secondary',
  currency = 'EUR', language = 'Dutch',
  exam_system = ARRAY['VMBO','HAVO','VWO Eindexamen']
where country_code = 'NL';

update academy_countries set
  curriculum_name = 'Norwegian Kunnskapsloftet Curriculum',
  curriculum_authority = 'Utdanningsdirektoratet (Udir)',
  year_group_system = 'Grade 1-7 Primary, Grade 8-10 Secondary, VG1-VG3 Upper Secondary',
  currency = 'NOK', language = 'Norwegian',
  exam_system = ARRAY['Vitnemal','Studenteksamen']
where country_code = 'NO';

update academy_countries set
  curriculum_name = 'Portuguese National Curriculum',
  curriculum_authority = 'Ministerio da Educacao / IAVE',
  year_group_system = '1-4 Primary, 5-6 / 7-9 Secondary, 10-12 Upper Secondary',
  currency = 'EUR', language = 'Portuguese',
  exam_system = ARRAY['Exames Nacionais','Provas de Aferimento']
where country_code = 'PT';

update academy_countries set
  curriculum_name = 'Qatar National Curriculum Framework',
  curriculum_authority = 'Ministry of Education and Higher Education',
  year_group_system = 'Grade 1-6 Primary, Grade 7-9 Preparatory, Grade 10-12 Secondary',
  currency = 'QAR', language = 'Arabic / English',
  exam_system = ARRAY['Qatar General Secondary Education Certificate']
where country_code = 'QA';

update academy_countries set
  curriculum_name = 'Saudi Arabian National Curriculum',
  curriculum_authority = 'Ministry of Education (MoE)',
  year_group_system = 'Grade 1-6 Primary, Grade 7-9 Middle, Grade 10-12 Secondary',
  currency = 'SAR', language = 'Arabic',
  exam_system = ARRAY['General Secondary Education Certificate (Tawjihi)']
where country_code = 'SA';

update academy_countries set
  curriculum_name = 'Spanish National Curriculum (LOMLOE)',
  curriculum_authority = 'Ministerio de Educacion y FP',
  year_group_system = 'Curso 1-6 Primary, ESO Curso 1-4, Bachillerato Curso 1-2',
  currency = 'EUR', language = 'Spanish',
  exam_system = ARRAY['EBAU','Selectividad']
where country_code = 'ES';

update academy_countries set
  curriculum_name = 'Swedish Laroplan (Lgr22)',
  curriculum_authority = 'Skolverket',
  year_group_system = 'Grade 1-9 Grundskola, Year 1-3 Gymnasiet',
  currency = 'SEK', language = 'Swedish',
  exam_system = ARRAY['Studentexamen','Nationella Prov']
where country_code = 'SE';

-- ─────────────────────────────────────────────
-- YEAR GROUPS
-- ─────────────────────────────────────────────

-- BELGIUM
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('BE','BE_P1','Grade 1 (Primary)','primary',6,7,'Year 1',1),
('BE','BE_P2','Grade 2 (Primary)','primary',7,8,'Year 2',2),
('BE','BE_P3','Grade 3 (Primary)','primary',8,9,'Year 3',3),
('BE','BE_P4','Grade 4 (Primary)','primary',9,10,'Year 4',4),
('BE','BE_P5','Grade 5 (Primary)','primary',10,11,'Year 5',5),
('BE','BE_P6','Grade 6 (Primary)','primary',11,12,'Year 6',6),
('BE','BE_S1','Grade 1 (Secondary)','junior_secondary',12,13,'Year 7',7),
('BE','BE_S2','Grade 2 (Secondary)','junior_secondary',13,14,'Year 8',8),
('BE','BE_S3','Grade 3 (Secondary)','junior_secondary',14,15,'Year 9',9),
('BE','BE_S4','Grade 4 (Secondary)','senior_secondary',15,16,'Year 10',10),
('BE','BE_S5','Grade 5 (Secondary)','senior_secondary',16,17,'Year 11',11),
('BE','BE_S6','Grade 6 (Secondary)','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- DENMARK
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('DK','DK_G1','Grade 1 (Folkeskole)','primary',6,7,'Year 1',1),
('DK','DK_G2','Grade 2 (Folkeskole)','primary',7,8,'Year 2',2),
('DK','DK_G3','Grade 3 (Folkeskole)','primary',8,9,'Year 3',3),
('DK','DK_G4','Grade 4 (Folkeskole)','primary',9,10,'Year 4',4),
('DK','DK_G5','Grade 5 (Folkeskole)','primary',10,11,'Year 5',5),
('DK','DK_G6','Grade 6 (Folkeskole)','primary',11,12,'Year 6',6),
('DK','DK_G7','Grade 7 (Folkeskole)','junior_secondary',12,13,'Year 7',7),
('DK','DK_G8','Grade 8 (Folkeskole)','junior_secondary',13,14,'Year 8',8),
('DK','DK_G9','Grade 9 (Folkeskole)','junior_secondary',14,15,'Year 9',9),
('DK','DK_G10','Grade 10 (Gymnasium Year 1)','senior_secondary',15,16,'Year 10',10),
('DK','DK_G11','Grade 11 (Gymnasium Year 2)','senior_secondary',16,17,'Year 11',11),
('DK','DK_G12','Grade 12 (Gymnasium Year 3)','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- FRANCE
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('FR','FR_CP','CP (Cours Preparatoire)','primary',6,7,'Year 1',1),
('FR','FR_CE1','CE1 (Cours Elementaire 1)','primary',7,8,'Year 2',2),
('FR','FR_CE2','CE2 (Cours Elementaire 2)','primary',8,9,'Year 3',3),
('FR','FR_CM1','CM1 (Cours Moyen 1)','primary',9,10,'Year 4',4),
('FR','FR_CM2','CM2 (Cours Moyen 2)','primary',10,11,'Year 5',5),
('FR','FR_6','6eme (College Year 1)','junior_secondary',11,12,'Year 6',6),
('FR','FR_5','5eme (College Year 2)','junior_secondary',12,13,'Year 7',7),
('FR','FR_4','4eme (College Year 3)','junior_secondary',13,14,'Year 8',8),
('FR','FR_3','3eme (College Year 4 — Brevet)','junior_secondary',14,15,'Year 9',9),
('FR','FR_2','Seconde (Lycee Year 1)','senior_secondary',15,16,'Year 10',10),
('FR','FR_1','Premiere (Lycee Year 2)','senior_secondary',16,17,'Year 11',11),
('FR','FR_T','Terminale (Baccalaureat)','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- ITALY
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('IT','IT_P1','Classe 1 (Primary)','primary',6,7,'Year 1',1),
('IT','IT_P2','Classe 2 (Primary)','primary',7,8,'Year 2',2),
('IT','IT_P3','Classe 3 (Primary)','primary',8,9,'Year 3',3),
('IT','IT_P4','Classe 4 (Primary)','primary',9,10,'Year 4',4),
('IT','IT_P5','Classe 5 (Primary)','primary',10,11,'Year 5',5),
('IT','IT_M1','Classe 1 (Scuola Media)','junior_secondary',11,12,'Year 6',6),
('IT','IT_M2','Classe 2 (Scuola Media)','junior_secondary',12,13,'Year 7',7),
('IT','IT_M3','Classe 3 (Scuola Media — Esame)','junior_secondary',13,14,'Year 8',8),
('IT','IT_L1','Anno 1 (Liceo / Istituto)','senior_secondary',14,15,'Year 9',9),
('IT','IT_L2','Anno 2 (Liceo / Istituto)','senior_secondary',15,16,'Year 10',10),
('IT','IT_L3','Anno 3 (Liceo / Istituto)','senior_secondary',16,17,'Year 11',11),
('IT','IT_L4','Anno 4 (Liceo / Istituto)','senior_secondary',17,18,'Year 12',12),
('IT','IT_L5','Anno 5 (Maturita)','senior_secondary',17,19,'Year 13',13)
on conflict (country_code,year_group_code) do nothing;

-- NETHERLANDS
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('NL','NL_G3','Groep 3','primary',6,7,'Year 1',1),
('NL','NL_G4','Groep 4','primary',7,8,'Year 2',2),
('NL','NL_G5','Groep 5','primary',8,9,'Year 3',3),
('NL','NL_G6','Groep 6','primary',9,10,'Year 4',4),
('NL','NL_G7','Groep 7','primary',10,11,'Year 5',5),
('NL','NL_G8','Groep 8','primary',11,12,'Year 6',6),
('NL','NL_S1','Year 1 (Secondary)','junior_secondary',12,13,'Year 7',7),
('NL','NL_S2','Year 2 (Secondary)','junior_secondary',13,14,'Year 8',8),
('NL','NL_S3','Year 3 (Secondary)','junior_secondary',14,15,'Year 9',9),
('NL','NL_S4','Year 4 (Secondary)','senior_secondary',15,16,'Year 10',10),
('NL','NL_S5','Year 5 (HAVO / VWO)','senior_secondary',16,17,'Year 11',11),
('NL','NL_S6','Year 6 (VWO)','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- NORWAY
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('NO','NO_G1','Grade 1 (Barneskole)','primary',6,7,'Year 1',1),
('NO','NO_G2','Grade 2 (Barneskole)','primary',7,8,'Year 2',2),
('NO','NO_G3','Grade 3 (Barneskole)','primary',8,9,'Year 3',3),
('NO','NO_G4','Grade 4 (Barneskole)','primary',9,10,'Year 4',4),
('NO','NO_G5','Grade 5 (Barneskole)','primary',10,11,'Year 5',5),
('NO','NO_G6','Grade 6 (Barneskole)','primary',11,12,'Year 6',6),
('NO','NO_G7','Grade 7 (Barneskole)','primary',12,13,'Year 7',7),
('NO','NO_G8','Grade 8 (Ungdomsskole)','junior_secondary',13,14,'Year 8',8),
('NO','NO_G9','Grade 9 (Ungdomsskole)','junior_secondary',14,15,'Year 9',9),
('NO','NO_G10','Grade 10 (Ungdomsskole)','junior_secondary',15,16,'Year 10',10),
('NO','NO_VG1','VG1 (Videregaende Year 1)','senior_secondary',16,17,'Year 11',11),
('NO','NO_VG2','VG2 (Videregaende Year 2)','senior_secondary',17,18,'Year 12',12),
('NO','NO_VG3','VG3 (Studenteksamen)','senior_secondary',18,19,'Year 13',13)
on conflict (country_code,year_group_code) do nothing;

-- PORTUGAL
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('PT','PT_A1','1.o Ano (Primary)','primary',6,7,'Year 1',1),
('PT','PT_A2','2.o Ano (Primary)','primary',7,8,'Year 2',2),
('PT','PT_A3','3.o Ano (Primary)','primary',8,9,'Year 3',3),
('PT','PT_A4','4.o Ano (Primary)','primary',9,10,'Year 4',4),
('PT','PT_A5','5.o Ano (2.o Ciclo)','junior_secondary',10,11,'Year 5',5),
('PT','PT_A6','6.o Ano (2.o Ciclo)','junior_secondary',11,12,'Year 6',6),
('PT','PT_A7','7.o Ano (3.o Ciclo)','junior_secondary',12,13,'Year 7',7),
('PT','PT_A8','8.o Ano (3.o Ciclo)','junior_secondary',13,14,'Year 8',8),
('PT','PT_A9','9.o Ano (3.o Ciclo)','junior_secondary',14,15,'Year 9',9),
('PT','PT_A10','10.o Ano (Secundario)','senior_secondary',15,16,'Year 10',10),
('PT','PT_A11','11.o Ano (Secundario)','senior_secondary',16,17,'Year 11',11),
('PT','PT_A12','12.o Ano (Exames Nacionais)','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- QATAR
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('QA','QA_G1','Grade 1 (Primary)','primary',6,7,'Year 1',1),
('QA','QA_G2','Grade 2 (Primary)','primary',7,8,'Year 2',2),
('QA','QA_G3','Grade 3 (Primary)','primary',8,9,'Year 3',3),
('QA','QA_G4','Grade 4 (Primary)','primary',9,10,'Year 4',4),
('QA','QA_G5','Grade 5 (Primary)','primary',10,11,'Year 5',5),
('QA','QA_G6','Grade 6 (Primary)','primary',11,12,'Year 6',6),
('QA','QA_G7','Grade 7 (Preparatory)','junior_secondary',12,13,'Year 7',7),
('QA','QA_G8','Grade 8 (Preparatory)','junior_secondary',13,14,'Year 8',8),
('QA','QA_G9','Grade 9 (Preparatory)','junior_secondary',14,15,'Year 9',9),
('QA','QA_G10','Grade 10 (Secondary)','senior_secondary',15,16,'Year 10',10),
('QA','QA_G11','Grade 11 (Secondary)','senior_secondary',16,17,'Year 11',11),
('QA','QA_G12','Grade 12 (Secondary)','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- SAUDI ARABIA
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('SA','SA_G1','Grade 1 (Primary)','primary',6,7,'Year 1',1),
('SA','SA_G2','Grade 2 (Primary)','primary',7,8,'Year 2',2),
('SA','SA_G3','Grade 3 (Primary)','primary',8,9,'Year 3',3),
('SA','SA_G4','Grade 4 (Primary)','primary',9,10,'Year 4',4),
('SA','SA_G5','Grade 5 (Primary)','primary',10,11,'Year 5',5),
('SA','SA_G6','Grade 6 (Primary)','primary',11,12,'Year 6',6),
('SA','SA_G7','Grade 7 (Middle)','junior_secondary',12,13,'Year 7',7),
('SA','SA_G8','Grade 8 (Middle)','junior_secondary',13,14,'Year 8',8),
('SA','SA_G9','Grade 9 (Middle)','junior_secondary',14,15,'Year 9',9),
('SA','SA_G10','Grade 10 (Secondary)','senior_secondary',15,16,'Year 10',10),
('SA','SA_G11','Grade 11 (Secondary)','senior_secondary',16,17,'Year 11',11),
('SA','SA_G12','Grade 12 (Tawjihi)','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- SPAIN
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('ES','ES_P1','Curso 1 (Primaria)','primary',6,7,'Year 1',1),
('ES','ES_P2','Curso 2 (Primaria)','primary',7,8,'Year 2',2),
('ES','ES_P3','Curso 3 (Primaria)','primary',8,9,'Year 3',3),
('ES','ES_P4','Curso 4 (Primaria)','primary',9,10,'Year 4',4),
('ES','ES_P5','Curso 5 (Primaria)','primary',10,11,'Year 5',5),
('ES','ES_P6','Curso 6 (Primaria)','primary',11,12,'Year 6',6),
('ES','ES_E1','ESO Curso 1','junior_secondary',12,13,'Year 7',7),
('ES','ES_E2','ESO Curso 2','junior_secondary',13,14,'Year 8',8),
('ES','ES_E3','ESO Curso 3','junior_secondary',14,15,'Year 9',9),
('ES','ES_E4','ESO Curso 4','junior_secondary',15,16,'Year 10',10),
('ES','ES_B1','Bachillerato Curso 1','senior_secondary',16,17,'Year 11',11),
('ES','ES_B2','Bachillerato Curso 2 (EBAU)','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- SWEDEN
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('SE','SE_G1','Grade 1 (Grundskola)','primary',7,8,'Year 1',1),
('SE','SE_G2','Grade 2 (Grundskola)','primary',8,9,'Year 2',2),
('SE','SE_G3','Grade 3 (Grundskola)','primary',9,10,'Year 3',3),
('SE','SE_G4','Grade 4 (Grundskola)','primary',10,11,'Year 4',4),
('SE','SE_G5','Grade 5 (Grundskola)','primary',11,12,'Year 5',5),
('SE','SE_G6','Grade 6 (Grundskola)','primary',12,13,'Year 6',6),
('SE','SE_G7','Grade 7 (Grundskola)','junior_secondary',13,14,'Year 7',7),
('SE','SE_G8','Grade 8 (Grundskola)','junior_secondary',14,15,'Year 8',8),
('SE','SE_G9','Grade 9 (Grundskola)','junior_secondary',15,16,'Year 9',9),
('SE','SE_GY1','Year 1 (Gymnasiet)','senior_secondary',16,17,'Year 10',10),
('SE','SE_GY2','Year 2 (Gymnasiet)','senior_secondary',17,18,'Year 11',11),
('SE','SE_GY3','Year 3 (Studentexamen)','senior_secondary',18,19,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- ─────────────────────────────────────────────
-- SUBJECTS
-- ─────────────────────────────────────────────

-- BELGIUM PRIMARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'BE',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('BE_ENG','English','compulsory',true,'ENG'),
  ('BE_MATH','Mathematics','compulsory',true,'MATH'),
  ('BE_SCI','Science & Nature','compulsory',true,'SCI'),
  ('BE_SOS','Social Studies & History','compulsory',true,'HIST'),
  ('BE_ART','Art Education','compulsory',true,'ART'),
  ('BE_MUS','Music Education','compulsory',true,'MUS'),
  ('BE_PE','Physical Education','compulsory',true,'PE'),
  ('BE_FL1','French / Dutch (Second Language)','compulsory',false,null),
  ('BE_TECH','Technology','compulsory',false,null),
  ('BE_REL','Religion / Ethics','compulsory',true,'REL')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='BE' and yg.stage='primary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- BELGIUM JUNIOR SECONDARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'BE',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('BE_ENG','English','compulsory',true,'ENG'),
  ('BE_MATH','Mathematics','compulsory',true,'MATH'),
  ('BE_SCI','Sciences','compulsory',true,'SCI'),
  ('BE_HIST','History','compulsory',true,'HIST'),
  ('BE_GEO','Geography','compulsory',true,'GEO'),
  ('BE_ART','Art Education','compulsory',true,'ART'),
  ('BE_MUS','Music','compulsory',true,'MUS'),
  ('BE_PE','Physical Education','compulsory',true,'PE'),
  ('BE_FL1','French / Dutch','compulsory',false,null),
  ('BE_TECH','Technology','compulsory',false,null),
  ('BE_REL','Religion / Ethics','compulsory',true,'REL'),
  ('BE_COMP','Computer Science','elective',true,'COMP')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='BE' and yg.stage='junior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- BELGIUM SENIOR SECONDARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'BE',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('BE_ENG','English','compulsory',true,'ENG'),
  ('BE_MATH','Mathematics','compulsory',true,'MATH'),
  ('BE_BIO','Biology','elective',true,'BIO'),
  ('BE_CHEM','Chemistry','elective',true,'CHEM'),
  ('BE_PHY','Physics','elective',true,'PHY'),
  ('BE_HIST','History','elective',true,'HIST'),
  ('BE_GEO','Geography','elective',true,'GEO'),
  ('BE_ECON','Economics','elective',true,'ECON'),
  ('BE_ART','Art','elective',true,'ART'),
  ('BE_MUS','Music','elective',true,'MUS'),
  ('BE_PE','Physical Education','compulsory',true,'PE'),
  ('BE_FL1','French / Dutch','compulsory',false,null),
  ('BE_COMP','Computer Science','elective',true,'COMP'),
  ('BE_REL','Religion / Ethics','compulsory',true,'REL'),
  ('BE_PHIL','Philosophy','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='BE' and yg.stage='senior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- DENMARK PRIMARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'DK',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('DK_DAN','Danish Language','compulsory',false,null),
  ('DK_MATH','Mathematics','compulsory',true,'MATH'),
  ('DK_ENG','English','compulsory',true,'ENG'),
  ('DK_SCI','Science & Technology','compulsory',true,'SCI'),
  ('DK_SOS','Social Studies','compulsory',true,'HIST'),
  ('DK_HIST','History','compulsory',true,'HIST'),
  ('DK_GEO','Geography','compulsory',true,'GEO'),
  ('DK_BIO','Biology','compulsory',true,'BIO'),
  ('DK_PHY','Physics & Chemistry','compulsory',true,'PHY'),
  ('DK_ART','Visual Arts','compulsory',true,'ART'),
  ('DK_MUS','Music','compulsory',true,'MUS'),
  ('DK_PE','Physical Education','compulsory',true,'PE'),
  ('DK_REL','Christian Studies / Religion','compulsory',true,'REL'),
  ('DK_TECH','Technology','compulsory',false,null),
  ('DK_GER','German','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='DK' and yg.stage='primary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- DENMARK JUNIOR SECONDARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'DK',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('DK_DAN','Danish Language','compulsory',false,null),
  ('DK_MATH','Mathematics','compulsory',true,'MATH'),
  ('DK_ENG','English','compulsory',true,'ENG'),
  ('DK_SCI','Science & Technology','compulsory',true,'SCI'),
  ('DK_SOS','Social Studies','compulsory',true,'HIST'),
  ('DK_HIST','History','compulsory',true,'HIST'),
  ('DK_GEO','Geography','compulsory',true,'GEO'),
  ('DK_BIO','Biology','compulsory',true,'BIO'),
  ('DK_PHY','Physics & Chemistry','compulsory',true,'PHY'),
  ('DK_ART','Visual Arts','compulsory',true,'ART'),
  ('DK_MUS','Music','elective',true,'MUS'),
  ('DK_PE','Physical Education','compulsory',true,'PE'),
  ('DK_REL','Christian Studies','compulsory',true,'REL'),
  ('DK_GER','German / French','elective',false,null),
  ('DK_COMP','Computer Science','elective',true,'COMP')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='DK' and yg.stage='junior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- DENMARK SENIOR SECONDARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'DK',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('DK_DAN','Danish Language & Literature','compulsory',false,null),
  ('DK_MATH','Mathematics','compulsory',true,'MATH'),
  ('DK_ENG','English','compulsory',true,'ENG'),
  ('DK_BIO','Biology','elective',true,'BIO'),
  ('DK_CHEM','Chemistry','elective',true,'CHEM'),
  ('DK_PHY','Physics','elective',true,'PHY'),
  ('DK_HIST','History','compulsory',true,'HIST'),
  ('DK_SOS','Social Studies','compulsory',true,'HIST'),
  ('DK_GEO','Geography','elective',true,'GEO'),
  ('DK_ART','Art','elective',true,'ART'),
  ('DK_MUS','Music','elective',true,'MUS'),
  ('DK_PE','Physical Education','compulsory',true,'PE'),
  ('DK_COMP','Computer Science','elective',true,'COMP'),
  ('DK_ECON','Economics','elective',true,'ECON'),
  ('DK_PHIL','Philosophy','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='DK' and yg.stage='senior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- FRANCE PRIMARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'FR',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('FR_FR','French Language','compulsory',false,null),
  ('FR_MATH','Mathematics','compulsory',true,'MATH'),
  ('FR_SCI','Sciences & Technology','compulsory',true,'SCI'),
  ('FR_HIST','History & Geography','compulsory',true,'HIST'),
  ('FR_ART','Art Education','compulsory',true,'ART'),
  ('FR_MUS','Music','compulsory',true,'MUS'),
  ('FR_PE','Physical Education','compulsory',true,'PE'),
  ('FR_LANG','Modern Language (English)','compulsory',true,'ENG'),
  ('FR_CIVIC','Civic & Moral Education','compulsory',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='FR' and yg.stage='primary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- FRANCE JUNIOR SECONDARY (College)
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'FR',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('FR_FR','French Language & Literature','compulsory',false,null),
  ('FR_MATH','Mathematics','compulsory',true,'MATH'),
  ('FR_ENG','English (LV1)','compulsory',true,'ENG'),
  ('FR_SCI','Sciences de la Vie et de la Terre','compulsory',true,'SCI'),
  ('FR_PHY','Physics & Chemistry','compulsory',true,'PHY'),
  ('FR_HIST','History & Geography','compulsory',true,'HIST'),
  ('FR_ART','Art Education','compulsory',true,'ART'),
  ('FR_MUS','Music','compulsory',true,'MUS'),
  ('FR_PE','Physical Education','compulsory',true,'PE'),
  ('FR_TECH','Technology','compulsory',false,null),
  ('FR_CIVIC','Civic Education (EMC)','compulsory',false,null),
  ('FR_LV2','Second Language (LV2)','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='FR' and yg.stage='junior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- FRANCE SENIOR SECONDARY (Lycee)
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'FR',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('FR_FR','French Literature','compulsory',false,null),
  ('FR_MATH','Mathematics','elective',true,'MATH'),
  ('FR_ENG','English (LV1)','compulsory',true,'ENG'),
  ('FR_BIO','Life & Earth Sciences','elective',true,'BIO'),
  ('FR_CHEM','Physics & Chemistry','elective',true,'CHEM'),
  ('FR_PHY','Physics','elective',true,'PHY'),
  ('FR_HIST','History & Geography','compulsory',true,'HIST'),
  ('FR_SOS','Social & Political Sciences','elective',true,'HIST'),
  ('FR_ECON','Economics & Social Sciences','elective',true,'ECON'),
  ('FR_ART','Art History','elective',true,'ART'),
  ('FR_MUS','Music','elective',true,'MUS'),
  ('FR_PE','Physical Education','compulsory',true,'PE'),
  ('FR_COMP','Digital & Computer Science','elective',true,'COMP'),
  ('FR_PHIL','Philosophy','compulsory',false,null),
  ('FR_LV2','Second Language','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='FR' and yg.stage='senior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ITALY PRIMARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'IT',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('IT_ITA','Italian Language','compulsory',false,null),
  ('IT_MATH','Mathematics','compulsory',true,'MATH'),
  ('IT_SCI','Science','compulsory',true,'SCI'),
  ('IT_HIST','History & Geography','compulsory',true,'HIST'),
  ('IT_ENG','English','compulsory',true,'ENG'),
  ('IT_ART','Art & Image','compulsory',true,'ART'),
  ('IT_MUS','Music','compulsory',true,'MUS'),
  ('IT_PE','Physical Education','compulsory',true,'PE'),
  ('IT_REL','Catholic Religion / Ethics','compulsory',true,'REL'),
  ('IT_TECH','Technology','compulsory',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='IT' and yg.stage='primary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ITALY JUNIOR SECONDARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'IT',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('IT_ITA','Italian Language & Literature','compulsory',false,null),
  ('IT_MATH','Mathematics','compulsory',true,'MATH'),
  ('IT_SCI','Science','compulsory',true,'SCI'),
  ('IT_HIST','History','compulsory',true,'HIST'),
  ('IT_GEO','Geography','compulsory',true,'GEO'),
  ('IT_ENG','English','compulsory',true,'ENG'),
  ('IT_LV2','Second Language','compulsory',false,null),
  ('IT_ART','Art & Image','compulsory',true,'ART'),
  ('IT_MUS','Music','compulsory',true,'MUS'),
  ('IT_PE','Physical Education','compulsory',true,'PE'),
  ('IT_REL','Catholic Religion / Ethics','compulsory',true,'REL'),
  ('IT_TECH','Technology','compulsory',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='IT' and yg.stage='junior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ITALY SENIOR SECONDARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'IT',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('IT_ITA','Italian Language & Literature','compulsory',false,null),
  ('IT_MATH','Mathematics','compulsory',true,'MATH'),
  ('IT_ENG','English','compulsory',true,'ENG'),
  ('IT_BIO','Biology','elective',true,'BIO'),
  ('IT_CHEM','Chemistry','elective',true,'CHEM'),
  ('IT_PHY','Physics','elective',true,'PHY'),
  ('IT_HIST','History','compulsory',true,'HIST'),
  ('IT_GEO','Geography','elective',true,'GEO'),
  ('IT_ART','Art History','elective',true,'ART'),
  ('IT_MUS','Music','elective',true,'MUS'),
  ('IT_PE','Physical Education','compulsory',true,'PE'),
  ('IT_REL','Catholic Religion / Ethics','compulsory',true,'REL'),
  ('IT_PHIL','Philosophy','elective',false,null),
  ('IT_ECON','Economics','elective',true,'ECON'),
  ('IT_COMP','Computer Science','elective',true,'COMP'),
  ('IT_LAT','Latin','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='IT' and yg.stage='senior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- NETHERLANDS PRIMARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'NL',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('NL_DUT','Dutch Language','compulsory',false,null),
  ('NL_MATH','Mathematics','compulsory',true,'MATH'),
  ('NL_ENG','English','compulsory',true,'ENG'),
  ('NL_SCI','Nature & Technology','compulsory',true,'SCI'),
  ('NL_SOS','Social Studies & History','compulsory',true,'HIST'),
  ('NL_GEO','Geography','compulsory',true,'GEO'),
  ('NL_ART','Art & Creative Education','compulsory',true,'ART'),
  ('NL_MUS','Music','compulsory',true,'MUS'),
  ('NL_PE','Physical Education','compulsory',true,'PE'),
  ('NL_REL','Religious Studies / Life Skills','compulsory',true,'REL')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='NL' and yg.stage='primary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- NETHERLANDS JUNIOR SECONDARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'NL',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('NL_DUT','Dutch Language','compulsory',false,null),
  ('NL_MATH','Mathematics','compulsory',true,'MATH'),
  ('NL_ENG','English','compulsory',true,'ENG'),
  ('NL_SCI','Biology / Nature','compulsory',true,'SCI'),
  ('NL_PHY','Physics & Chemistry','compulsory',true,'PHY'),
  ('NL_HIST','History','compulsory',true,'HIST'),
  ('NL_GEO','Geography','compulsory',true,'GEO'),
  ('NL_ECON','Economics','elective',true,'ECON'),
  ('NL_ART','Art','compulsory',true,'ART'),
  ('NL_MUS','Music','compulsory',true,'MUS'),
  ('NL_PE','Physical Education','compulsory',true,'PE'),
  ('NL_COMP','Computer Science','elective',true,'COMP'),
  ('NL_GER','German','elective',false,null),
  ('NL_FRN','French','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='NL' and yg.stage='junior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- NETHERLANDS SENIOR SECONDARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'NL',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('NL_DUT','Dutch Language & Literature','compulsory',false,null),
  ('NL_MATH','Mathematics','compulsory',true,'MATH'),
  ('NL_ENG','English','compulsory',true,'ENG'),
  ('NL_BIO','Biology','elective',true,'BIO'),
  ('NL_CHEM','Chemistry','elective',true,'CHEM'),
  ('NL_PHY','Physics','elective',true,'PHY'),
  ('NL_HIST','History','elective',true,'HIST'),
  ('NL_GEO','Geography','elective',true,'GEO'),
  ('NL_ECON','Economics','elective',true,'ECON'),
  ('NL_ART','Art History','elective',true,'ART'),
  ('NL_MUS','Music','elective',true,'MUS'),
  ('NL_PE','Physical Education','compulsory',true,'PE'),
  ('NL_COMP','Computer Science','elective',true,'COMP'),
  ('NL_PHIL','Philosophy','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='NL' and yg.stage='senior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- NORWAY ALL STAGES
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'NO',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('NO_NOR','Norwegian Language','compulsory',false,null),
  ('NO_MATH','Mathematics','compulsory',true,'MATH'),
  ('NO_ENG','English','compulsory',true,'ENG'),
  ('NO_SCI','Natural Science','compulsory',true,'SCI'),
  ('NO_SOS','Social Studies','compulsory',true,'HIST'),
  ('NO_HIST','History','compulsory',true,'HIST'),
  ('NO_GEO','Geography','compulsory',true,'GEO'),
  ('NO_ART','Art & Crafts','compulsory',true,'ART'),
  ('NO_MUS','Music','compulsory',true,'MUS'),
  ('NO_PE','Physical Education','compulsory',true,'PE'),
  ('NO_REL','Religion & Ethics (KRLE)','compulsory',true,'REL'),
  ('NO_COMP','Computer Science','elective',true,'COMP'),
  ('NO_BIO','Biology','elective',true,'BIO'),
  ('NO_CHEM','Chemistry','elective',true,'CHEM'),
  ('NO_PHY','Physics','elective',true,'PHY'),
  ('NO_ECON','Economics','elective',true,'ECON')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='NO'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- PORTUGAL ALL STAGES
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'PT',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('PT_PORT','Portuguese Language','compulsory',false,null),
  ('PT_MATH','Mathematics','compulsory',true,'MATH'),
  ('PT_ENG','English','compulsory',true,'ENG'),
  ('PT_SCI','Natural Sciences','compulsory',true,'SCI'),
  ('PT_HIST','History & Geography','compulsory',true,'HIST'),
  ('PT_GEO','Geography','compulsory',true,'GEO'),
  ('PT_ART','Visual Arts','compulsory',true,'ART'),
  ('PT_MUS','Music Education','compulsory',true,'MUS'),
  ('PT_PE','Physical Education','compulsory',true,'PE'),
  ('PT_REL','Catholic Religion / Ethics','elective',true,'REL'),
  ('PT_COMP','ICT / Computer Science','compulsory',true,'COMP'),
  ('PT_BIO','Biology & Geology','elective',true,'BIO'),
  ('PT_CHEM','Physics & Chemistry','elective',true,'CHEM'),
  ('PT_PHY','Physics','elective',true,'PHY'),
  ('PT_ECON','Economics','elective',true,'ECON'),
  ('PT_PHIL','Philosophy','compulsory',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='PT'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- QATAR ALL STAGES
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'QA',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('QA_ARB','Arabic Language','compulsory',false,null),
  ('QA_MATH','Mathematics','compulsory',true,'MATH'),
  ('QA_ENG','English','compulsory',true,'ENG'),
  ('QA_SCI','Science','compulsory',true,'SCI'),
  ('QA_SOS','Social Studies','compulsory',true,'HIST'),
  ('QA_ISL','Islamic Studies','compulsory',false,null),
  ('QA_ART','Art Education','compulsory',true,'ART'),
  ('QA_PE','Physical Education','compulsory',true,'PE'),
  ('QA_COMP','Computer Science & ICT','compulsory',true,'COMP'),
  ('QA_BIO','Biology','elective',true,'BIO'),
  ('QA_CHEM','Chemistry','elective',true,'CHEM'),
  ('QA_PHY','Physics','elective',true,'PHY'),
  ('QA_HIST','History','elective',true,'HIST'),
  ('QA_GEO','Geography','elective',true,'GEO'),
  ('QA_ECON','Economics','elective',true,'ECON')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='QA'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- SAUDI ARABIA ALL STAGES
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'SA',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('SA_ARB','Arabic Language','compulsory',false,null),
  ('SA_MATH','Mathematics','compulsory',true,'MATH'),
  ('SA_ENG','English','compulsory',true,'ENG'),
  ('SA_SCI','Science','compulsory',true,'SCI'),
  ('SA_SOS','Social Studies','compulsory',true,'HIST'),
  ('SA_ISL','Islamic Studies','compulsory',false,null),
  ('SA_ART','Art Education','compulsory',true,'ART'),
  ('SA_PE','Physical Education','compulsory',true,'PE'),
  ('SA_COMP','Computer Science','compulsory',true,'COMP'),
  ('SA_BIO','Biology','elective',true,'BIO'),
  ('SA_CHEM','Chemistry','elective',true,'CHEM'),
  ('SA_PHY','Physics','elective',true,'PHY'),
  ('SA_HIST','History','elective',true,'HIST'),
  ('SA_GEO','Geography','elective',true,'GEO'),
  ('SA_ECON','Economics','elective',true,'ECON')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='SA'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- SPAIN PRIMARY
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'ES',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('ES_SPA','Spanish Language & Literature','compulsory',false,null),
  ('ES_MATH','Mathematics','compulsory',true,'MATH'),
  ('ES_ENG','English (Foreign Language)','compulsory',true,'ENG'),
  ('ES_SCI','Natural Science','compulsory',true,'SCI'),
  ('ES_SOS','Social Science','compulsory',true,'HIST'),
  ('ES_ART','Art Education','compulsory',true,'ART'),
  ('ES_MUS','Music','compulsory',true,'MUS'),
  ('ES_PE','Physical Education','compulsory',true,'PE'),
  ('ES_REL','Religion / Ethics','elective',true,'REL'),
  ('ES_TECH','Technology','compulsory',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='ES' and yg.stage='primary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- SPAIN JUNIOR SECONDARY (ESO)
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'ES',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('ES_SPA','Spanish Language & Literature','compulsory',false,null),
  ('ES_MATH','Mathematics','compulsory',true,'MATH'),
  ('ES_ENG','English','compulsory',true,'ENG'),
  ('ES_BIO','Biology & Geology','compulsory',true,'BIO'),
  ('ES_PHY','Physics & Chemistry','compulsory',true,'PHY'),
  ('ES_HIST','Geography & History','compulsory',true,'HIST'),
  ('ES_ART','Plastic Arts','compulsory',true,'ART'),
  ('ES_MUS','Music','elective',true,'MUS'),
  ('ES_PE','Physical Education','compulsory',true,'PE'),
  ('ES_TECH','Technology & Digitalisation','compulsory',false,null),
  ('ES_COMP','Computer Science','elective',true,'COMP'),
  ('ES_REL','Religion / Ethics','elective',true,'REL'),
  ('ES_ECON','Economics','elective',true,'ECON')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='ES' and yg.stage='junior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- SPAIN SENIOR SECONDARY (Bachillerato)
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'ES',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('ES_SPA','Spanish Language & Literature','compulsory',false,null),
  ('ES_MATH','Mathematics','compulsory',true,'MATH'),
  ('ES_ENG','English','compulsory',true,'ENG'),
  ('ES_BIO','Biology','elective',true,'BIO'),
  ('ES_CHEM','Chemistry','elective',true,'CHEM'),
  ('ES_PHY','Physics','elective',true,'PHY'),
  ('ES_HIST','History of Spain','compulsory',true,'HIST'),
  ('ES_GEO','Geography','elective',true,'GEO'),
  ('ES_ART','Art History','elective',true,'ART'),
  ('ES_MUS','Music Analysis','elective',true,'MUS'),
  ('ES_PE','Physical Education','compulsory',true,'PE'),
  ('ES_COMP','Computer Science','elective',true,'COMP'),
  ('ES_ECON','Economics','elective',true,'ECON'),
  ('ES_PHIL','Philosophy','compulsory',false,null),
  ('ES_REL','Religion / Ethics','elective',true,'REL')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='ES' and yg.stage='senior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- SWEDEN ALL STAGES
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'SE',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('SE_SWE','Swedish Language','compulsory',false,null),
  ('SE_MATH','Mathematics','compulsory',true,'MATH'),
  ('SE_ENG','English','compulsory',true,'ENG'),
  ('SE_SCI','Natural Science (NO)','compulsory',true,'SCI'),
  ('SE_SOS','Social Science (SO)','compulsory',true,'HIST'),
  ('SE_HIST','History','compulsory',true,'HIST'),
  ('SE_GEO','Geography','compulsory',true,'GEO'),
  ('SE_REL','Religious Studies','compulsory',true,'REL'),
  ('SE_ART','Visual Arts','compulsory',true,'ART'),
  ('SE_MUS','Music','compulsory',true,'MUS'),
  ('SE_PE','Physical Education & Health','compulsory',true,'PE'),
  ('SE_COMP','Computer Science / Digital Competence','compulsory',true,'COMP'),
  ('SE_BIO','Biology','elective',true,'BIO'),
  ('SE_CHEM','Chemistry','elective',true,'CHEM'),
  ('SE_PHY','Physics','elective',true,'PHY'),
  ('SE_ECON','Economics / Business','elective',true,'ECON'),
  ('SE_PHIL','Philosophy','elective',false,null),
  ('SE_TECH','Technology','compulsory',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='SE'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- VERIFY
select 
  ac.country_code, ac.country_name, ac.flag, ac.is_active,
  count(distinct yg.year_group_code) as year_groups,
  count(distinct cs.id) as subjects
from academy_countries ac
left join year_group_equivalencies yg on yg.country_code = ac.country_code
left join country_subjects cs on cs.country_code = ac.country_code
where ac.is_active = true
group by ac.country_code, ac.country_name, ac.flag, ac.is_active
order by ac.country_name;
