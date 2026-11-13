// Supabase Configuration — DataUPIK POLISAS
const SUPABASE_URL = 'https://xwnynfvhtqjxhpkllvxa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Uu6JtyBd7mC8LaBRtl04QA_O7LOzt9Q';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Table Names (exact as in Supabase)
const TABLES = {
  admin:        'Data admin',
  pensyarah:    'Data pensyarah',
  penyelidikan: 'Data penyelidikan',
  inovasi:      'Data inovasi',
  ip:           'Data IP dan komersial',
  geran:        'Data geran',
  aset:         'Data aset tak ketara',
  penyelaras:   'Data penyelaras UPIK',
};

// Departments
const JABATAN_LIST = [
  { kod: 'JKA',  nama: 'Jabatan Kejuruteraan Awam' },
  { kod: 'JKE',  nama: 'Jabatan Kejuruteraan Elektrik' },
  { kod: 'JKM',  nama: 'Jabatan Kejuruteraan Mekanikal' },
  { kod: 'JTM',  nama: 'Jabatan Teknologi Makanan' },
  { kod: 'JP',   nama: 'Jabatan Perdagangan' },
  { kod: 'JPA',  nama: 'Jabatan Pengajian Am' },
  { kod: 'JMSK', nama: 'Jabatan Matematik, Sains dan Komputer' },
];

// 17 SDGs
const SDG_LIST = [
  '1. No Poverty',
  '2. Zero Hunger',
  '3. Good Health and Well-Being',
  '4. Quality Education',
  '5. Gender Equality',
  '6. Clean Water and Sanitation',
  '7. Affordable and Clean Energy',
  '8. Decent Work and Economic Growth',
  '9. Industry, Innovation and Infrastructure',
  '10. Reduced Inequalities',
  '11. Sustainable Cities and Communities',
  '12. Responsible Consumption and Production',
  '13. Climate Action',
  '14. Life Below Water',
  '15. Life on Land',
  '16. Peace, Justice and Strong Institutions',
  '17. Partnerships for the Goals',
];

// Year range
function getYearList() {
  const years = [];
  for (let y = 2021; y <= new Date().getFullYear() + 1; y++) years.push(y);
  return years;
}
