export function formatKilometersPerHour(value) {
  return `${new Intl.NumberFormat('pt-BR').format(value)} km/h`
}
