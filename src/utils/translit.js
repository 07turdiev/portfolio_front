// Uzbek Cyrillic → Latin (2019 rasmiy lotin) transliteratsiyasi.
// Backenddagi `core/management/commands/fix_mahalla_translit.py` bilan bir xil
// jadval — productionda ma'lumotlar faqat kirillda kiritilganda, sayt lotin
// rejimida ko'rsatish uchun ishlatiladi.

// Diakritika uchun rasmiy curly apostrof ' (U+2018)
const APO = '‘'

// Bigramlar — avval tekshiriladi
const DIGRAM = {
  ё: 'yo', Ё: 'Yo',
  ю: 'yu', Ю: 'Yu',
  я: 'ya', Я: 'Ya',
  ч: 'ch', Ч: 'Ch',
  ш: 'sh', Ш: 'Sh',
  ц: 'ts', Ц: 'Ts',
  ў: `o${APO}`, Ў: `O${APO}`,
  ғ: `g${APO}`, Ғ: `G${APO}`
}

// Bir harfli o'tkazishlar
const MONO = {
  а: 'a', А: 'A',
  б: 'b', Б: 'B',
  в: 'v', В: 'V',
  г: 'g', Г: 'G',
  д: 'd', Д: 'D',
  е: 'e', Е: 'E',
  ж: 'j', Ж: 'J',
  з: 'z', З: 'Z',
  и: 'i', И: 'I',
  й: 'y', Й: 'Y',
  к: 'k', К: 'K',
  л: 'l', Л: 'L',
  м: 'm', М: 'M',
  н: 'n', Н: 'N',
  о: 'o', О: 'O',
  п: 'p', П: 'P',
  р: 'r', Р: 'R',
  с: 's', С: 'S',
  т: 't', Т: 'T',
  у: 'u', У: 'U',
  ф: 'f', Ф: 'F',
  х: 'x', Х: 'X',
  ъ: APO, Ъ: APO,
  ь: '', Ь: '',
  ы: 'i', Ы: 'I',
  э: 'e', Э: 'E',
  қ: 'q', Қ: 'Q',
  ҳ: 'h', Ҳ: 'H'
}

// Natija keshi — bir xil qiymatlar (lavozimlar, viloyatlar, "Yo'q" va h.k.)
// yuzlab vakilda takrorlanadi; kesh birinchi til almashtirishni tezlashtiradi.
const _cyrLatCache = new Map()

/** Uzbek kirill matnini lotin (2019) standartiga aylantiradi. */
export function cyrToLat(text) {
  if (!text) return ''
  const cached = _cyrLatCache.get(text)
  if (cached !== undefined) return cached
  let out = ''
  for (const ch of String(text)) {
    if (DIGRAM[ch] !== undefined) out += DIGRAM[ch]
    else if (MONO[ch] !== undefined) out += MONO[ch]
    else out += ch
  }
  _cyrLatCache.set(text, out)
  return out
}

// ─── Lotin → Kirill (teskari yo'nalish) ──────────────────────────────────

// Bitta harflar uchun asosiy jadval
const singleCharMap = {
  A: 'А', a: 'а',
  B: 'Б', b: 'б',
  V: 'В', v: 'в',
  G: 'Г', g: 'г',
  D: 'Д', d: 'д',
  E: 'Е', e: 'е',
  J: 'Ж', j: 'ж',
  Z: 'З', z: 'з',
  I: 'И', i: 'и',
  Y: 'Й', y: 'й',
  K: 'К', k: 'к',
  L: 'Л', l: 'л',
  M: 'М', m: 'м',
  N: 'Н', n: 'н',
  O: 'О', o: 'о',
  P: 'П', p: 'п',
  Q: 'Қ', q: 'қ',
  R: 'Р', r: 'р',
  S: 'С', s: 'с',
  T: 'Т', t: 'т',
  U: 'У', u: 'у',
  F: 'Ф', f: 'ф',
  X: 'Х', x: 'х',
  H: 'Ҳ', h: 'ҳ',
  W: 'В', w: 'в',
  // Undoshdan keyingi apostrof (O' va G' dan tashqari) — ayirish belgisi
  "'": 'ъ'
}

// Ko'p harfli kombinatsiyalar — barcha registr variantlari bilan
const multiCharMap = {
  // 3 harfli: Yo' = Y + o' (Йў), Yo dan oldin tekshirilishi kerak
  "Yo'": 'Йў', "YO'": 'ЙЎ', "yo'": 'йў',
  // 2 harfli digraflar
  Sh: 'Ш', SH: 'Ш', sh: 'ш',
  Ch: 'Ч', CH: 'Ч', ch: 'ч',
  "O'": 'Ў', "o'": 'ў',
  "G'": 'Ғ', "g'": 'ғ',
  Yo: 'Ё', YO: 'Ё', yo: 'ё', yO: 'ё',
  Yu: 'Ю', YU: 'Ю', yu: 'ю', yU: 'ю',
  Ya: 'Я', YA: 'Я', ya: 'я', yA: 'я',
  Ye: 'Е', YE: 'Е', ye: 'е', yE: 'е',
  Ts: 'Ц', TS: 'Ц', ts: 'ц'
}

const multiCharKeys = Object.keys(multiCharMap).sort((a, b) => b.length - a.length)
const maxMultiLen = multiCharKeys.reduce((m, k) => Math.max(m, k.length), 0)

// Barcha apostrof turlarini standart ' ga almashtirish
function normalizeApostrophes(text) {
  return text.replace(/[‘’ʹʻʼʽˊˋ`´′]/g, "'")
}

const _latCyrCache = new Map()

/** Uzbek lotin matnini kirill yozuviga aylantiradi. */
export function latinToCyrl(text) {
  if (!text) return text
  const cached = _latCyrCache.get(text)
  if (cached !== undefined) return cached
  const original = text
  text = normalizeApostrophes(text)

  let result = ''
  let i = 0
  const len = text.length

  while (i < len) {
    let matched = false

    // Ko'p harfli kombinatsiyalarni tekshirish (uzundan qisqaga)
    for (let size = Math.min(maxMultiLen, len - i); size >= 2; size--) {
      const chunk = text.substring(i, i + size)
      if (multiCharMap[chunk] !== undefined) {
        result += multiCharMap[chunk]
        i += size
        matched = true
        break
      }
    }

    if (!matched) {
      const ch = text[i]
      // E/e maxsus qoidasi: so'z boshida yoki unlidan keyin → Э/э,
      // undoshdan keyin → Е/е. (Ye/ye digrafi yuqorida allaqachon ishlangan.)
      if (ch === 'e' || ch === 'E') {
        const prev = i > 0 ? text[i - 1] : ''
        const prevIsLetter = /[a-zA-Z]/.test(prev)
        const prevIsVowel = 'aeiouAEIOU'.includes(prev)
        const useEh = !prevIsLetter || prevIsVowel
        result += ch === 'E' ? (useEh ? 'Э' : 'Е') : (useEh ? 'э' : 'е')
      } else {
        result += singleCharMap[ch] !== undefined ? singleCharMap[ch] : ch
      }
      i++
    }
  }

  _latCyrCache.set(original, result)
  return result
}
