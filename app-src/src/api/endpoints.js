// Base API v3 (JSON pulito). La v2 resta attiva per le app non aggiornate.
export const API_BASE = 'https://mangiaplastica.eurven.online/v3/'

export const EP = {
  login: 'login',
  loginToken: 'login_token',
  registrazione: 'registrazione',
  aggiorna: 'aggiorna',
  cancella: 'cancella',
  recuperaPassword: 'recupera_password',
  comuni: 'comuni',
  elencoTessere: 'elenco_tessere',
  registraTessera: 'registra_tessera',
  eliminaTessera: 'elimina_tessera',
  macchine: 'macchine',
  storico: 'storico',
  progetti: 'progetti',
  progetto: 'progetto',
  progettoAdesione: 'progetto/adesione',
  progettoRimuovi: 'progetto/rimuovi_adesione',
}
