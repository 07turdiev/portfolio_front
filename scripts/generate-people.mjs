// Generates fictional mock portfolios for cultural-sector representatives.
// Output:
//   public/api/directions.json        -> [{key, icon, count, men, women}]
//   public/api/people/<direction>.json -> [{...full fictional portfolio...}]
// All data is invented; the screenshot only supplied the field structure.
import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const here = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(here, '../../data')
const PUBLIC_API = join(here, '../public/api')

const { DISTRICTS } = await import(
  pathToFileURL(join(DATA_DIR, 'districts.js')).href
)

mkdirSync(join(PUBLIC_API, 'people'), { recursive: true })

function makeRng(seed) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const pick = (rng, a) => a[Math.floor(rng() * a.length)]
const int = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1))
function pickN(rng, a, n) {
  const copy = [...a]
  const out = []
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0])
  }
  return out
}

const REGIONS = {
  andijon: 'Andijon viloyati',
  buxoro: 'Buxoro viloyati',
  jizzax: 'Jizzax viloyati',
  qashqadaryo: 'Qashqadaryo viloyati',
  navoiy: 'Navoiy viloyati',
  namangan: 'Namangan viloyati',
  samarqand: 'Samarqand viloyati',
  surxondaryo: 'Surxondaryo viloyati',
  sirdaryo: 'Sirdaryo viloyati',
  'toshkent-viloyati': 'Toshkent viloyati',
  fargona: "Farg'ona viloyati",
  xorazm: 'Xorazm viloyati',
  qoraqalpogiston: "Qoraqalpog'iston Respublikasi",
  'toshkent-shahri': 'Toshkent shahri'
}
const REGION_KEYS = Object.keys(REGIONS)

const MALE_FIRST = [
  'Farrux', 'Bobur', 'Alisher', 'Sardor', 'Jasur', 'Akmal', 'Davron',
  'Sherzod', 'Bekzod', 'Otabek', 'Aziz', 'Rustam', 'Komil', 'Dilshod',
  'Shuhrat', 'Nodir', 'Sanjar', 'Botir', 'Eldor', 'Jahongir', 'Oybek',
  'Temur', 'Husan', 'Anvar', 'Murod'
]
const FEMALE_FIRST = [
  'Nigora', 'Dilnoza', 'Madina', 'Zilola', 'Gulnora', 'Sevara', 'Mohira',
  'Kamola', 'Feruza', 'Nargiza', 'Shahzoda', 'Yulduz', 'Malika', 'Dilbar',
  'Oysha', 'Zarina', 'Gulchehra', 'Sojida', 'Munira', 'Lola', 'Nilufar',
  'Saodat', 'Maftuna', 'Charos'
]
const LAST_BASE = [
  'Karimov', 'Yusupov', 'Rahimov', 'Abdullayev', 'Saidov', 'Ergashev',
  'Qodirov', 'Mirzayev', 'Nazarov', 'Sultonov', 'Umarov', 'Hakimov',
  'Islomov', 'Aliyev', 'Tursunov', 'Hamidov', 'Sharipov', 'Zokirov',
  'Normatov', 'Rasulov', 'Yoʻldoshev', 'Egamberdiyev'
]
const PATRONYMIC_BASE = [
  'Karim', 'Rahim', 'Akmal', 'Aziz', 'Komil', 'Nodir', 'Botir', 'Anvar',
  'Olim', 'Sobir', 'Tohir', 'Zafar', 'Hamid', 'Sodiq', 'Bahrom'
]
const NATIONALITIES = [
  "O'zbek", "O'zbek", "O'zbek", "O'zbek", "O'zbek", "O'zbek",
  'Rus', 'Tojik', 'Qozoq', 'Qoraqalpoq', 'Tatar'
]
const LANGUAGES = [
  'Rus tili', 'Rus tili', 'Rus va ingliz tillari', 'Ingliz tili',
  "Yo'q", 'Rus va turk tillari'
]
const DEGREES = [
  "Yo'q", "Yo'q", "Yo'q", "Yo'q",
  "san'atshunoslik fanlari nomzodi",
  "pedagogika fanlari nomzodi",
  "san'atshunoslik fanlari doktori"
]
const YESNO_HEALTH = [
  "Jismoniy holati va sog'lig'i yaxshi",
  "Jismoniy holati va sog'lig'i qoniqarli",
  "Jismoniy holati va sog'lig'i yaxshi"
]

