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

/** Uzbek kirill matnini lotin (2019) standartiga aylantiradi. */
export function cyrToLat(text) {
  if (!text) return ''
  let out = ''
  for (const ch of String(text)) {
    if (DIGRAM[ch] !== undefined) out += DIGRAM[ch]
    else if (MONO[ch] !== undefined) out += MONO[ch]
    else out += ch
  }
  return out
}
