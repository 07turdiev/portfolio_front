export function formatNumber(value) {
  if (value === null || value === undefined || value === '') return ''
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
