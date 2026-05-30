export type DcaPoint = {
  id: number;
  dbId?: string;
  date: string;
  sats: number;
  btcPriceUsd: number;
  investedBrl: number;
  platform: string;
  goal: string;
  notes?: string | null;
};

export const purchases: DcaPoint[] = [
  { id: 1, date: "2025-02-19", sats: 33930, btcPriceUsd: 96281.8, investedBrl: 200, platform: "DEPIX", goal: "Reserva" },
  { id: 2, date: "2025-02-26", sats: 39240, btcPriceUsd: 86120.4, investedBrl: 200, platform: "P2PME", goal: "Reserva" },
  { id: 3, date: "2025-03-05", sats: 35790, btcPriceUsd: 93412.2, investedBrl: 200, platform: "P2PME", goal: "Reserva" },
  { id: 4, date: "2025-03-12", sats: 30540, btcPriceUsd: 108792.2, investedBrl: 200, platform: "P2PME", goal: "Reserva" },
  { id: 5, date: "2025-03-19", sats: 32240, btcPriceUsd: 104920.7, investedBrl: 200, platform: "P2PME", goal: "Reserva" },
  { id: 6, date: "2025-03-26", sats: 16020, btcPriceUsd: 105388.6, investedBrl: 100, platform: "TRUTHER", goal: "Estudo" },
  { id: 7, date: "2025-04-02", sats: 17480, btcPriceUsd: 104910.3, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 8, date: "2025-04-09", sats: 16820, btcPriceUsd: 108034.5, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 9, date: "2025-04-16", sats: 18630, btcPriceUsd: 111220.5, investedBrl: 100, platform: "ALFRED", goal: "Reserva" },
  { id: 10, date: "2025-04-23", sats: 14503, btcPriceUsd: 118569.08, investedBrl: 100, platform: "PICNIC", goal: "Estudo" },
  { id: 11, date: "2025-04-30", sats: 14280, btcPriceUsd: 117980.4, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 12, date: "2025-05-07", sats: 14890, btcPriceUsd: 117134.2, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 13, date: "2025-05-14", sats: 13980, btcPriceUsd: 114450.2, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 14, date: "2025-05-21", sats: 14560, btcPriceUsd: 123715.99, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 15, date: "2025-05-28", sats: 15430, btcPriceUsd: 113940.2, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 16, date: "2025-06-04", sats: 15780, btcPriceUsd: 110623.5, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 17, date: "2025-06-11", sats: 15860, btcPriceUsd: 112158.8, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 18, date: "2025-06-18", sats: 15320, btcPriceUsd: 115923.3, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 19, date: "2025-06-25", sats: 15480, btcPriceUsd: 113820.7, investedBrl: 100, platform: "MEUDEPIX", goal: "Reserva" },
  { id: 20, date: "2025-07-02", sats: 15710, btcPriceUsd: 117044.9, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 21, date: "2025-07-09", sats: 15230, btcPriceUsd: 123220.6, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 22, date: "2025-07-16", sats: 15440, btcPriceUsd: 123514.92, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 23, date: "2025-07-23", sats: 15960, btcPriceUsd: 109728.4, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 24, date: "2025-07-30", sats: 16020, btcPriceUsd: 110994.8, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 25, date: "2025-08-06", sats: 16480, btcPriceUsd: 106720.1, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 26, date: "2025-08-13", sats: 17110, btcPriceUsd: 102468.3, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 27, date: "2025-08-20", sats: 17840, btcPriceUsd: 90124.8, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 28, date: "2025-08-27", sats: 18280, btcPriceUsd: 90430.5, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 29, date: "2025-09-03", sats: 19020, btcPriceUsd: 94134.4, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 30, date: "2025-09-10", sats: 19490, btcPriceUsd: 91041.5, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 31, date: "2025-09-17", sats: 20720, btcPriceUsd: 87240.2, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 32, date: "2025-09-24", sats: 18990, btcPriceUsd: 88021.6, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 33, date: "2025-10-01", sats: 20340, btcPriceUsd: 97232.4, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 34, date: "2025-10-08", sats: 19330, btcPriceUsd: 87554.9, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 35, date: "2025-10-15", sats: 18640, btcPriceUsd: 89240.1, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 36, date: "2025-10-22", sats: 18890, btcPriceUsd: 72712.4, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 37, date: "2025-10-29", sats: 20560, btcPriceUsd: 66520.3, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 38, date: "2026-01-28", sats: 20900, btcPriceUsd: 89525.35, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 39, date: "2026-02-04", sats: 27504, btcPriceUsd: 72634.42, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 40, date: "2026-02-11", sats: 28775, btcPriceUsd: 66631.66, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 41, date: "2026-02-25", sats: 56505, btcPriceUsd: 68022.06, investedBrl: 200, platform: "P2PME", goal: "Reserva" },
  { id: 42, date: "2026-03-04", sats: 26889, btcPriceUsd: 73436.98, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 43, date: "2026-03-11", sats: 26700, btcPriceUsd: 70867.29, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 44, date: "2026-03-18", sats: 26213, btcPriceUsd: 71242.99, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 45, date: "2026-03-25", sats: 26300, btcPriceUsd: 71193.34, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 46, date: "2026-04-01", sats: 27704, btcPriceUsd: 68852.89, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 47, date: "2026-04-08", sats: 26550, btcPriceUsd: 71741.24, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 48, date: "2026-04-15", sats: 26365, btcPriceUsd: 74028.34, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 49, date: "2026-04-22", sats: 24857, btcPriceUsd: 78690.65, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 50, date: "2026-04-29", sats: 25900, btcPriceUsd: 75790.2, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 51, date: "2026-05-06", sats: 30600, btcPriceUsd: 81415.54, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 52, date: "2026-05-13", sats: 24600, btcPriceUsd: 79660.04, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 53, date: "2026-05-20", sats: 25800, btcPriceUsd: 77623.62, investedBrl: 100, platform: "P2PME", goal: "Reserva" },
  { id: 54, date: "2026-05-27", sats: 49997, btcPriceUsd: 74619.77, investedBrl: 200, platform: "MEUDEPIX", goal: "Reserva" },
];

export const btcNowUsd = 73906;
export const usdBrl = 5.0613;
