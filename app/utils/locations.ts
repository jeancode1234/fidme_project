/** Référentiel pays / villes pour le formulaire d'adresse. */
export interface CountryData {
  name: string
  center: [number, number]
  cities: string[]
}

export const COUNTRIES: CountryData[] = [
  {
    name: 'Cameroun',
    center: [4.0511, 9.7679],
    cities: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bamenda', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Kribi', 'Limbé', 'Buéa', 'Ebolowa'],
  },
  {
    name: 'Tchad',
    center: [12.1348, 15.0557],
    cities: ['N\'Djaména', 'Moundou', 'Sarh', 'Abéché'],
  },
  {
    name: 'Gabon',
    center: [0.4162, 9.4673],
    cities: ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem'],
  },
  {
    name: 'Côte d\'Ivoire',
    center: [5.3599, -4.0083],
    cities: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro'],
  },
  {
    name: 'Sénégal',
    center: [14.7167, -17.4677],
    cities: ['Dakar', 'Thiès', 'Touba', 'Saint-Louis'],
  },
]

export function countryOptions() {
  return COUNTRIES.map((c) => ({ value: c.name, label: c.name }))
}

export function citiesFor(country: string): string[] {
  return COUNTRIES.find((c) => c.name === country)?.cities ?? []
}

export function countryCenter(country: string): [number, number] {
  return COUNTRIES.find((c) => c.name === country)?.center ?? [4.0511, 9.7679]
}

/** Coordonnées approximatives connues, pour recentrer la carte sur la ville. */
const CITY_COORDS: Record<string, [number, number]> = {
  Douala: [4.0511, 9.7679],
  Yaoundé: [3.848, 11.5021],
  Bafoussam: [5.4781, 10.4176],
  Garoua: [9.3017, 13.3921],
  Bamenda: [5.9597, 10.1463],
  Maroua: [10.591, 14.3159],
  Kribi: [2.9404, 9.9097],
  Limbé: [4.0186, 9.2147],
  Libreville: [0.4162, 9.4673],
  Dakar: [14.7167, -17.4677],
  Abidjan: [5.3599, -4.0083],
}

export function cityCenter(city: string, country: string): [number, number] {
  return CITY_COORDS[city] ?? countryCenter(country)
}
