// GeoJSON dan hisoblangan tuman centroidlari (lat/lng)
// SVG district ID → { lat, lng }
// Bu ma'lumotlar affine transform uchun nazorat nuqtalari sifatida ishlatiladi
// Skript: scripts/genCentroids.js orqali generatsiya qilingan

export const DISTRICT_GEO_CENTROIDS = {
  'an-olt': { lat: 40.8136, lng: 72.13 },  // Altinkul
  'an-and': { lat: 40.807, lng: 72.3937 },  // Andijan
  'an-baliq': { lat: 40.861, lng: 71.96 },  // Balikchi
  'an-boz': { lat: 40.6894, lng: 71.9393 },  // Bo'ston
  'an-bul': { lat: 40.6446, lng: 72.4579 },  // Bulakbashi
  'an-jal': { lat: 40.7577, lng: 72.6553 },  // Djalalkuduk
  'an-izb': { lat: 40.9263, lng: 72.2482 },  // Izboskan
  'an-ulug': { lat: 40.7764, lng: 71.694 },  // Ulugnar
  'an-qur': { lat: 40.8132, lng: 72.8556 },  // Kurgantepa
  'an-asa': { lat: 40.6769, lng: 72.226 },  // Asaka
  'an-mar': { lat: 40.5253, lng: 72.3416 },  // Markhamat
  'an-shax': { lat: 40.736, lng: 72.0381 },  // Shakhrixan
  'an-pax': { lat: 40.9854, lng: 72.4284 },  // Paxtaabad
  'an-xoj': { lat: 40.6326, lng: 72.5667 },  // Khadjaabad
  'an-and-sh': { lat: 40.8112, lng: 72.3225 },  // Andijan city
  'an-xon-sh': { lat: 40.8238, lng: 72.9856 },  // Khanabad city
  'bu-olot': { lat: 39.2159, lng: 64.0571 },  // Alat
  'bu-bux': { lat: 39.6649, lng: 64.475 },  // Bukhara
  'bu-vob': { lat: 39.935, lng: 64.4979 },  // Vabkent
  'bu-gij': { lat: 40.3208, lng: 64.8095 },  // Gijduvan
  'bu-kog': { lat: 39.6744, lng: 64.5466 },  // Kagan
  'bu-qor': { lat: 39.8329, lng: 63.1815 },  // Karakul
  'bu-pesh': { lat: 40.3157, lng: 63.7482 },  // Peshku
  'bu-qor-k': { lat: 39.5686, lng: 63.6906 },  // Karakul
  'bu-rom': { lat: 39.9272, lng: 64.206 },  // Rаmitan
  'bu-jon': { lat: 39.9482, lng: 63.6575 },  // Jondor
  'bu-shof': { lat: 40.3396, lng: 64.2882 },  // Shafirkan
  'bu-bux-sh': { lat: 39.7089, lng: 64.4252 },  // Bukhara city
  'bu-kog-sh': { lat: 39.6775, lng: 64.5303 },  // Kagan city
  'jiz-arn': { lat: 40.5481, lng: 67.8183 },  // Arnasay
  'jiz-bax': { lat: 39.6955, lng: 67.7627 },  // Bakhmal
  'jiz-g-al': { lat: 39.9743, lng: 67.3947 },  // Gallyaaral
  'jiz-shar': { lat: 40.0351, lng: 67.8159 },  // Sharof Rashidov
  'jiz-dos': { lat: 40.4885, lng: 68.0131 },  // Dustlik
  'jiz-zom': { lat: 39.888, lng: 68.4099 },  // Zaаmin
  'jiz-zarb': { lat: 40.1105, lng: 68.1358 },  // Zarbdar
  'jiz-mir': { lat: 40.6711, lng: 68.0248 },  // Mirzachul
  'jiz-zaf': { lat: 40.3377, lng: 67.734 },  // Zafarabad
  'jiz-pax': { lat: 40.3061, lng: 68.003 },  // Paxtakor
  'jiz-for': { lat: 40.5172, lng: 67.3529 },  // Farish
  'jiz-yan': { lat: 39.9817, lng: 68.7813 },  // Yangiabad
  'jiz-jiz-sh': { lat: 40.0888, lng: 67.8292 },  // Dzhizak city
  'qash-g`uz': { lat: 38.5479, lng: 66.159 },  // Guzar
  'qash-dex': { lat: 38.4353, lng: 66.7213 },  // Dehkanabad
  'qash-kam': { lat: 38.7453, lng: 66.8433 },  // Kamashi
  'qash-qash': { lat: 38.7609, lng: 65.8257 },  // Karshi
  'qash-kos': { lat: 39.1119, lng: 65.7763 },  // Kasan
  'qash-kit': { lat: 39.1653, lng: 67.0618 },  // Kitab
  'qash-mir': { lat: 38.818, lng: 65.1218 },  // Mirishkar
  'qash-mub': { lat: 39.24, lng: 65.4662 },  // Mubarek
  'qash-nish': { lat: 38.5154, lng: 65.6525 },  // Nishan
  'qash-kas': { lat: 38.8631, lng: 65.4576 },  // Kasbi
  'qash-chir': { lat: 39.1223, lng: 66.2959 },  // Chirakchi
  'qash-sh-tu': { lat: 38.9966, lng: 67.0683 },  // Shakhrisabz
  'qash-yak': { lat: 38.8573, lng: 66.8439 },  // Yakkabag
  'qash-qarsh': { lat: 38.8135, lng: 65.8191 },  // Karshi city
  'qash-shax': { lat: 39.0742, lng: 66.8341 },  // Shakhrisabz city
  'qash-kok': { lat: 39.1397, lng: 66.1501 },  // Ko'kdala
  'nav-kon': { lat: 40.9018, lng: 64.8741 },  // Kanimekh
  'nav-qiz': { lat: 39.8362, lng: 64.9279 },  // Kiziltepa
  'nav-nov': { lat: 40.1337, lng: 65.4001 },  // Navbakhor
  'nav-kar': { lat: 39.9907, lng: 65.2375 },  // Karmana
  'nav-nur': { lat: 40.4445, lng: 65.9324 },  // Nurata
  'nav-tom': { lat: 42.0998, lng: 65.2319 },  // Tamdi
  'nav-uchq': { lat: 42.2755, lng: 63.1919 },  // Uchkuduk
  'nav-xat': { lat: 40.1638, lng: 65.8891 },  // Khatirchi
  'nav-nav-sh': { lat: 40.0423, lng: 65.3621 },  // Navoi city
  'nav-zar-sh': { lat: 41.5055, lng: 64.1882 },  // Zarafshan city
  'nav-Gazgan': { lat: 40.5841, lng: 65.4792 },  // Gazgan city
  'nam-ming': { lat: 40.7966, lng: 71.3633 },  // Mingbulak
  'nam-kos': { lat: 41.1569, lng: 71.4932 },  // Kasansay
  'nam-nam': { lat: 40.9742, lng: 71.6409 },  // Namangan
  'nam-nor': { lat: 40.9604, lng: 71.9894 },  // Narin
  'nam-pop': { lat: 41.0452, lng: 70.7989 },  // Pap
  'nam-tur': { lat: 40.9752, lng: 71.4223 },  // Turakurgan
  'nam-uych': { lat: 41.0569, lng: 71.8655 },  // Uychi
  'nam-uchq': { lat: 41.0446, lng: 72.0806 },  // Uchkurgan
  'nam-chor': { lat: 41.2634, lng: 71.808 },  // Chartak
  'nam-chus': { lat: 41.0563, lng: 71.1951 },  // Chust
  'nam-yan': { lat: 41.3227, lng: 71.6955 },  // Yangikurgan
  'nam-nam_sh': { lat: 41.0079, lng: 71.6579 },  // Namangan city
  'nam-y-nam': { lat: 41.0595, lng: 71.6637 },  // Yangi Namangan
  'nam-dav': { lat: 41.0089, lng: 71.5909 },  // Davlatobod
  'sam-oqd': { lat: 39.806, lng: 66.7381 },  // Akdarya
  'sam-bul': { lat: 39.6957, lng: 67.3797 },  // Bulungur
  'sam-jom': { lat: 39.7606, lng: 67.1279 },  // Dzhambay
  'sam-isht': { lat: 39.9794, lng: 66.5802 },  // Ishtikhan
  'sam-kat': { lat: 39.8736, lng: 66.263 },  // Kattakurgan
  'sam-qosh': { lat: 40.2923, lng: 66.5479 },  // Koshrabad
  'sam-nar': { lat: 39.8621, lng: 65.9981 },  // Narpay
  'sam-pay': { lat: 40.0798, lng: 66.8498 },  // Payarik
  'sam-past': { lat: 39.6737, lng: 66.6639 },  // Pastdargom
  'sam-pax': { lat: 39.8902, lng: 65.5481 },  // Pakhtachi
  'sam-sam': { lat: 39.5734, lng: 66.9335 },  // Samarkand
  'sam-nur': { lat: 39.5834, lng: 66.1859 },  // Nurabad
  'sam-urg': { lat: 39.3746, lng: 67.1216 },  // Urgut
  'sam-toy': { lat: 39.5306, lng: 67.1518 },  // Taylak
  'sam-sam-sh': { lat: 39.6271, lng: 66.9655 },  // Samarkand city
  'sam-katgsh': { lat: 39.858, lng: 66.2729 },  // Kattakurgan city
  'sur-olt': { lat: 38.1649, lng: 67.7378 },  // Altinsay
  'sur-ang': { lat: 37.4476, lng: 67.2992 },  // Angor
  'sur-ban': { lat: 37.8036, lng: 67.257 },  // Bandikhan
  'sur-boy': { lat: 38.1389, lng: 67.246 },  // Baysun
  'sur-muz': { lat: 37.4021, lng: 66.8888 },  // Muzrabad
  'sur-den': { lat: 38.3155, lng: 67.8078 },  // Denau
  'sur-jar': { lat: 37.5501, lng: 67.5522 },  // Dzharkurgan
  'sur-qum': { lat: 37.9586, lng: 67.6289 },  // Kumkurgan
  'sur-qiz': { lat: 37.7104, lng: 67.3166 },  // Kizirik
  'sur-sar': { lat: 38.6819, lng: 67.8086 },  // Sariasiya
  'sur-ter': { lat: 37.272, lng: 67.4698 },  // Termez
  'sur-uzu': { lat: 38.1409, lng: 68.1294 },  // Uzun
  'sur-sher': { lat: 37.7037, lng: 66.8411 },  // Sherabad
  'sur-sho`r': { lat: 37.9727, lng: 67.8662 },  // Shurchi
  'sur-ter-sh': { lat: 37.2418, lng: 67.3296 },  // Termez city
  'sir-oqolt': { lat: 40.5308, lng: 68.3373 },  // Akaltin
  'sir-boy': { lat: 40.3233, lng: 69.0165 },  // Bayaut
  'sir-say': { lat: 40.6413, lng: 68.9019 },  // Saykhunabad
  'sir-gul': { lat: 40.4899, lng: 68.9455 },  // Gulistan
  'sir-sar': { lat: 40.2896, lng: 68.3147 },  // Sardoba
  'sir-mir': { lat: 40.4786, lng: 68.6031 },  // Mirzaabad
  'sir-sir': { lat: 40.7905, lng: 68.69 },  // Sirdarya
  'sir-xov': { lat: 40.2398, lng: 68.778 },  // Khavas
  'sr-gul-sh': { lat: 40.476, lng: 68.7586 },  // Gulistan city
  'sr-shir-sh': { lat: 40.2171, lng: 69.1168 },  // Shirin city
  'sr-yangi-s': { lat: 40.2512, lng: 68.8176 },  // Yangiyer city
  'tsh-ucht': { lat: 41.2546, lng: 69.1259 },  // Uchtepa
  'tsh-bek': { lat: 41.1893, lng: 69.2991 },  // Bektemir
  'tsh-yun': { lat: 41.3137, lng: 69.2606 },  // Yunusabad
  'tsh-mirz': { lat: 41.2983, lng: 69.3038 },  // Mirzo Ulugbek
  'tsh-mir': { lat: 41.2341, lng: 69.2663 },  // Mirabad
  'tsh-shay': { lat: 41.2905, lng: 69.1834 },  // Shaykhantokhur
  'tsh-olm': { lat: 41.3155, lng: 69.1897 },  // Almazar
  'tsh-ser': { lat: 41.1872, lng: 69.2027 },  // Sergeli
  'tsh-yak': { lat: 41.251, lng: 69.2214 },  // Yakkasaray
  'tsh-yash': { lat: 41.2561, lng: 69.309 },  // Yashnobod
  'tsh-chil': { lat: 41.2417, lng: 69.1749 },  // Chilanzar
  'tsh-y-tosh': { lat: 41.2395, lng: 69.4065 },  // Yangi Toshkent
  'tsh-y-hay': { lat: 41.2025, lng: 69.2405 },  // Yangi hayot
  'tosh-oqqr': { lat: 40.8151, lng: 69.0445 },  // Akkurgan
  'tosh-axan': { lat: 40.9803, lng: 69.9769 },  // Akhangaran
  'tosh-bek': { lat: 40.4474, lng: 69.2011 },  // Bekabad
  'tosh-bos': { lat: 41.788, lng: 70.3871 },  // Bostanlik
  'tosh-buk': { lat: 40.6872, lng: 69.1338 },  // Buka
  'tosh-quych': { lat: 40.9374, lng: 68.9706 },  // Kuyichirchik
  'tosh-zan': { lat: 41.2179, lng: 69.1107 },  // Zangiata
  'tosh-yuqch': { lat: 41.1824, lng: 69.4626 },  // Yukarichirchik
  'tosh-qib': { lat: 41.417, lng: 69.4358 },  // Kibray
  'tosh-par': { lat: 41.2634, lng: 69.7272 },  // Parkent
  'tosh-pis': { lat: 40.7954, lng: 69.4465 },  // Pskent
  'tosh-ortch': { lat: 41.0691, lng: 69.293 },  // Urtachirchik
  'tosh-chin': { lat: 40.9676, lng: 68.8105 },  // Chinaz
  'tosh-yan': { lat: 41.0988, lng: 69.0102 },  // Yangiyul
  'tosh-tosh': { lat: 41.3744, lng: 69.1803 },  // Tashkent
  'tosh-nursh': { lat: 41.0489, lng: 69.3534 },  // Nurafshon city
  'tosh-olmsh': { lat: 40.829, lng: 69.5714 },  // Almalik city
  'tosh-ang': { lat: 41.0076, lng: 70.1167 },  // Angren city
  'tosh-beksh': { lat: 40.2244, lng: 69.2538 },  // Bekabad city
  'tosh-ohash': { lat: 40.8807, lng: 69.6112 },  // Akhangaran city
  'tosh-chir': { lat: 41.4446, lng: 69.5294 },  // Chirchik city
  'tosh-yang': { lat: 41.0838, lng: 69.0274 },  // Yangiyul city
  'far-olt': { lat: 40.4515, lng: 71.4099 },  // Altiarik
  'far-qosh': { lat: 40.528, lng: 71.6407 },  // Kushtepa
  'far-bag': { lat: 40.4902, lng: 71.2056 },  // Bagdad
  'far-buv': { lat: 40.6399, lng: 71.0938 },  // Buvayda
  'far-besh': { lat: 40.393, lng: 70.568 },  // Besharik
  'far-quv': { lat: 40.509, lng: 72.0104 },  // Kuva
  'far-uchk': { lat: 40.5315, lng: 71.0204 },  // Uchkuprik
  'far-far': { lat: 40.3137, lng: 71.7929 },  // Fergana
  'far-sux': { lat: 40.0084, lng: 71.1225 },  // Sokh
  'far-tosh': { lat: 40.5515, lng: 71.8304 },  // Tashlak
  'far-uzb': { lat: 40.3471, lng: 70.8663 },  // Uzbekistan
  'far-dan': { lat: 40.6255, lng: 70.8172 },  // Dangara
  'far-fur': { lat: 40.5212, lng: 70.7351 },  // Furkat
  'far-rish': { lat: 40.3767, lng: 71.2394 },  // Rishtan
  'far-yoz': { lat: 40.6474, lng: 71.6325 },  // Yazyavan
  'far-far-sh': { lat: 40.3936, lng: 71.7959 },  // Fergana city
  'far-qo`qsh': { lat: 40.5331, lng: 70.9334 },  // Kokand city
  'far-quv-sh': { lat: 40.3279, lng: 71.9443 },  // Kuvasay city
  'far-margsh': { lat: 40.4817, lng: 71.7328 },  // Margilan city
  'xor-bog': { lat: 41.3151, lng: 60.846 },  // Bagat
  'xor-gur': { lat: 41.8246, lng: 60.2666 },  // Gurlen
  'xor-qosh': { lat: 41.4756, lng: 60.3003 },  // Koshkupir
  'xor-urg': { lat: 41.5615, lng: 60.5251 },  // Urgench
  'xor-xaz': { lat: 41.1244, lng: 61.5324 },  // Khazarasp
  'xor-xan': { lat: 41.4259, lng: 60.7417 },  // Khanka
  'xor-xiv': { lat: 41.3899, lng: 60.3896 },  // Khiva
  'xor-shov': { lat: 41.6811, lng: 60.2298 },  // Shavat
  'xor-yan': { lat: 41.3052, lng: 60.5272 },  // Yangiarik
  'xor-yangib': { lat: 41.658, lng: 60.4671 },  // Yangibazar
  'xor-urg-sh': { lat: 41.515, lng: 60.5896 },  // Urgench city
  'xor-xiv-sh': { lat: 41.3807, lng: 60.3564 },  // Khiva city
  'xor-tuproq': { lat: 41.0943, lng: 61.6573 },  // Tuprokkala
  'qr-amu': { lat: 42.1292, lng: 60.0202 },  // Amudarya
  'qr-ber': { lat: 41.942, lng: 60.7699 },  // Beruniy
  'qr-qor': { lat: 42.6828, lng: 60.0784 },  // Karauzyak
  'qr-keg': { lat: 42.8598, lng: 59.4717 },  // Kegeyli
  'qr-qun': { lat: 42.7937, lng: 58.0498 },  // Kungrad
  'qr-qon': { lat: 42.7463, lng: 59.048 },  // Kanlikul
  'qr-moy': { lat: 43.8049, lng: 59.7099 },  // Muynak
  'qr-nuk': { lat: 42.5558, lng: 59.474 },  // Nukus
  'qr-tax': { lat: 43.2612, lng: 60.8778 },  // Takhtakupir
  'qr-tur': { lat: 41.5903, lng: 61.2661 },  // Turtkul
  'qr-xoj': { lat: 42.4707, lng: 59.2981 },  // Khojeyli
  'qr-chim': { lat: 43.0371, lng: 59.5145 },  // Chimbay
  'qr-shum': { lat: 42.6508, lng: 58.9237 },  // Shumanay
  'qr-ellik': { lat: 41.9641, lng: 61.1735 },  // Ellikkala
  'qr-nuk-sh': { lat: 42.4204, lng: 59.568 },  // Nukus city
  'qr-buz': { lat: 43.0455, lng: 59.4231 },  // Buzatau
  'qr-taxi-sh': { lat: 42.3449, lng: 59.5287 },  // Takhiatash
}
