import { createI18n } from 'vue-i18n'
import uzLatn from './locales/uz-latn.json'
import uzCyrl from './locales/uz-cyrl.json'
import ru from './locales/ru.json'

export const SUPPORTED_LOCALES = ['uz-cyrl', 'uz-latn', 'ru']
const DEFAULT_LOCALE = 'uz-cyrl'

const saved = localStorage.getItem('locale')
const initial = SUPPORTED_LOCALES.includes(saved) ? saved : DEFAULT_LOCALE

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

/** Backenddan keladigan {uz_latn, uz_cyrl, ru} dict'idan joriy lokal qiymatni qaytaradi. */
export function pickLang(dict) {
  if (dict == null) return ''
  if (typeof dict === 'string') return dict
  const locale = i18n.global.locale.value
  const key = locale.replace('-', '_')
  return dict[key] || dict.uz_latn || dict.uz_cyrl || dict.ru || ''
}
