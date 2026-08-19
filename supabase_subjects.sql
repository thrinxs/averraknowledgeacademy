
-- Create country_subjects table
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

drop policy if exists "Public read country_subjects" on country_subjects;
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

-- ── JAPAN ALL ──
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

-- ── ESTONIA ALL ──
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

-- ── CANADA ALL ──
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

-- ── SINGAPORE ALL ──
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

-- ── FINLAND ALL ──
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

-- ── GHANA ALL ──
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

-- ── SOUTH AFRICA ALL ──
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

-- ── KENYA ALL ──
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

-- ── AUSTRALIA ALL ──
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

-- ── IRELAND ALL ──
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

-- ── INDIA ALL ──
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
