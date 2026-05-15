# Portfolio Front — E-saylov clone

E-saylov.uz dizayniga 100% mos Vue 3 + Vite + Tailwind CSS asosida tuzilgan loyiha.

## O'rnatish

```bash
npm install
```

## Ishga tushirish

```bash
npm run dev
```

Brauzer avtomatik ochiladi: http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Tuzilma

```
src/
├── assets/
│   └── main.css          # Tailwind + global styles
├── components/
│   ├── MainHeader.vue    # Yuqori panel, logolar, saylov holati
│   ├── StatsSection.vue  # 4 ta statistika karta seksiya
│   ├── StatCard.vue      # Bitta statistika karta
│   ├── MapSection.vue    # O'zbekiston xaritasi
│   ├── RegionsTable.vue  # Hududlar jadvali
│   ├── CategoryGrid.vue  # 7 ta kategoriya seksiya
│   ├── CategoryCard.vue  # Bitta kategoriya karta
│   └── MainFooter.vue    # Pastki panel
├── data/
│   └── regions.js        # Statik ma'lumotlar
├── App.vue
└── main.js
```
