import type { PageKey } from "@/content/cms/schema";
import { showcaseTitle } from "@/content/projects/showcase";

// The canvas represents fixed sections in their reading order.
const sections: Record<PageKey, string[]> = {
  home: [
    "Categorie del portfolio",
    showcaseTitle,
    "Attività dello studio",
    "Profilo dello studio",
  ],
  studio: ["Profilo del fondatore", "Persone e metodo"],
  servizi: ["Competenze", "Archivio sisma Emilia 2012"],
  clienti: ["Referenze e collaborazioni"],
  stampa: ["Articoli e pubblicazioni"],
  contatti: [],
  privacy: ["Navigazione e contatti", "Informazioni in revisione"],
  legali: ["Dati professionali e crediti"],
  sisma: ["Archivio storico"],
  progetti: ["Filtri per categoria", "Ricerca e risultati"],
};

export function pageContext(key: PageKey) {
  return sections[key];
}
