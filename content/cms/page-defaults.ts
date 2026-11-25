import type { PageKey } from "./schema";

export const homeSubtitle = "Architettura e ingegneria";
export const homeCta = "Esplora i progetti";

export const pageDefaults: Record<PageKey, { title: string; intro: string }> = {
  studio: {
    title: "Lo studio",
    intro: "Architettura, ingegneria e coordinamento del progetto.",
  },
  clienti: {
    title: "Clienti e collaborazioni",
    intro:
      "Progetti e collaborazioni con committenti, imprese e professionisti.",
  },
  servizi: {
    title: "Servizi",
    intro:
      "Dalla valutazione iniziale alle verifiche in fase di realizzazione.",
  },
  contatti: {
    title: "Contatti",
    intro: "Nuovi incarichi, consulenze e collaborazioni professionali.",
  },
  stampa: {
    title: "Rassegna stampa",
    intro: "Articoli e pubblicazioni dedicati ai progetti.",
  },
  privacy: {
    title: "Privacy",
    intro: "Bozza da completare e approvare prima della pubblicazione.",
  },
  legali: {
    title: "Note legali",
    intro: "Bozza da completare e approvare prima della pubblicazione.",
  },
  sisma: {
    title: "Sisma Emilia 2012",
    intro:
      "Ricostruzione, interventi strutturali e assistenza tecnica nel contesto post-sisma.",
  },
  home: {
    title: "STUDIO LOBO",
    intro:
      "Nuove costruzioni, recupero degli edifici e progettazione strutturale.",
  },
  progetti: {
    title: "Progetti",
    intro: "Esplora l’archivio per ambito di intervento o cerca un progetto.",
  },
};
