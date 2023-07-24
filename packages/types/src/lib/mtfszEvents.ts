export interface MtfszEvent {
  esemeny_id: number
  tipus: string
  nev_1: string
  nev_2: string
  datum_tol: string
  datum_ig?: string
  helyszin_id: number
  leiras_1?: string
  leiras_2?: string
  egyeb_rendezo_1?: string
  egyeb_rendezo_2?: string
  statusz: string
  is_deleted: boolean
  created_at: string
  updated_at: string
  programok: EventSection[]
  rendezok: Organiser[]
  helyszinek: Location[]
  //intervallumok: any[]
  naptarak: Calendar[]
  hivatkozasok: Link[]
  fajlok: EventFile[]
}

export interface EventSection {
  program_id: number
  tipus: string
  idopont_tol: string
  idopont_ig?: string
  nev_1: string
  nev_2: string
  leiras_1?: string
  leiras_2?: string
  is_deleted: boolean
  created_at: string
  updated_at: string
  futam: MtfszStage
  helyszinek: Location[]
  hivatkozasok: Link[]
  fajlok: EventFile[]
}

export type EventSectionPreview = Omit<EventSection, 'helyszinek' | 'hivatkozasok' | 'fajlok'>

export interface MtfszStage {
  szakag: string
  napszak: string
  versenytav_id: number
  rangsorolo: string
  statusz: string
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export interface EventFile {
  esemeny_fajl_id: number
  fajl_id: number
  tipus: string
  nev_1: string
  nev_2: string
  url: string
  fajlnev: string
  sorszam: number
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export interface Organiser {
  rendezo_id: number
  szervezet_id: number
  kod: string
  rovid_nev_1: string
  nev_1: string
  rovid_nev_2: string
  nev_2: string
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export interface Location {
  helyszin_id: number
  lng: string
  lat: string
  megnevezes_1: string
  megnevezes_2: string
  leiras_1: string
  leiras_2: string
  is_active: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export interface Calendar {
  naptar_id: number
  nev_1: string
  nev_2: string
  is_deleted: boolean
}

export interface Link {
  hivatkozas_id: number
  megnevezes_1: string
  megnevezes_2: string
  url_1: string
  url_2: string
  sorszam: number
  is_active: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export enum EventRank {
  REGIONAL = 'REGIONALIS',
  NATIONAL = 'ORSZAGOS',
  FEATURED = 'KIEMELT',
  NONE = 'NEM',
}
