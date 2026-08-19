
-- ─────────────────────────────────────────────
-- YEAR GROUPS
-- ─────────────────────────────────────────────

create table if not exists year_group_equivalencies (
  id uuid primary key default gen_random_uuid(),
  country_code text references academy_countries(country_code),
  year_group_code text not null,
  year_group_label text not null,
  stage text not null check (stage in ('primary','junior_secondary','senior_secondary')),
  age_min integer not null,
  age_max integer not null,
  equivalent_uk_year text,
  sort_order integer not null,
  unique(country_code, year_group_code)
);

alter table year_group_equivalencies enable row level security;
create policy "Public read year_group_equivalencies"
  on year_group_equivalencies for select using (true);

-- NIGERIA
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('NG','NG_P1','Primary 1','primary',5,6,'Year 1',1),
('NG','NG_P2','Primary 2','primary',6,7,'Year 2',2),
('NG','NG_P3','Primary 3','primary',7,8,'Year 3',3),
('NG','NG_P4','Primary 4','primary',8,9,'Year 4',4),
('NG','NG_P5','Primary 5','primary',9,10,'Year 5',5),
('NG','NG_P6','Primary 6','primary',10,11,'Year 6',6),
('NG','NG_JSS1','JSS 1','junior_secondary',11,12,'Year 7',7),
('NG','NG_JSS2','JSS 2','junior_secondary',12,13,'Year 8',8),
('NG','NG_JSS3','JSS 3','junior_secondary',13,14,'Year 9',9),
('NG','NG_SS1','SS 1','senior_secondary',14,15,'Year 10',10),
('NG','NG_SS2','SS 2','senior_secondary',15,16,'Year 11',11),
('NG','NG_SS3','SS 3','senior_secondary',16,17,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- ENGLAND
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('GB','GB_REC','Reception','primary',4,5,'Reception',1),
('GB','GB_Y1','Year 1','primary',5,6,'Year 1',2),
('GB','GB_Y2','Year 2','primary',6,7,'Year 2',3),
('GB','GB_Y3','Year 3','primary',7,8,'Year 3',4),
('GB','GB_Y4','Year 4','primary',8,9,'Year 4',5),
('GB','GB_Y5','Year 5','primary',9,10,'Year 5',6),
('GB','GB_Y6','Year 6','primary',10,11,'Year 6',7),
('GB','GB_Y7','Year 7','junior_secondary',11,12,'Year 7',8),
('GB','GB_Y8','Year 8','junior_secondary',12,13,'Year 8',9),
('GB','GB_Y9','Year 9','junior_secondary',13,14,'Year 9',10),
('GB','GB_Y10','Year 10','senior_secondary',14,15,'Year 10',11),
('GB','GB_Y11','Year 11','senior_secondary',15,16,'Year 11',12),
('GB','GB_Y12','Year 12 (Sixth Form)','senior_secondary',16,17,'Year 12',13),
('GB','GB_Y13','Year 13 (Sixth Form)','senior_secondary',17,18,'Year 13',14)
on conflict (country_code,year_group_code) do nothing;

-- JAPAN
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('JP','JP_G1','Grade 1','primary',6,7,'Year 1',1),
('JP','JP_G2','Grade 2','primary',7,8,'Year 2',2),
('JP','JP_G3','Grade 3','primary',8,9,'Year 3',3),
('JP','JP_G4','Grade 4','primary',9,10,'Year 4',4),
('JP','JP_G5','Grade 5','primary',10,11,'Year 5',5),
('JP','JP_G6','Grade 6','primary',11,12,'Year 6',6),
('JP','JP_G7','Grade 7 (Junior High 1)','junior_secondary',12,13,'Year 7',7),
('JP','JP_G8','Grade 8 (Junior High 2)','junior_secondary',13,14,'Year 8',8),
('JP','JP_G9','Grade 9 (Junior High 3)','junior_secondary',14,15,'Year 9',9),
('JP','JP_G10','Grade 10 (Senior High 1)','senior_secondary',15,16,'Year 10',10),
('JP','JP_G11','Grade 11 (Senior High 2)','senior_secondary',16,17,'Year 11',11),
('JP','JP_G12','Grade 12 (Senior High 3)','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- ESTONIA
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('EE','EE_G1','Grade 1','primary',6,7,'Year 1',1),
('EE','EE_G2','Grade 2','primary',7,8,'Year 2',2),
('EE','EE_G3','Grade 3','primary',8,9,'Year 3',3),
('EE','EE_G4','Grade 4','primary',9,10,'Year 4',4),
('EE','EE_G5','Grade 5','primary',10,11,'Year 5',5),
('EE','EE_G6','Grade 6','primary',11,12,'Year 6',6),
('EE','EE_G7','Grade 7','junior_secondary',12,13,'Year 7',7),
('EE','EE_G8','Grade 8','junior_secondary',13,14,'Year 8',8),
('EE','EE_G9','Grade 9','junior_secondary',14,15,'Year 9',9),
('EE','EE_G10','Grade 10','senior_secondary',15,16,'Year 10',10),
('EE','EE_G11','Grade 11','senior_secondary',16,17,'Year 11',11),
('EE','EE_G12','Grade 12','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- CANADA
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('CA','CA_G1','Grade 1','primary',6,7,'Year 1',1),
('CA','CA_G2','Grade 2','primary',7,8,'Year 2',2),
('CA','CA_G3','Grade 3','primary',8,9,'Year 3',3),
('CA','CA_G4','Grade 4','primary',9,10,'Year 4',4),
('CA','CA_G5','Grade 5','primary',10,11,'Year 5',5),
('CA','CA_G6','Grade 6','primary',11,12,'Year 6',6),
('CA','CA_G7','Grade 7','junior_secondary',12,13,'Year 7',7),
('CA','CA_G8','Grade 8','junior_secondary',13,14,'Year 8',8),
('CA','CA_G9','Grade 9','junior_secondary',14,15,'Year 9',9),
('CA','CA_G10','Grade 10','senior_secondary',15,16,'Year 10',10),
('CA','CA_G11','Grade 11','senior_secondary',16,17,'Year 11',11),
('CA','CA_G12','Grade 12','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- SINGAPORE
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('SG','SG_P1','Primary 1','primary',6,7,'Year 1',1),
('SG','SG_P2','Primary 2','primary',7,8,'Year 2',2),
('SG','SG_P3','Primary 3','primary',8,9,'Year 3',3),
('SG','SG_P4','Primary 4','primary',9,10,'Year 4',4),
('SG','SG_P5','Primary 5','primary',10,11,'Year 5',5),
('SG','SG_P6','Primary 6','primary',11,12,'Year 6',6),
('SG','SG_S1','Secondary 1','junior_secondary',12,13,'Year 7',7),
('SG','SG_S2','Secondary 2','junior_secondary',13,14,'Year 8',8),
('SG','SG_S3','Secondary 3','junior_secondary',14,15,'Year 9',9),
('SG','SG_S4','Secondary 4','senior_secondary',15,16,'Year 10',10),
('SG','SG_JC1','Junior College 1','senior_secondary',16,17,'Year 12',11),
('SG','SG_JC2','Junior College 2','senior_secondary',17,18,'Year 13',12)
on conflict (country_code,year_group_code) do nothing;

-- FINLAND
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('FI','FI_G1','Grade 1','primary',6,7,'Year 1',1),
('FI','FI_G2','Grade 2','primary',7,8,'Year 2',2),
('FI','FI_G3','Grade 3','primary',8,9,'Year 3',3),
('FI','FI_G4','Grade 4','primary',9,10,'Year 4',4),
('FI','FI_G5','Grade 5','primary',10,11,'Year 5',5),
('FI','FI_G6','Grade 6','primary',11,12,'Year 6',6),
('FI','FI_G7','Grade 7','junior_secondary',12,13,'Year 7',7),
('FI','FI_G8','Grade 8','junior_secondary',13,14,'Year 8',8),
('FI','FI_G9','Grade 9','junior_secondary',14,15,'Year 9',9),
('FI','FI_G10','Grade 10 (Upper Secondary 1)','senior_secondary',15,16,'Year 10',10),
('FI','FI_G11','Grade 11 (Upper Secondary 2)','senior_secondary',16,17,'Year 11',11),
('FI','FI_G12','Grade 12 (Upper Secondary 3)','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- GHANA
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('GH','GH_P1','Primary 1','primary',5,6,'Year 1',1),
('GH','GH_P2','Primary 2','primary',6,7,'Year 2',2),
('GH','GH_P3','Primary 3','primary',7,8,'Year 3',3),
('GH','GH_P4','Primary 4','primary',8,9,'Year 4',4),
('GH','GH_P5','Primary 5','primary',9,10,'Year 5',5),
('GH','GH_P6','Primary 6','primary',10,11,'Year 6',6),
('GH','GH_JHS1','JHS 1','junior_secondary',11,12,'Year 7',7),
('GH','GH_JHS2','JHS 2','junior_secondary',12,13,'Year 8',8),
('GH','GH_JHS3','JHS 3','junior_secondary',13,14,'Year 9',9),
('GH','GH_SHS1','SHS 1','senior_secondary',14,15,'Year 10',10),
('GH','GH_SHS2','SHS 2','senior_secondary',15,16,'Year 11',11),
('GH','GH_SHS3','SHS 3','senior_secondary',16,17,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- SOUTH AFRICA
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('ZA','ZA_G1','Grade 1','primary',6,7,'Year 1',1),
('ZA','ZA_G2','Grade 2','primary',7,8,'Year 2',2),
('ZA','ZA_G3','Grade 3','primary',8,9,'Year 3',3),
('ZA','ZA_G4','Grade 4','primary',9,10,'Year 4',4),
('ZA','ZA_G5','Grade 5','primary',10,11,'Year 5',5),
('ZA','ZA_G6','Grade 6','primary',11,12,'Year 6',6),
('ZA','ZA_G7','Grade 7','junior_secondary',12,13,'Year 7',7),
('ZA','ZA_G8','Grade 8','junior_secondary',13,14,'Year 8',8),
('ZA','ZA_G9','Grade 9','junior_secondary',14,15,'Year 9',9),
('ZA','ZA_G10','Grade 10','senior_secondary',15,16,'Year 10',10),
('ZA','ZA_G11','Grade 11','senior_secondary',16,17,'Year 11',11),
('ZA','ZA_G12','Grade 12','senior_secondary',17,18,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- KENYA
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('KE','KE_G1','Grade 1','primary',5,6,'Year 1',1),
('KE','KE_G2','Grade 2','primary',6,7,'Year 2',2),
('KE','KE_G3','Grade 3','primary',7,8,'Year 3',3),
('KE','KE_G4','Grade 4','primary',8,9,'Year 4',4),
('KE','KE_G5','Grade 5','primary',9,10,'Year 5',5),
('KE','KE_G6','Grade 6','primary',10,11,'Year 6',6),
('KE','KE_G7','Grade 7','junior_secondary',11,12,'Year 7',7),
('KE','KE_G8','Grade 8','junior_secondary',12,13,'Year 8',8),
('KE','KE_G9','Grade 9','junior_secondary',13,14,'Year 9',9),
('KE','KE_G10','Grade 10','senior_secondary',14,15,'Year 10',10),
('KE','KE_G11','Grade 11','senior_secondary',15,16,'Year 11',11),
('KE','KE_G12','Grade 12','senior_secondary',16,17,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- AUSTRALIA
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('AU','AU_Y1','Year 1','primary',5,6,'Year 1',1),
('AU','AU_Y2','Year 2','primary',6,7,'Year 2',2),
('AU','AU_Y3','Year 3','primary',7,8,'Year 3',3),
('AU','AU_Y4','Year 4','primary',8,9,'Year 4',4),
('AU','AU_Y5','Year 5','primary',9,10,'Year 5',5),
('AU','AU_Y6','Year 6','primary',10,11,'Year 6',6),
('AU','AU_Y7','Year 7','junior_secondary',11,12,'Year 7',7),
('AU','AU_Y8','Year 8','junior_secondary',12,13,'Year 8',8),
('AU','AU_Y9','Year 9','junior_secondary',13,14,'Year 9',9),
('AU','AU_Y10','Year 10','junior_secondary',14,15,'Year 10',10),
('AU','AU_Y11','Year 11','senior_secondary',15,16,'Year 11',11),
('AU','AU_Y12','Year 12','senior_secondary',16,17,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- IRELAND
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('IE','IE_1C','1st Class','primary',6,7,'Year 2',1),
('IE','IE_2C','2nd Class','primary',7,8,'Year 3',2),
('IE','IE_3C','3rd Class','primary',8,9,'Year 4',3),
('IE','IE_4C','4th Class','primary',9,10,'Year 5',4),
('IE','IE_5C','5th Class','primary',10,11,'Year 6',5),
('IE','IE_6C','6th Class','primary',11,12,'Year 7',6),
('IE','IE_1Y','1st Year','junior_secondary',12,13,'Year 8',7),
('IE','IE_2Y','2nd Year','junior_secondary',13,14,'Year 9',8),
('IE','IE_3Y','3rd Year (Junior Cert)','junior_secondary',14,15,'Year 10',9),
('IE','IE_TY','Transition Year','senior_secondary',15,16,'Year 11',10),
('IE','IE_5Y','5th Year','senior_secondary',16,17,'Year 12',11),
('IE','IE_6Y','6th Year (Leaving Cert)','senior_secondary',17,18,'Year 13',12)
on conflict (country_code,year_group_code) do nothing;

-- INDIA
insert into year_group_equivalencies (country_code,year_group_code,year_group_label,stage,age_min,age_max,equivalent_uk_year,sort_order) values
('IN','IN_C1','Class 1','primary',5,6,'Year 1',1),
('IN','IN_C2','Class 2','primary',6,7,'Year 2',2),
('IN','IN_C3','Class 3','primary',7,8,'Year 3',3),
('IN','IN_C4','Class 4','primary',8,9,'Year 4',4),
('IN','IN_C5','Class 5','primary',9,10,'Year 5',5),
('IN','IN_C6','Class 6','junior_secondary',10,11,'Year 6',6),
('IN','IN_C7','Class 7','junior_secondary',11,12,'Year 7',7),
('IN','IN_C8','Class 8','junior_secondary',12,13,'Year 8',8),
('IN','IN_C9','Class 9','junior_secondary',13,14,'Year 9',9),
('IN','IN_C10','Class 10 (Board Exam)','junior_secondary',14,15,'Year 10',10),
('IN','IN_C11','Class 11','senior_secondary',15,16,'Year 11',11),
('IN','IN_C12','Class 12 (Board Exam)','senior_secondary',16,17,'Year 12',12)
on conflict (country_code,year_group_code) do nothing;

-- ─────────────────────────────────────────────
-- COUNTRY SUBJECTS TABLE
-- ─────────────────────────────────────────────

create table if not exists country_subjects (
  id uuid primary key default gen_random_uuid(),
  country_code text references academy_countries(country_code),
  year_group_code text not null,
  subject_code text not null,
  subject_name text not null,
  subject_type text not null check (subject_type in ('compulsory','elective')),
  averra_teaches boolean not null default false,
  averra_subject_code text,
  unique(country_code, year_group_code, subject_code)
);

alter table country_subjects enable row level security;
create policy "Public read country_subjects"
  on country_subjects for select using (true);

-- ── NIGERIA PRIMARY ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'NG',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('NG_ENG','English Language','compulsory',true,'ENG'),
  ('NG_MATH','Mathematics','compulsory',true,'MATH'),
  ('NG_BSC','Basic Science','compulsory',true,'SCI'),
  ('NG_BTECH','Basic Science & Technology','compulsory',true,'BTECH'),
  ('NG_SOS','Social Studies','compulsory',true,'HIST'),
  ('NG_CCA','Cultural & Creative Arts','compulsory',true,'ART'),
  ('NG_PHE','Physical & Health Education','compulsory',true,'PE'),
  ('NG_RKS','Religious Knowledge Studies','compulsory',true,'REL'),
  ('NG_COMP','Computer Studies','compulsory',true,'COMP'),
  ('NG_AGS','Agricultural Science','compulsory',false,null),
  ('NG_HEC','Home Economics','compulsory',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='NG' and yg.stage='primary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── NIGERIA JSS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'NG',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('NG_ENG','English Language','compulsory',true,'ENG'),
  ('NG_MATH','Mathematics','compulsory',true,'MATH'),
  ('NG_BSC','Basic Science','compulsory',true,'SCI'),
  ('NG_BTECH','Basic Technology','compulsory',true,'BTECH'),
  ('NG_SOS','Social Studies','compulsory',true,'HIST'),
  ('NG_CCA','Cultural & Creative Arts','compulsory',true,'ART'),
  ('NG_MUS','Music','compulsory',true,'MUS'),
  ('NG_PHE','Physical & Health Education','compulsory',true,'PE'),
  ('NG_CIV','Civic Education','compulsory',false,null),
  ('NG_COMP','Computer Studies','compulsory',true,'COMP'),
  ('NG_AGS','Agricultural Science','compulsory',false,null),
  ('NG_HEC','Home Economics','compulsory',false,null),
  ('NG_BUS','Business Studies','compulsory',false,null),
  ('NG_CRK','CRK / IRK','elective',true,'REL'),
  ('NG_FRN','French','elective',false,null),
  ('NG_NLAN','Nigerian Language','elective',false,null),
  ('NG_HIST','History','elective',true,'HIST')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='NG' and yg.stage='junior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── NIGERIA SS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'NG',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('NG_ENG','English Language','compulsory',true,'ENG'),
  ('NG_MATH','Mathematics','compulsory',true,'MATH'),
  ('NG_CIV','Civic Education','compulsory',false,null),
  ('NG_BIO','Biology','compulsory',true,'BIO'),
  ('NG_CHEM','Chemistry','elective',true,'CHEM'),
  ('NG_PHY','Physics','elective',true,'PHY'),
  ('NG_GEO','Geography','elective',true,'GEO'),
  ('NG_ECON','Economics','elective',true,'ECON'),
  ('NG_GOV','Government','elective',true,'GOV'),
  ('NG_LIT','Literature in English','elective',true,'ENGLIT'),
  ('NG_COM','Commerce','elective',false,null),
  ('NG_ACC','Financial Accounting','elective',false,null),
  ('NG_AGS','Agricultural Science','elective',false,null),
  ('NG_CRK','CRK / IRK','elective',true,'REL'),
  ('NG_COMP','Computer Studies','elective',true,'COMP'),
  ('NG_FRN','French','elective',false,null),
  ('NG_ART','Fine Art','elective',true,'ART'),
  ('NG_MUS','Music','elective',true,'MUS'),
  ('NG_PHE','Physical Education','elective',true,'PE'),
  ('NG_HIST','History','elective',true,'HIST'),
  ('NG_HEC','Home Economics','elective',false,null),
  ('NG_NLAN','Yoruba / Igbo / Hausa','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='NG' and yg.stage='senior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── ENGLAND PRIMARY ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'GB',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('GB_ENG','English Language','compulsory',true,'ENG'),
  ('GB_MATH','Mathematics','compulsory',true,'MATH'),
  ('GB_SCI','Science','compulsory',true,'SCI'),
  ('GB_COMP','Computing','compulsory',true,'COMP'),
  ('GB_HIST','History','compulsory',true,'HIST'),
  ('GB_GEO','Geography','compulsory',true,'GEO'),
  ('GB_ART','Art & Design','compulsory',true,'ART'),
  ('GB_MUS','Music','compulsory',true,'MUS'),
  ('GB_PE','Physical Education','compulsory',true,'PE'),
  ('GB_DT','Design & Technology','compulsory',false,null),
  ('GB_RE','Religious Education','compulsory',true,'REL'),
  ('GB_MFL','Modern Foreign Language','elective',false,null),
  ('GB_PSHE','PSHE','compulsory',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='GB' and yg.stage='primary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── ENGLAND JUNIOR SECONDARY ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'GB',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('GB_ENG','English Language','compulsory',true,'ENG'),
  ('GB_MATH','Mathematics','compulsory',true,'MATH'),
  ('GB_SCI','Science','compulsory',true,'SCI'),
  ('GB_COMP','Computing','compulsory',true,'COMP'),
  ('GB_HIST','History','compulsory',true,'HIST'),
  ('GB_GEO','Geography','compulsory',true,'GEO'),
  ('GB_ART','Art & Design','compulsory',true,'ART'),
  ('GB_MUS','Music','compulsory',true,'MUS'),
  ('GB_PE','Physical Education','compulsory',true,'PE'),
  ('GB_DT','Design & Technology','compulsory',false,null),
  ('GB_RE','Religious Education','compulsory',true,'REL'),
  ('GB_MFL','Modern Foreign Language','compulsory',false,null),
  ('GB_PSHE','PSHE','compulsory',false,null),
  ('GB_CITZ','Citizenship','compulsory',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='GB' and yg.stage='junior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── ENGLAND SENIOR ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'GB',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('GB_ENG','English Language','compulsory',true,'ENG'),
  ('GB_ENGLIT','English Literature','compulsory',true,'ENGLIT'),
  ('GB_MATH','Mathematics','compulsory',true,'MATH'),
  ('GB_SCI','Combined Science','compulsory',true,'SCI'),
  ('GB_BIO','Biology','elective',true,'BIO'),
  ('GB_CHEM','Chemistry','elective',true,'CHEM'),
  ('GB_PHY','Physics','elective',true,'PHY'),
  ('GB_HIST','History','elective',true,'HIST'),
  ('GB_GEO','Geography','elective',true,'GEO'),
  ('GB_COMP','Computer Science','elective',true,'COMP'),
  ('GB_ART','Art & Design','elective',true,'ART'),
  ('GB_MUS','Music','elective',true,'MUS'),
  ('GB_PE','Physical Education','elective',true,'PE'),
  ('GB_ECON','Economics','elective',true,'ECON'),
  ('GB_BUS','Business Studies','elective',false,null),
  ('GB_MFL','Modern Foreign Language','elective',false,null),
  ('GB_RE','Religious Studies','elective',true,'REL'),
  ('GB_DT','Design & Technology','elective',false,null),
  ('GB_PSYCH','Psychology','elective',false,null),
  ('GB_SOC','Sociology','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='GB' and yg.stage='senior_secondary'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── JAPAN ALL YEARS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'JP',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('JP_JPN','Japanese Language','compulsory',false,null),
  ('JP_MATH','Mathematics','compulsory',true,'MATH'),
  ('JP_SCI','Science','compulsory',true,'SCI'),
  ('JP_SOS','Social Studies','compulsory',true,'HIST'),
  ('JP_MUS','Music','compulsory',true,'MUS'),
  ('JP_ART','Art & Crafts','compulsory',true,'ART'),
  ('JP_PE','Physical Education','compulsory',true,'PE'),
  ('JP_HEC','Home Economics','compulsory',false,null),
  ('JP_MORAL','Moral Education','compulsory',false,null),
  ('JP_ENG','English','compulsory',true,'ENG'),
  ('JP_TECH','Technology','compulsory',false,null),
  ('JP_INFO','Information Technology','elective',true,'COMP')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='JP'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── ESTONIA ALL YEARS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'EE',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('EE_EST','Estonian Language','compulsory',false,null),
  ('EE_MATH','Mathematics','compulsory',true,'MATH'),
  ('EE_SCI','Science','compulsory',true,'SCI'),
  ('EE_SOS','Social Studies','compulsory',true,'HIST'),
  ('EE_MUS','Music','compulsory',true,'MUS'),
  ('EE_ART','Art','compulsory',true,'ART'),
  ('EE_PE','Physical Education','compulsory',true,'PE'),
  ('EE_TECH','Technology','compulsory',false,null),
  ('EE_ENG','English','compulsory',true,'ENG'),
  ('EE_RUS','Russian','elective',false,null),
  ('EE_COMP','Computer Science','compulsory',true,'COMP'),
  ('EE_GEO','Geography','compulsory',true,'GEO'),
  ('EE_HIST','History','compulsory',true,'HIST'),
  ('EE_BIO','Biology','compulsory',true,'BIO'),
  ('EE_CHEM','Chemistry','compulsory',true,'CHEM'),
  ('EE_PHY','Physics','compulsory',true,'PHY')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='EE'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── CANADA ALL YEARS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'CA',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('CA_ENG','English / French','compulsory',true,'ENG'),
  ('CA_MATH','Mathematics','compulsory',true,'MATH'),
  ('CA_SCI','Science','compulsory',true,'SCI'),
  ('CA_SOS','Social Studies','compulsory',true,'HIST'),
  ('CA_PE','Physical Education & Health','compulsory',true,'PE'),
  ('CA_ART','The Arts','compulsory',true,'ART'),
  ('CA_TECH','Technology','compulsory',false,null),
  ('CA_COMP','Computer Science','elective',true,'COMP'),
  ('CA_HIST','History','elective',true,'HIST'),
  ('CA_GEO','Geography','elective',true,'GEO'),
  ('CA_BIO','Biology','elective',true,'BIO'),
  ('CA_CHEM','Chemistry','elective',true,'CHEM'),
  ('CA_PHY','Physics','elective',true,'PHY'),
  ('CA_ECON','Economics','elective',true,'ECON'),
  ('CA_MFL','French / Second Language','compulsory',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='CA'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── SINGAPORE ALL YEARS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'SG',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('SG_ENG','English Language','compulsory',true,'ENG'),
  ('SG_MTL','Mother Tongue Language','compulsory',false,null),
  ('SG_MATH','Mathematics','compulsory',true,'MATH'),
  ('SG_SCI','Science','compulsory',true,'SCI'),
  ('SG_SOS','Social Studies','compulsory',true,'HIST'),
  ('SG_PE','Physical Education','compulsory',true,'PE'),
  ('SG_ART','Art','compulsory',true,'ART'),
  ('SG_MUS','Music','compulsory',true,'MUS'),
  ('SG_HIST','History','elective',true,'HIST'),
  ('SG_GEO','Geography','elective',true,'GEO'),
  ('SG_LIT','Literature','elective',true,'ENGLIT'),
  ('SG_COMP','Computing','elective',true,'COMP'),
  ('SG_BIO','Biology','elective',true,'BIO'),
  ('SG_CHEM','Chemistry','elective',true,'CHEM'),
  ('SG_PHY','Physics','elective',true,'PHY'),
  ('SG_ECON','Economics','elective',true,'ECON')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='SG'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── FINLAND ALL YEARS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'FI',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('FI_FIN','Finnish / Swedish','compulsory',false,null),
  ('FI_MATH','Mathematics','compulsory',true,'MATH'),
  ('FI_SCI','Environmental Studies','compulsory',true,'SCI'),
  ('FI_HIST','History & Social Studies','compulsory',true,'HIST'),
  ('FI_ART','Art','compulsory',true,'ART'),
  ('FI_CRAFT','Craft','compulsory',false,null),
  ('FI_MUS','Music','compulsory',true,'MUS'),
  ('FI_PE','Physical Education','compulsory',true,'PE'),
  ('FI_REL','Religion / Ethics','compulsory',true,'REL'),
  ('FI_ENG','English','compulsory',true,'ENG'),
  ('FI_GEO','Geography','compulsory',true,'GEO'),
  ('FI_BIO','Biology','compulsory',true,'BIO'),
  ('FI_CHEM','Chemistry','compulsory',true,'CHEM'),
  ('FI_PHY','Physics','compulsory',true,'PHY'),
  ('FI_COMP','Computer Science','elective',true,'COMP'),
  ('FI_ECON','Economics','elective',true,'ECON')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='FI'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── GHANA ALL YEARS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'GH',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('GH_ENG','English Language','compulsory',true,'ENG'),
  ('GH_MATH','Mathematics','compulsory',true,'MATH'),
  ('GH_SCI','Integrated Science','compulsory',true,'SCI'),
  ('GH_SOS','Social Studies','compulsory',true,'HIST'),
  ('GH_RME','Religious & Moral Education','compulsory',true,'REL'),
  ('GH_GLAN','Ghanaian Language','compulsory',false,null),
  ('GH_ICT','ICT','compulsory',true,'COMP'),
  ('GH_FRN','French','elective',false,null),
  ('GH_ART','Creative Arts','compulsory',true,'ART'),
  ('GH_PE','Physical Education','compulsory',true,'PE'),
  ('GH_BIO','Biology','elective',true,'BIO'),
  ('GH_CHEM','Chemistry','elective',true,'CHEM'),
  ('GH_PHY','Physics','elective',true,'PHY'),
  ('GH_ECON','Economics','elective',true,'ECON'),
  ('GH_GEO','Geography','elective',true,'GEO'),
  ('GH_HIST','History','elective',true,'HIST'),
  ('GH_BUS','Business Management','elective',false,null),
  ('GH_ACC','Financial Accounting','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='GH'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── SOUTH AFRICA ALL YEARS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'ZA',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('ZA_HL','Home Language','compulsory',false,null),
  ('ZA_FAL','First Additional Language (English)','compulsory',true,'ENG'),
  ('ZA_MATH','Mathematics','compulsory',true,'MATH'),
  ('ZA_NS','Natural Sciences','compulsory',true,'SCI'),
  ('ZA_SS','Social Sciences','compulsory',true,'HIST'),
  ('ZA_LO','Life Orientation','compulsory',false,null),
  ('ZA_TECH','Technology','compulsory',false,null),
  ('ZA_EMS','Economic & Management Sciences','compulsory',false,null),
  ('ZA_ART','Creative Arts','compulsory',true,'ART'),
  ('ZA_BIO','Life Sciences','elective',true,'BIO'),
  ('ZA_CHEM','Physical Sciences (Chemistry)','elective',true,'CHEM'),
  ('ZA_PHY','Physical Sciences (Physics)','elective',true,'PHY'),
  ('ZA_GEO','Geography','elective',true,'GEO'),
  ('ZA_HIST','History','elective',true,'HIST'),
  ('ZA_ACC','Accounting','elective',false,null),
  ('ZA_BUS','Business Studies','elective',false,null),
  ('ZA_ECON','Economics','elective',true,'ECON'),
  ('ZA_COMP','Computer Applications Technology','elective',true,'COMP'),
  ('ZA_MATH_LIT','Mathematical Literacy','elective',true,'MATH')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='ZA'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── KENYA ALL YEARS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'KE',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('KE_ENG','English','compulsory',true,'ENG'),
  ('KE_KIS','Kiswahili','compulsory',false,null),
  ('KE_MATH','Mathematics','compulsory',true,'MATH'),
  ('KE_SCI','Science & Technology','compulsory',true,'SCI'),
  ('KE_SOS','Social Studies','compulsory',true,'HIST'),
  ('KE_RE','Religious Education','compulsory',true,'REL'),
  ('KE_ART','Creative Arts','compulsory',true,'ART'),
  ('KE_PE','Physical & Health Education','compulsory',true,'PE'),
  ('KE_COMP','Computer Science','compulsory',true,'COMP'),
  ('KE_BIO','Biology','elective',true,'BIO'),
  ('KE_CHEM','Chemistry','elective',true,'CHEM'),
  ('KE_PHY','Physics','elective',true,'PHY'),
  ('KE_GEO','Geography','elective',true,'GEO'),
  ('KE_HIST','History & Government','elective',true,'HIST'),
  ('KE_BUS','Business Studies','elective',false,null),
  ('KE_ACC','Accounting','elective',false,null),
  ('KE_AGS','Agriculture','elective',false,null)
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='KE'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── AUSTRALIA ALL YEARS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'AU',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('AU_ENG','English','compulsory',true,'ENG'),
  ('AU_MATH','Mathematics','compulsory',true,'MATH'),
  ('AU_SCI','Science','compulsory',true,'SCI'),
  ('AU_HASS','Humanities & Social Sciences','compulsory',true,'HIST'),
  ('AU_ART','The Arts','compulsory',true,'ART'),
  ('AU_TECH','Technologies','compulsory',false,null),
  ('AU_HPE','Health & Physical Education','compulsory',true,'PE'),
  ('AU_LANG','Languages','elective',false,null),
  ('AU_HIST','History','elective',true,'HIST'),
  ('AU_GEO','Geography','elective',true,'GEO'),
  ('AU_COMP','Digital Technologies','elective',true,'COMP'),
  ('AU_BIO','Biology','elective',true,'BIO'),
  ('AU_CHEM','Chemistry','elective',true,'CHEM'),
  ('AU_PHY','Physics','elective',true,'PHY'),
  ('AU_ECON','Economics & Business','elective',true,'ECON'),
  ('AU_MUS','Music','elective',true,'MUS')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='AU'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── IRELAND ALL YEARS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'IE',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('IE_ENG','English','compulsory',true,'ENG'),
  ('IE_IRISH','Irish (Gaeilge)','compulsory',false,null),
  ('IE_MATH','Mathematics','compulsory',true,'MATH'),
  ('IE_HIST','History','compulsory',true,'HIST'),
  ('IE_GEO','Geography','compulsory',true,'GEO'),
  ('IE_SCI','Science','compulsory',true,'SCI'),
  ('IE_CSPE','CSPE','compulsory',false,null),
  ('IE_SPHE','SPHE','compulsory',false,null),
  ('IE_RE','Religion','compulsory',true,'REL'),
  ('IE_ART','Art','compulsory',true,'ART'),
  ('IE_MUS','Music','elective',true,'MUS'),
  ('IE_PE','Physical Education','compulsory',true,'PE'),
  ('IE_BIO','Biology','elective',true,'BIO'),
  ('IE_CHEM','Chemistry','elective',true,'CHEM'),
  ('IE_PHY','Physics','elective',true,'PHY'),
  ('IE_ECON','Economics','elective',true,'ECON'),
  ('IE_BUS','Business Studies','elective',false,null),
  ('IE_COMP','Computer Science','elective',true,'COMP'),
  ('IE_MFL','Modern Foreign Language','elective',false,null),
  ('IE_ENGLIT','English Literature','elective',true,'ENGLIT')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='IE'
on conflict (country_code,year_group_code,subject_code) do nothing;

-- ── INDIA ALL YEARS ──
insert into country_subjects (country_code,year_group_code,subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
select 'IN',yg.year_group_code,s.subject_code,s.subject_name,s.subject_type,s.averra_teaches,s.averra_subject_code
from year_group_equivalencies yg
cross join (values
  ('IN_ENG','English','compulsory',true,'ENG'),
  ('IN_HINDI','Hindi / Regional Language','compulsory',false,null),
  ('IN_MATH','Mathematics','compulsory',true,'MATH'),
  ('IN_SCI','Science','compulsory',true,'SCI'),
  ('IN_SOS','Social Science','compulsory',true,'HIST'),
  ('IN_SANS','Sanskrit / Third Language','elective',false,null),
  ('IN_COMP','Computer Science','elective',true,'COMP'),
  ('IN_BIO','Biology','elective',true,'BIO'),
  ('IN_CHEM','Chemistry','elective',true,'CHEM'),
  ('IN_PHY','Physics','elective',true,'PHY'),
  ('IN_ECON','Economics','elective',true,'ECON'),
  ('IN_ACC','Accountancy','elective',false,null),
  ('IN_BUS','Business Studies','elective',false,null),
  ('IN_GEO','Geography','elective',true,'GEO'),
  ('IN_HIST','History','elective',true,'HIST'),
  ('IN_PE','Physical Education','elective',true,'PE'),
  ('IN_ART','Fine Arts','elective',true,'ART')
) as s(subject_code,subject_name,subject_type,averra_teaches,averra_subject_code)
where yg.country_code='IN'
on conflict (country_code,year_group_code,subject_code) do nothing;
