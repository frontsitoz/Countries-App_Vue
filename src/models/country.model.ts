export interface Country {
  name: {
    common: string;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  capital?: string[]; // <-- algunas APIs devuelven array o puede estar ausente
  population?: number;
  region?: string;
}
