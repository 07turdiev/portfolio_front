import { createI18n } from 'vue-i18n'
import uzLatn from './locales/uz-latn.json'
import uzCyrl from './locales/uz-cyrl.json'
import ru from './locales/ru.json'
import { cyrToLat, latinToCyrl } from './utils/translit'

// Tizim qo'llab-quvvatlaydigan barcha tillar (saqlangan tanlovni validatsiya
// qilish va fallback uchun). `ru` shu yerda qoladi, lekin pastdagi
// SELECTABLE_LOCALES'da vaqtincha yashirilgan.
export const SUPPORTED_LOCALES = ['uz-cyrl', 'uz-latn', 'ru']

// Frontendda til tanlash menyusida KO'RINADIGAN tillar.
// Ruscha ma'lumotlar to'liq kiritilgandan keyin 'ru' ni qayta yoqing.
export const SELECTABLE_LOCALES = [
  'uz-cyrl',
  'uz-latn'
  // 'ru'  // TODO: ruscha ma'lumotlar kiritilgandan keyin yoqiladi
]

const DEFAULT_LOCALE = 'uz-cyrl'

// Faqat tanlanishi mumkin bo'lgan til saqlangan bo'lsa tiklaymiz — aks holda
// (masalan eski 'ru' tanlovi) standart tilga qaytamiz.
const saved = localStorage.getItem('locale')
const initial = SELECTABLE_LOCALES.includes(saved) ? saved : DEFAULT_LOCALE

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initial,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    'uz-latn': uzLatn,
    'uz-cyrl': uzCyrl,
    ru
  }
})

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale.startsWith('uz') ? 'uz' : locale
}

/** Xom matnni joriy lokalga moslab transliteratsiya qiladi (ikki tomonlama).
 *  - lotin rejimi: kirill → lotin
 *  - kirill rejimi: lotin → kirill
 *  Mos yozuvdagi matn o'zgarmaydi (boshqa yozuv belgilari o'tib ketadi).
 */
function translitForLocale(text) {
  const locale = i18n.global.locale.value
  if (locale === 'uz-latn') return cyrToLat(text)
  if (locale === 'uz-cyrl') return latinToCyrl(text)
  return text
}

/** Backenddan keladigan {uz_latn, uz_cyrl, ru} dict'idan joriy lokal qiymatni qaytaradi.
 *
 * Productionda ma'lumotlar faqat bitta yozuvda (asosan kirillda) kiritilmoqda —
 * shu sababli so'ralgan til maydoni bo'sh bo'lsa, mavjud yozuvdan avtomatik
 * transliteratsiya qilamiz (kirill ↔ lotin, ikki tomonlama).
 */
export function pickLang(dict) {
  if (dict == null) return ''
  if (typeof dict === 'string') return translitForLocale(dict)

  const locale = i18n.global.locale.value
  const key = locale.replace('-', '_')
  const direct = dict[key]
  if (direct) return direct

  // So'ralgan til bo'sh — boshqa o'zbek yozuvidan transliteratsiya qilamiz
  if (key === 'uz_latn' && dict.uz_cyrl) return cyrToLat(dict.uz_cyrl)
  if (key === 'uz_cyrl' && dict.uz_latn) return latinToCyrl(dict.uz_latn)

  // Umumiy fallback
  return dict.uz_latn || dict.uz_cyrl || dict.ru || ''
}
