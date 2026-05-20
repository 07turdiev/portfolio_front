import axios from 'axios'
import { pickLang } from '../i18n'

const http = axios.create({
  timeout: 30000
})

// ─── Ko'makchi funksiyalar ───────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

function placeLabel(district, region) {
  const dn = pickLang(district?.name)
  const rn = pickLang(region?.name)
  if (dn && rn) return `${dn}, ${rn}`
  return dn || rn || ''
}

// ─── Yo'nalishlar ────────────────────────────────────────────────────────

export async function fetchDirections() {
  const { data } = await http.get('/api/directions')
  return {
    directions: (data.directions || []).map((d) => ({
      key: d.key,
      icon: d.icon || d.key,
      order: d.order,
      // i18n.json'dagi `directions.<key>` kalitlari mavjud — UI ulardan foydalanadi
      name: pickLang(d.name),
      count: d.count || 0,
      men: d.men || 0,
      women: d.women || 0
    }))
  }
}

// ─── Vakillar ────────────────────────────────────────────────────────────

function reshapePerson(p) {
  const residence = p.residence || null
  const region = residence?.region || null
  const district = residence?.district || null
  return {
    id: String(p.id),
    directionKey: p.directionKey,
    // Frontend xarita uchun region/district kalitlari
    regionKey: region?.slug || '',
    districtId: district?.slug || district?.soato || '',
    districtName: pickLang(district?.name),
    // Backend yuborgan tuman markazi (lat/lng) — markerlar uchun
    districtLat: district?.lat ?? null,
    districtLng: district?.lng ?? null,
    // Tug'ilgan hudud hozircha matn sifatida saqlanadi (struct emas)
    birthRegionKey: '',
    birthDistrictId: '',
    birthDistrictName: '',
    gender: p.gender,
    fullName: p.fullName,
    personal: {
      lastName: pickLang(p.lastName),
      firstName: pickLang(p.firstName),
      middleName: pickLang(p.middleName),
      nationality: p.nationalityDisplay || '',
      birthDate: formatDate(p.birthDate),
      birthPlace: pickLang(p.birthPlace),
      residencePlace: residence
        ? `${pickLang(residence.mahalla?.name)}, ${placeLabel(district, region)}`
        : ''
    },
    family: {
      maritalStatus: pickLang(p.maritalStatus),
      members: (p.family || []).map((m) => ({
        relation: m.relation,
        name: pickLang(m.name),
        info: pickLang(m.info),
        note: pickLang(m.note)
      }))
    },
    education: {
      university: pickLang(p.education?.university),
      specialty: pickLang(p.education?.specialty),
      academicDegree: pickLang(p.education?.academicDegree),
      languages: (p.education?.languages || []).map((l) => l.name).join(', '),
      training: pickLang(p.education?.training)
    },
    work: {
      position: pickLang(p.work?.position),
      careerLevel: pickLang(p.work?.careerLevel),
      totalExperience: pickLang(p.work?.totalExperience),
      leadershipExperience: pickLang(p.work?.leadershipExperience),
      leadershipPositions: pickLang(p.work?.leadershipPositions),
      health: p.work?.healthDisplay || '',
      healthKey: p.work?.health || '',
      lastMedicalTreatment: pickLang(p.work?.lastMedicalTreatment),
      medicalCheckup: pickLang(p.work?.medicalCheckup),
      healthProblems: pickLang(p.work?.healthProblems)
    },
    achievements: (p.awards || []).map((a) => ({
      year: String(a.year),
      title: pickLang(a.name)
    })),
    activity: {
      description: pickLang(p.activity?.description),
      stateEvents: pickLang(p.activity?.stateEvents)
    },
    photo: p.photo || null
  }
}

export async function fetchPeople(directionKey) {
  const { data } = await http.get('/api/people', {
    params: { direction: directionKey }
  })
  return (data.results || []).map(reshapePerson)
}

// ─── Tumanlar xaritasi (lokal SVG fayllar — backend emas) ────────────────

export async function fetchDistrictMap(regionKey) {
  const { data } = await http.get(`/api/districts/${regionKey}.json`)
  return data
}

// ─── Mukofotlar taxonomy (cascading dropdown uchun) ──────────────────────

export async function fetchAwardTaxonomy() {
  const { data } = await http.get('/api/award-taxonomy')
  return {
    affiliations: (data.affiliations || []).map((aff) => ({
      key: aff.key,
      name: pickLang(aff.name),
      types: (aff.types || []).map((tp) => ({
        key: tp.key,
        name: pickLang(tp.name),
        names: (tp.names || []).map((n) => ({
          key: n.key,
          name: pickLang(n.name)
        }))
      }))
    }))
  }
}

// Eski awards.json bilan moslik (agar biror joyda ishlatilsa)
export async function fetchAwards() {
  return fetchAwardTaxonomy()
}

// ─── Sahifa pastidagi info kartochkalari ────────────────────────────────

export async function fetchInfoCards() {
  const { data } = await http.get('/api/info-cards')
  return (data.results || []).map((c) => ({
    id: c.id,
    title: c.title,   // {uz_latn, uz_cyrl, ru}
    body: c.body,     // {uz_latn, uz_cyrl, ru}
    icon: c.icon || null,
    order: c.order,
  }))
}
