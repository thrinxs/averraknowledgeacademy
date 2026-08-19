
-- Add missing columns
alter table year_group_equivalencies
add column if not exists stage text check (stage in ('primary','junior_secondary','senior_secondary'));

alter table year_group_equivalencies
add column if not exists equivalent_uk_year text;

alter table year_group_equivalencies
add column if not exists sort_order integer;

-- Add unique constraint
alter table year_group_equivalencies
drop constraint if exists year_group_equivalencies_country_year_unique;

alter table year_group_equivalencies
add constraint year_group_equivalencies_country_year_unique
unique (country_code, year_group_code);

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;

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
on conflict (country_code,year_group_code) do update set
  stage=excluded.stage, equivalent_uk_year=excluded.equivalent_uk_year, sort_order=excluded.sort_order;