const DIRECTIONS = [
  {
    key: 'theater_circus',
    icon: 'theater',
    noun: "teatr va sirk san'ati vakili",
    positions: [
      'Bosh rejissyor', 'Yetakchi aktyor', 'Teatr badiiy rahbari',
      'Sirk artisti', 'Dramaturg', 'Baletmeyster', 'Sahna ustasi'
    ],
    universities: [
      "O'zbekiston davlat san'at va madaniyat instituti",
      'Toshkent teatr sanʻati instituti',
      'Respublika estrada-sirk kolleji'
    ],
    specialties: [
      'drama va kino aktyorligi', 'sahna rejissyorligi',
      'sirk janrlari', 'teatr sanʻatshunosligi'
    ],
    achievements: [
      "O'zbekistonda xizmat ko'rsatgan artist",
      "O'zbekiston xalq artisti",
      "“Shuhrat” medali sohibi",
      "“El-yurt hurmati” ordeni",
      "Xalqaro teatr festivali laureati",
      "Eng yaxshi sahna roli uchun mukofot",
      "“Yilning eng yaxshi aktyori” unvoni",
      "Respublika ko'rik-tanlovi g'olibi"
    ]
  },
  {
    key: 'education',
    icon: 'education',
    noun: "ta'lim sohasi mutaxassisi",
    positions: [
      "Bolalar musiqa maktabi direktori", 'Dotsent', 'Professor',
      'Katta oʻqituvchi', 'Metodist', "San'at maktabi mudiri"
    ],
    universities: [
      "O'zbekiston davlat konservatoriyasi",
      'Nizomiy nomidagi TDPU',
      "O'zbekiston davlat san'at va madaniyat instituti"
    ],
    specialties: [
      'musiqa pedagogikasi', 'tasviriy sanʻat oʻqitish metodikasi',
      'xoreografiya', 'madaniy-maʻrifiy faoliyat'
    ],
    achievements: [
      "Oliy toifali pedagog",
      "“Yilning eng yaxshi o'qituvchisi”",
      "Xalq ta'limi a'lochisi",
      "“Shuhrat” medali sohibi",
      "“Mehnat shuhrati” ordeni",
      "Faxriy yorliq sohibi",
      "Respublika metodik ko'rigi g'olibi"
    ]
  },
  {
    key: 'heritage',
    icon: 'heritage',
    noun: 'nomoddiy madaniy meros ustasi',
    positions: [
      "Folklor-etnografik jamoa rahbari", 'Xalq ustasi', 'Hunarmand',
      'Etnograf', "An'anaviy san'at ustasi", 'Baxshi'
    ],
    universities: [
      "O'zbekiston davlat san'at va madaniyat instituti",
      'Kamoliddin Behzod nomidagi MRDI',
      'Respublika hunarmandchilik kolleji'
    ],
    specialties: [
      'xalq amaliy sanʻati', 'folklor', 'etnografiya',
      "an'anaviy hunarmandchilik"
    ],
    achievements: [
      "“O'zbekiston hunarmandi” unvoni",
      "Xalq ustasi unvoni",
      "UNESCO faxriy yorlig'i",
      "“Shuhrat” medali sohibi",
      "Xalqaro hunarmandlar festivali laureati",
      "“El-yurt hurmati” ordeni",
      "Respublika folklor ko'rigi g'olibi"
    ]
  },
  {
    key: 'cinema',
    icon: 'cinema',
    noun: "kino san'ati vakili",
    positions: [
      'Kinorejissyor', 'Kinooperator', 'Ssenariynavis', 'Kino aktyori',
      'Montaj rejissyori', 'Prodyuser'
    ],
    universities: [
      "O'zbekiston davlat san'at va madaniyat instituti",
      'Toshkent teatr sanʻati instituti',
      'Respublika kino kolleji'
    ],
    specialties: [
      'kinorejissyorlik', 'kinooperatorlik', 'kinodramaturgiya',
      'kino va televideniye aktyorligi'
    ],
    achievements: [
      "Milliy kinofestival laureati",
      "Eng yaxshi rejissyorlik ishi uchun mukofot",
      "Xalqaro kinofestival diplomi",
      "O'zbekistonda xizmat ko'rsatgan san'at arbobi",
      "“Shuhrat” medali sohibi",
      "“Do'stlik” ordeni",
      "Respublika kino ko'rigi g'olibi"
    ]
  },
  {
    key: 'concert',
    icon: 'concert',
    noun: "konsert-tomosha san'ati vakili",
    positions: [
      'Xonanda', 'Estrada sanʻatkori', 'Bastakor',
      "Konsert dasturlari rejissyori", 'Ansambl rahbari', 'Dirijyor'
    ],
    universities: [
      "O'zbekiston davlat konservatoriyasi",
      "O'zbekiston davlat estrada-sirk san'ati kolleji",
      "O'zbekiston davlat san'at va madaniyat instituti"
    ],
    specialties: [
      'estrada vokali', 'dirijyorlik', 'bastakorlik',
      "ommaviy bayramlar rejissyorligi"
    ],
    achievements: [
      "O'zbekistonda xizmat ko'rsatgan artist",
      "O'zbekiston xalq artisti",
      "“Shuhrat” medali sohibi",
      "“El-yurt hurmati” ordeni",
      "Xalqaro estrada festivali laureati",
      "“Yilning eng yaxshi qo'shig'i” sovrindori",
      "“Oltin mikrofon” sovrindori",
      "“Do'stlik” ordeni"
    ]
  }
]

