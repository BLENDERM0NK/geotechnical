/** Example values for RS wall design — all fields remain editable. */
export const DEFAULT_SOIL_ROWS = [
  {
    id: 'reinforced-fill',
    soilData: 'Reinforced Fill Soil',
    cohesion: '0',
    gamma: '20',
    phi: '34',
  },
  {
    id: 'retained-soil',
    soilData: 'Retained Soil',
    cohesion: '0',
    gamma: '18',
    phi: '30',
  },
  {
    id: 'foundation-soil',
    soilData: 'Foundation Soil',
    cohesion: '0',
    gamma: '19',
    phi: '28',
  },
];

export const initialRsWallState = {
  H: '8.0',
  Dm: '1.5',
  Trm: '0.5',
  gammaRm: '22',
  omega: '5',
  alpha: '85',
  frontSlope: '0',
  backSlope: '0',
  soilRows: DEFAULT_SOIL_ROWS.map((row) => ({ ...row })),
  DL: '10',
  LL: '20',
  SL: '0',
  bf: '2.0',
  d: '1.5',
  seismicZone: 'III',
  Hp: '0.5',
  Wp: '1.2',
  concreteGrade: 'M25',
  Zj: '0.5',
  Sv: '0.6',
};
