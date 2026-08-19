
-- Add curriculum_authority column
alter table academy_countries
add column if not exists curriculum_authority text not null default '';

-- Insert all 13 countries with all required columns
insert into academy_countries 
(country_code, country_name, flag, curriculum_name, curriculum_authority, year_group_system, currency, language, exam_system, tier, is_active)
values
('NG','Nigeria',      '🇳🇬','Nigerian National Curriculum',   'NERDC / WAEC / NECO',                      'Primary 1-6, JSS 1-3, SS 1-3',          'NGN','English',    ARRAY['WAEC','NECO','JAMB'],      1, true),
('GB','England',      '🇬🇧','England National Curriculum',    'DfE / Ofqual',                             'Reception, Year 1-13',                   'GBP','English',    ARRAY['GCSE','A-Level'],          1, true),
('JP','Japan',        '🇯🇵','Japanese Course of Study',       'MEXT',                                     'Grade 1-12',                             'JPY','Japanese',   ARRAY['University Entrance Exam'],1, true),
('EE','Estonia',      '🇪🇪','Estonian National Curriculum',   'Ministry of Education',                    'Grade 1-12',                             'EUR','Estonian',   ARRAY['State Exam'],              1, true),
('CA','Canada',       '🇨🇦','Provincial Curricula (Ontario)', 'Provincial Ministries',                    'Grade 1-12',                             'CAD','English',    ARRAY['Provincial Exams'],        1, true),
('SG','Singapore',    '🇸🇬','Singapore Curriculum Framework', 'MOE Singapore',                            'Primary 1-6, Secondary 1-4, JC 1-2',     'SGD','English',    ARRAY['PSLE','O-Level','A-Level'],1, true),
('FI','Finland',      '🇫🇮','Finnish National Core Curriculum','Finnish National Agency for Education',   'Grade 1-12',                             'EUR','Finnish',    ARRAY['Matriculation Exam'],      1, true),
('GH','Ghana',        '🇬🇭','Ghanaian National Curriculum',   'GES / WAEC',                               'Primary 1-6, JHS 1-3, SHS 1-3',          'GHS','English',    ARRAY['BECE','WASSCE'],           1, true),
('ZA','South Africa', '🇿🇦','South African CAPS',             'DBE / Umalusi',                            'Grade 1-12',                             'ZAR','English',    ARRAY['NSC / Matric'],            1, true),
('KE','Kenya',        '🇰🇪','Kenyan CBC Curriculum',           'KNEC / KICD',                              'Grade 1-12',                             'KES','English',    ARRAY['KCPE','KCSE'],             1, true),
('AU','Australia',    '🇦🇺','Australian Curriculum',           'ACARA',                                    'Year 1-12',                              'AUD','English',    ARRAY['ATAR','HSC','VCE'],        1, true),
('IE','Ireland',      '🇮🇪','Irish National Curriculum',       'NCCA / SEC',                               '1st-6th Class, 1st-3rd Year, TY, 5th-6th Year','EUR','English', ARRAY['Junior Cert','Leaving Cert'],1, true),
('IN','India',        '🇮🇳','Indian NCERT Curriculum',         'NCERT / CBSE',                             'Class 1-12',                             'INR','English',    ARRAY['CBSE Board','ICSE'],       1, true)
on conflict (country_code) do update set
  country_name       = excluded.country_name,
  flag               = excluded.flag,
  curriculum_name    = excluded.curriculum_name,
  curriculum_authority = excluded.curriculum_authority,
  year_group_system  = excluded.year_group_system,
  currency           = excluded.currency,
  language           = excluded.language,
  exam_system        = excluded.exam_system,
  is_active          = excluded.is_active;