const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

function buildPerson(dir, idx) {
  const id = `${dir.key}-${String(idx + 1).padStart(3, '0')}`
  const rng = makeRng(id)
  const gender = rng() < 0.6 ? 'male' : 'female'

  const firstName = pick(rng, gender === 'male' ? MALE_FIRST : FEMALE_FIRST)
  const lastBase = pick(rng, LAST_BASE)
  const lastName =
    gender === 'female'
      ? lastBase.replace(/ev$/, 'eva').replace(/ov$/, 'ova')
      : lastBase
  const middleName =
    pick(rng, PATRONYMIC_BASE) + (gender === 'male' ? 'ovich' : 'ovna')
  const fullName = `${lastName} ${firstName} ${middleName}`

  // Birth location
  const birthRegionKey = pick(rng, REGION_KEYS)
  const birthRegionName = REGIONS[birthRegionKey]
  const birthDistrictList = DISTRICTS[birthRegionKey]?.districts ?? []
  const birthDistrict = birthDistrictList.length
    ? pick(rng, birthDistrictList)
    : null

  // Current residence (~30% have moved to a different region)
  const moved = rng() < 0.3
  let regionKey, regionName, district
  if (moved) {
    regionKey = pick(rng, REGION_KEYS)
    regionName = REGIONS[regionKey]
    const list = DISTRICTS[regionKey]?.districts ?? []
    district = list.length ? pick(rng, list) : null
  } else {
    regionKey = birthRegionKey
    regionName = birthRegionName
    district = birthDistrict
  }

  const birthYear = int(rng, 1948, 1992)
  const birthDate = `${String(int(rng, 1, 28)).padStart(2, '0')}.${pick(rng, MONTHS)}.${birthYear}`
  const age = 2026 - birthYear

  const position = pick(rng, dir.positions)
  const totalExp = Math.max(5, age - int(rng, 20, 26))
  const leadExp = Math.max(0, totalExp - int(rng, 4, 14))

  // family
  const fatherBase = pick(rng, LAST_BASE)
  const motherBase = pick(rng, LAST_BASE).replace(/ev$/, 'eva').replace(/ov$/, 'ova')
  const members = [
    {
      relation: 'father',
      name: `${fatherBase} ${pick(rng, MALE_FIRST)} ${pick(rng, PATRONYMIC_BASE)}ovich`,
      info: `${birthYear - int(rng, 22, 34)} yil, ${regionName}`,
      note:
        rng() < 0.5
          ? `${birthYear + int(rng, 30, 55)} yil vafot etgan`
          : 'Nafaqada'
    },
    {
      relation: 'mother',
      name: `${motherBase} ${pick(rng, FEMALE_FIRST)} ${pick(rng, PATRONYMIC_BASE)}ovna`,
      info: `${birthYear - int(rng, 20, 30)} yil, ${regionName}`,
      note:
        rng() < 0.4
          ? `${birthYear + int(rng, 40, 60)} yil vafot etgan`
          : 'Nafaqada'
    }
  ]
  const maritalBase = pick(rng, ['Oilali', 'Oilali', 'Oilali', 'Beva'])
  if (maritalBase === 'Oilali') {
    const spouseGender = gender === 'male' ? 'female' : 'male'
    const spouseLastBase = pick(rng, LAST_BASE)
    members.push({
      relation: 'spouse',
      name:
        spouseGender === 'female'
          ? `${spouseLastBase.replace(/ev$/, 'eva').replace(/ov$/, 'ova')} ${pick(rng, FEMALE_FIRST)} ${pick(rng, PATRONYMIC_BASE)}ovna`
          : `${spouseLastBase} ${pick(rng, MALE_FIRST)} ${pick(rng, PATRONYMIC_BASE)}ovich`,
      info: `${birthYear + int(rng, -4, 6)} yil, ${regionName}`,
      note: pick(rng, ['Uy bekasi', 'Pedagog', 'Tadbirkor', "San'atkor"])
    })
  }
  const childCount = int(rng, 0, 4)
  const maritalStatus =
    maritalBase === 'Beva'
      ? `Beva, ${childCount} nafar farzandi bor`
      : `${maritalBase}, ${childCount} nafar farzandi bor`

  // achievements
  const achCount = int(rng, 3, 10)
  const achTitles = pickN(rng, dir.achievements, Math.min(achCount, dir.achievements.length))
  let achYear = birthYear + int(rng, 24, 30)
  const achievements = achTitles.map((title) => {
    achYear += int(rng, 1, 5)
    return { year: String(Math.min(achYear, 2026)), title }
  })

  const retired = age > 60 && rng() < 0.5
  const pronoun = gender === 'male' ? 'U' : 'U'

  return {
    id,
    directionKey: dir.key,
    // Residence (used for map markers + region/district filters)
    regionKey,
    districtId: district?.id ?? null,
    districtName: district?.name ?? null,
    // Birth (display only)
    birthRegionKey,
    birthDistrictId: birthDistrict?.id ?? null,
    birthDistrictName: birthDistrict?.name ?? null,
    gender,
    fullName,
    personal: {
      lastName,
      firstName,
      middleName,
      nationality: pick(rng, NATIONALITIES),
      birthDate,
      birthPlace: birthDistrict
        ? `${birthDistrict.name}, ${birthRegionName}`
        : birthRegionName,
      residencePlace: district
        ? `${district.name}, ${regionName}`
        : regionName
    },
    family: {
      maritalStatus,
      members
    },
    education: {
      university: `${birthYear + int(rng, 18, 24)} y. ${pick(rng, dir.universities)} (kunduzgi)`,
      specialty: pick(rng, dir.specialties),
      academicDegree: pick(rng, DEGREES),
      languages: pick(rng, LANGUAGES),
      training: rng() < 0.5 ? "Yo'q" : `${2024 + int(rng, 0, 2)} y. malaka oshirgan`
    },
    work: {
      position: retired
        ? `${birthYear + age - int(rng, 1, 6)} yildan buyon nafaqada, erkin ijodkor`
        : position,
      careerLevel: pick(rng, ["Yo'q", "Yo'q", '1-toifa', 'Oliy toifa']),
      totalExperience: `${totalExp} yil`,
      leadershipExperience: leadExp > 0 ? `${leadExp} yil` : "Yo'q",
      leadershipPositions:
        leadExp > 0
          ? `${birthYear + int(rng, 26, 34)}-${birthYear + int(rng, 36, 50)} yy. – ${pick(rng, dir.positions)}`
          : "Yo'q",
      health: pick(rng, YESNO_HEALTH),
      lastMedicalTreatment:
        rng() < 0.5
          ? "Yo'q"
          : `${2022 + int(rng, 0, 3)} y. davolanish kursini o'tagan`,
      medicalCheckup: rng() < 0.7 ? "O'tgan" : "Yo'q",
      healthProblems: "Yo'q"
    },
    achievements,
    activity: {
      description:
        `${fullName} — ${regionName}da faoliyat yurituvchi iste'dodli ${dir.noun}. ` +
        `${pronoun} madaniyat sohasida ${totalExp} yildan ortiq samarali mehnat qilib kelmoqda hamda ` +
        `o'z kasbiy mahoratini doimiy oshirib bormoqda. ${pronoun} yaratgan ishlari soha ` +
        `mutaxassislari va keng jamoatchilik tomonidan yuqori baholangan. Shuningdek, ${pronoun.toLowerCase()} ` +
        `yosh avlodga ustozlik qilib, sohaning rivojiga munosib hissa qo'shib kelmoqda.`,
      stateEvents:
        "Respublikamizda o'tkaziladigan madaniy tadbirlar va davlat tantanalarida muntazam ishtirok etib keladi."
    }
  }
}

const directionsIndex = []

for (const dir of DIRECTIONS) {
  const seedRng = makeRng('count:' + dir.key)
  const count = 100 + Math.floor(seedRng() * 40)
  const people = []
  for (let i = 0; i < count; i++) people.push(buildPerson(dir, i))

  const men = people.filter((p) => p.gender === 'male').length
  const women = count - men

  writeFileSync(
    join(PUBLIC_API, 'people', `${dir.key}.json`),
    JSON.stringify(people)
  )

  directionsIndex.push({
    key: dir.key,
    icon: dir.icon,
    count,
    men,
    women
  })
}

writeFileSync(
  join(PUBLIC_API, 'directions.json'),
  JSON.stringify({ directions: directionsIndex }, null, 2)
)

console.log(
  'Done.',
  directionsIndex.map((d) => `${d.key}=${d.count}`).join(', ')
)
