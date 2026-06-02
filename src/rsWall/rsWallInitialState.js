export const DEFAULT_SOIL_ROWS = [
  { id: 'reinforced-fill', soilData: 'Reinforced Fill Soil', cohesion: '', gamma: '', phi: '' },
  { id: 'retained-soil', soilData: 'Retained Soil', cohesion: '', gamma: '', phi: '' },
  { id: 'foundation-soil', soilData: 'Foundation Soil', cohesion: '', gamma: '', phi: '' },
];

export const initialRsWallState = {
  H: '',
  Dm: '',
  Trm: '',
  gammaRm: '',
  omega: '',
  alpha: '',
  frontSlope: '',
  backSlope: '',
  soilRows: DEFAULT_SOIL_ROWS.map((row) => ({ ...row })),
  DL: '',
  LL: '',
  SL: '',
  bf: '',
  d: '',
  seismicZone: 'III',
  Hp: '',
  Wp: '',
  concreteGrade: 'M25',
  Zj: '',
  Sv: '',
};
