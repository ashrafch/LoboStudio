import type { PhotoStage, ProjectLayout } from "./presentation";

const newConstruction =
  "archive/weebly/infoImage/nuovecostruzioni/9065343_orig.jpg";
const earlierConstruction =
  "archive/weebly/infoImage/nuovecostruzioni/2542247_orig.jpg";
const renovation =
  "archive/weebly/infoImage/ristrutturazioneErecupero/2380310_orig.jpg";
const structural =
  "archive/weebly/infoImage/Struttureedadeguamentisismici/7882772_orig.jpg";
const urban = "archive/weebly/infoImage/pianiurbanistici/4154359_orig.jpg";
const card = (name: string) =>
  "archive/weebly/infoImage/ultimiprogetti/" + name + "_orig.jpg";
const design = "Progettazione architettonica e strutturale";
const designAndWorks = design + " e direzione lavori";

type Category =
  "nuove-costruzioni" | "ristrutturazioni" | "strutture" | "piani-urbanistici";
type RecordInput = {
  slug: string;
  title: string;
  category: Category;
  description: string;
  summary?: string;
  presentation?: ProjectLayout;
  sources: string[];
  location?: string;
  period?: string;
  role?: string;
  featured?: boolean;
  gallery?: {
    file: string;
    alt: string;
    caption?: string;
    stage?: PhotoStage;
  }[];
};

function entry(input: RecordInput) {
  return {
    featured: false,
    ...input,
    gallery: input.gallery ?? [],
    status: "review" as const,
  };
}
const image = (file: string, alt: string) => ({ file, alt });

export const projectEntries = [
  entry({
    slug: "residenza-con-giardino",
    title: "Residenza con giardino",
    category: "nuove-costruzioni",
    description:
      "Il materiale di progetto mostra una residenza su due livelli con affaccio diretto sul giardino.",
    sources: ["projects/malvezza/malvezza-4-seconda-vista.jpeg"],
    featured: true,
    gallery: [
      image(
        "malvezza",
        "Rendering di una residenza a due livelli con giardino",
      ),
    ],
  }),
  entry({
    slug: "torri-residenziali",
    title: "Torri Spadini",
    category: "nuove-costruzioni",
    presentation: "racconto",
    summary: "Due torri residenziali in via Spadini, a Bologna.",
    description:
      "La scheda del 2015 descrive dieci piani fuori terra e due interrati per torre, per un totale di 40 alloggi. Le viste di progetto mostrano l’affaccio su via Spadini, le logge sfalsate e le terrazze della torre A.",
    location: "Bologna",
    period: "Scheda 2015",
    role: design,
    featured: true,
    sources: [newConstruction, card("684022")],
    gallery: [
      {
        ...image(
          "spadini",
          "Rendering delle due torri affacciate su via Spadini",
        ),
        caption: "Le due torri viste da via Spadini.",
        stage: "render",
      },
      {
        ...image(
          "torri",
          "Rendering prospettico delle torri con logge sfalsate",
        ),
        caption: "La vista prospettica evidenzia l’alternanza delle logge.",
        stage: "render",
      },
      {
        ...image(
          "spadini-torre-a",
          "Prospetto della torre A con terrazze e vegetazione",
        ),
        caption: "Terrazze e vegetazione nel prospetto della torre A.",
        stage: "render",
      },
      {
        ...image(
          "spadini-torre-b",
          "Prospetto della torre B dal fronte stradale",
        ),
        caption: "La torre B dal fronte stradale.",
        stage: "render",
      },
    ],
  }),
  entry({
    slug: "fronti-industriali",
    title: "Via Passarotti 3",
    category: "ristrutturazioni",
    description:
      "Le viste serali mostrano il fronte scandito da coperture a falda, nuovi accessi vetrati e illuminazione radente.",
    sources: ["projects/Passarotti3/"],
    featured: true,
    gallery: [
      image("esterno-notte", "Fronte serale con coperture a falda"),
      image("passarotti-scorcio", "Scorcio serale con ingressi illuminati"),
    ],
  }),
  entry({
    slug: "secchetto",
    title: "Secchetto, Isola d’Elba",
    category: "nuove-costruzioni",
    description:
      "I rendering mostrano volumi terrazzati sul pendio, spazi aperti e affacci verso il mare.",
    location: "Secchetto, Isola d’Elba",
    sources: ["projects/Secchetto_Isolad'elba/"],
    featured: true,
    gallery: [
      image(
        "secchetto-strada",
        "Rendering del fronte stradale e dei muri in pietra",
      ),
      image("secchetto-mare", "Rendering di un affaccio residenziale sul mare"),
      image(
        "secchetto-panorama",
        "Vista panoramica dei volumi terrazzati sul pendio",
      ),
    ],
  }),
  entry({
    slug: "le-torri-del-parco",
    title: "Le Torri del Parco",
    category: "nuove-costruzioni",
    description:
      "Le fotografie documentano il ritmo dei balconi e le diverse prospettive di un complesso residenziale a torre.",
    sources: ["projects/letorridelparco/"],
    gallery: [
      image("parco-scorcio", "Veduta di scorcio del complesso"),
      image("parco-balconi", "Balconi sovrapposti in prospettiva"),
      image("parco-prospetto", "Prospetto frontale di una delle torri"),
    ],
  }),
  entry({
    slug: "via-enriques-3",
    title: "Via Enriques 3",
    category: "nuove-costruzioni",
    description:
      "Due viste di progetto mostrano la composizione dei balconi, l’ingresso e il fronte verso il cortile.",
    sources: ["projects/Enriques3/"],
    gallery: [
      image(
        "enriques-ingresso",
        "Rendering dell’ingresso e del fronte residenziale",
      ),
      image("enriques-cortile", "Rendering del prospetto dal cortile interno"),
    ],
  }),
  entry({
    slug: "rodriguez",
    title: "Rodriguez",
    category: "nuove-costruzioni",
    description:
      "I due rendering presentano un edificio residenziale in altezza con logge e un corpo verticale dal rivestimento più scuro.",
    sources: ["projects/Rodriguez/"],
    gallery: [
      image("rodriguez-strada", "Rendering dell’edificio visto dalla strada"),
      image("rodriguez-angolo", "Rendering d’angolo con logge e vegetazione"),
    ],
  }),
  entry({
    slug: "arcoveggio-48",
    title: "Arcoveggio 48",
    category: "ristrutturazioni",
    description:
      "Una vista di progetto racconta il rapporto tra l’edificio, le terrazze e la strada.",
    sources: ["projects/Arcoveggio48/"],
    gallery: [
      image("arcoveggio-strada", "Rendering della facciata vista dalla strada"),
    ],
  }),
  entry({
    slug: "emilia-levante-98",
    title: "Via Emilia Levante 98",
    category: "ristrutturazioni",
    description:
      "Due viste dello stesso edificio residenziale permettono di leggere prospetto, accessi e articolazione dei balconi.",
    sources: ["projects/EmiliaLevante98/"],
    gallery: [
      image(
        "emilia-levante-prospetto",
        "Veduta prospettica dei balconi e del fronte",
      ),
      image(
        "emilia-levante-fronte",
        "Veduta frontale dell’edificio e dell’ingresso",
      ),
    ],
  }),
  entry({
    slug: "facciata-e-percorsi",
    title: "Facciata e percorsi",
    category: "ristrutturazioni",
    description:
      "Vetrate e ingressi si alternano lungo un percorso esterno pavimentato.",
    sources: ["projects/pganino/pganino-2_orig.jpeg"],
    gallery: [
      image(
        "pganino",
        "Vista prospettica del percorso esterno davanti alle vetrate",
      ),
    ],
  }),
  entry({
    slug: "lottizzazione-monte-san-pietro",
    title: "Lottizzazione Monte San Pietro",
    category: "piani-urbanistici",
    description:
      "L’archivio riporta la lottizzazione per il Consorzio Monte San Pietro. La vista aerea offre una lettura degli insediamenti, dei percorsi e del territorio circostante.",
    location: "Monte San Pietro",
    period: "1997–1998",
    sources: [
      urban,
      "projects/pianiUrbanistici/lottizzazione-monte-san-pietro.jpg",
    ],
    gallery: [
      image(
        "monte-san-pietro",
        "Veduta aerea della lottizzazione di Monte San Pietro",
      ),
    ],
  }),
  entry({
    slug: "urbanistica-immagini",
    title: "Territorio e insediamenti",
    category: "piani-urbanistici",
    description:
      "Due immagini dell’archivio urbanistico mostrano la scala del territorio e quella del singolo lotto.",
    sources: ["projects/pianiUrbanistici/"],
    gallery: [
      image("urbanistica-aerea", "Veduta aerea di viabilità e isolati"),
      image("poggio-lotti", "Veduta da strada di un gruppo di abitazioni"),
    ],
  }),
  entry({
    slug: "cantieri-strutturali",
    title: "Cantieri e dettagli strutturali",
    category: "strutture",
    description:
      "Selezione dall’archivio di cantiere dello studio. Fondazioni, solai e interventi sull’esistente raccontano il lavoro strutturale a diverse scale.",
    sources: ["projects/strutture/"],
    gallery: [
      image(
        "strutture-fondazioni",
        "Vista dall’alto degli scavi e delle armature",
      ),
      image("strutture-platea", "Getto di fondazione in un cantiere urbano"),
      image("strutture-casseforme", "Casseforme e armature in cantiere"),
      image(
        "strutture-paratia",
        "Paratia a pali lungo il perimetro dello scavo",
      ),
      image("strutture-gru", "Fase di cantiere con gru e solaio"),
      image(
        "strutture-muratura",
        "Dettaglio di una volta e delle opere provvisionali",
      ),
      image(
        "strutture-copertura",
        "Interno industriale con struttura di copertura a vista",
      ),
      image("strutture-ponteggi", "Edificio in muratura con ponteggi"),
      image("strutture-solaio", "Posa degli elementi del solaio"),
      image(
        "strutture-controventi",
        "Controventi metallici in un ambiente in ristrutturazione",
      ),
    ],
  }),
];

type ArchiveRow = [
  slug: string,
  title: string,
  location: string,
  period: string,
  description: string,
  role?: string,
  extraSource?: string,
];

const archivalGalleries: Record<string, NonNullable<RecordInput["gallery"]>> = {
  "via-toffano": [
    image(
      "toffano-facciata",
      "Facciata storica in laterizio e basamento intonacato",
    ),
    image("toffano-interno", "Interno recuperato con travi lignee a vista"),
  ],
  "officine-arcoveggio": [
    image("officine-loft", "Interno di un loft con scala e soppalco bianchi"),
    image(
      "officine-corridoio",
      "Corridoio delle Officine Arcoveggio con illuminazione a soffitto",
    ),
  ],
  tagliacozzi: [
    image(
      "tagliacozzi-balconi",
      "Dettaglio della facciata con balconi e parapetti metallici",
    ),
  ],
  borgonuovo: [
    image(
      "borgonuovo-terrazze",
      "Affacci e terrazze delle abitazioni del complesso Borgonuovo",
    ),
    image(
      "borgonuovo-modello",
      "Modello architettonico del complesso residenziale",
    ),
  ],
  "san-pier-tommaso": [
    image(
      "san-pier-tommaso-render",
      "Rendering dell’edificio e delle terrazze in via San Pier Tommaso",
    ),
  ],
};

function archive(category: Category, source: string, rows: ArchiveRow[]) {
  return rows.map(
    ([slug, title, location, period, description, role, extraSource]) =>
      entry({
        slug,
        title,
        category,
        location,
        period,
        description,
        role,
        gallery: archivalGalleries[slug],
        sources: extraSource ? [source, extraSource] : [source],
      }),
  );
}

export const historicalEntries = [
  ...archive("nuove-costruzioni", newConstruction, [
    [
      "san-pier-tommaso",
      "Via San Pier Tommaso",
      "Bologna",
      "Scheda 2015",
      "Nuova palazzina residenziale di sette piani fuori terra e un piano interrato destinato ad autorimesse.",
      design,
      "archive/weebly/infoImage/nuovecostruzioni/9857251_orig.jpg",
    ],
    [
      "residenza-porta-saffi",
      "Residenza Porta Saffi",
      "Bologna",
      "Scheda 2015",
      "Intervento residenziale per ricucire un vuoto urbano. La scheda descrive terrazze a sud, schermature solari e autorimesse al piano interrato.",
      undefined,
      card("1190611"),
    ],
    [
      "tagliacozzi",
      "Via Tagliacozzi",
      "Bologna",
      "2010–2013",
      "Demolizione dell’esistente e nuovo edificio residenziale di quattro piani fuori terra, con autorimesse integrate nella pendenza del lotto.",
      designAndWorks,
      card("764207"),
    ],
    [
      "san-pio-v",
      "Via San Pio V",
      "Bologna",
      "Dal 2013",
      "Edificio residenziale con cinque piani fuori terra e un piano interrato.",
      design + " e direzione lavori strutturale",
    ],
    [
      "via-giacinto",
      "Via Giacinto",
      "Bologna",
      "2010–2013",
      "Fabbricato residenziale di tre piani fuori terra.",
      designAndWorks + " e collaudo",
    ],
    [
      "cadriano",
      "Residenza a Cadriano",
      "Cadriano di Granarolo",
      "2010–2013",
      "Fabbricato di 22 alloggi, con cinque piani fuori terra e uno interrato.",
      designAndWorks,
    ],
    [
      "montecalderaro-cesi",
      "Villette nella lottizzazione C.E.S.I.",
      "Montecalderaro",
      "2008–2012",
      "Progetto per quattro villette a schiera nella lottizzazione C.E.S.I.",
      designAndWorks,
    ],
    [
      "villa-montecalderaro",
      "Villa a Montecalderaro",
      "Montecalderaro",
      "2008–2012",
      "Progetto di una villa residenziale indipendente.",
      designAndWorks,
    ],
    [
      "torre-marzabotto",
      "Torre di via Marzabotto",
      "Bologna",
      "2008–2012",
      "Torre per abitazioni e uffici con undici piani fuori terra e tre livelli interrati destinati ad autorimesse.",
      designAndWorks,
    ],
  ]),
  ...archive("nuove-costruzioni", earlierConstruction, [
    [
      "borgonuovo",
      "Complesso Borgonuovo",
      "Sasso Marconi",
      "2005–2008",
      "Complesso di sedici abitazioni a schiera, con giardini privati e tipologie differenziate.",
      designAndWorks,
      card("3115656"),
    ],
    [
      "torreggiani",
      "Via Torreggiani",
      "San Lazzaro di Savena",
      "2008",
      "Progetto per un edificio residenziale in via Torreggiani.",
      designAndWorks,
    ],
    [
      "galeotti",
      "Via Galeotti",
      "San Lazzaro di Savena",
      "2006–2008",
      "Progetto di un complesso residenziale in via Galeotti.",
      designAndWorks,
    ],
    [
      "montenero",
      "Via Montenero 8",
      "Bologna",
      "2007–2008",
      "Fabbricato residenziale di quattordici unità in via Montenero.",
      designAndWorks + " e collaudo",
    ],
    [
      "croara",
      "Residenze alla Croara",
      "San Lazzaro di Savena",
      "2006–2008",
      "Intervento residenziale con otto villette bifamiliari.",
      designAndWorks,
    ],
    [
      "frullo",
      "Via del Frullo",
      "Castenaso",
      "2004–2005",
      "Intervento residenziale di ventiquattro alloggi.",
      designAndWorks,
    ],
    [
      "pallavicini",
      "Via Pallavicini · Ex Caldaie Franchini",
      "Bologna",
      "2004–2006",
      "Intervento di ottantadue unità immobiliari nell’area delle ex Caldaie Franchini.",
      designAndWorks,
    ],
    [
      "botticelli",
      "Via Botticelli",
      "Casalecchio di Reno",
      "2004–2005",
      "Progetto di un nuovo edificio residenziale in via Botticelli.",
      designAndWorks,
    ],
    [
      "residenze-zona-b",
      "Edifici residenziali in Zona B",
      "Casalecchio di Reno",
      "2004–2006",
      "Il portfolio storico registra due incarichi per edifici residenziali nella Zona B.",
      designAndWorks,
    ],
  ]),
  ...archive("ristrutturazioni", renovation, [
    [
      "officine-arcoveggio",
      "Officine Arcoveggio",
      "Bologna",
      "2014–2015",
      "Recupero di un’autofficina in via Manin e riconversione in sette loft con soppalco.",
      "Progettazione architettonica e direzione lavori",
      card("6079670"),
    ],
    [
      "via-toffano",
      "Via Toffano 6",
      "Bologna",
      "2010–2013",
      "Restauro di un edificio residenziale di interesse culturale. La scheda storica riporta la riqualificazione energetica di quindici appartamenti e descrive il recupero del paramento in laterizio, del parapetto a balaustrini e delle nicchie in facciata.",
      designAndWorks,
      card("3505520"),
    ],
    [
      "via-canova",
      "Recupero in via Canova",
      "San Lazzaro di Savena",
      "2014",
      "Recupero di una villetta residenziale degli anni Sessanta.",
      "Progettazione architettonica",
    ],
    [
      "relais-valfiore",
      "Relais Valfiore",
      "San Lazzaro di Savena",
      "2005–2012",
      "Realizzazione e successivo ampliamento di un complesso alberghiero con centro congressi, spa e piscina.",
      designAndWorks,
    ],
    [
      "recupero-undici-alloggi",
      "Recupero residenziale a Bologna",
      "Bologna",
      "2006–2007",
      "Recupero di un edificio esistente con ricavo di undici alloggi.",
      designAndWorks,
    ],
    [
      "ex-macello",
      "Recupero dell’ex Macello",
      "Casalecchio di Reno",
      "2006",
      "Progetto per il recupero dell’edificio storico dell’ex Macello.",
      "Progettazione architettonica",
    ],
    [
      "via-san-felice",
      "Recupero in via San Felice",
      "Bologna",
      "2004–2005",
      "Recupero di un edificio storico con settantadue alloggi, spazi commerciali e parcheggi interrati.",
      design,
    ],
    [
      "via-ferrarese",
      "Recupero in via Ferrarese",
      "Bologna",
      "2004–2005",
      "Recupero di un complesso settecentesco per trentadue alloggi.",
      designAndWorks,
    ],
    [
      "beverara",
      "Recupero alla Beverara",
      "Bologna",
      "2004–2005",
      "Recupero di edifici storici per ventuno alloggi.",
      designAndWorks,
    ],
    [
      "rustici-anzola-calderara",
      "Recupero di rustici",
      "Anzola e Calderara",
      "2000–2002",
      "Interventi di recupero del patrimonio rurale.",
      designAndWorks,
    ],
    [
      "parco-dei-gessi",
      "Rustici nel Parco dei Gessi",
      "Bologna",
      "1996–2006",
      "Recupero di edifici rurali nel contesto del Parco dei Gessi.",
      designAndWorks,
    ],
  ]),
  ...archive("strutture", structural, [
    [
      "casolari-maccaferro",
      "Casolari di via Maccaferro",
      "Bologna",
      "2014–2015",
      "Adeguamento strutturale di due casolari storici.",
    ],
    [
      "via-irnerio",
      "Soppalchi in via Irnerio",
      "Bologna",
      "2014",
      "Inserimento di soppalchi nell’ambito della ristrutturazione parziale di un edificio storico.",
      "Progettazione e direzione lavori strutturale",
    ],
    [
      "via-cavriola",
      "Rinforzo in via Cavriola",
      "Bologna",
      "2013–2015",
      "Rinforzo strutturale di un edificio storico settecentesco.",
    ],
    [
      "bue-nero",
      "Ristorante Bue Nero",
      "Calderino, Monte San Pietro",
      "2014",
      "Progetto strutturale per il ristorante Bue Nero.",
    ],
    [
      "via-toscana",
      "Palazzina in via Toscana",
      "Bologna",
      "2013",
      "Ristrutturazione di una palazzina di cinque piani fuori terra.",
      "Progettazione e direzione lavori strutturale",
    ],
    [
      "sisma-emilia-imprese",
      "Interventi post-sisma su attività produttive",
      "Emilia",
      "2012",
      "Interventi urgenti per rimuovere carenze strutturali e migliorare il comportamento sismico di fabbricati produttivi.",
    ],
    [
      "polo-scolastico-zola",
      "Polo scolastico di Zola Predosa",
      "Zola Predosa",
      "2012–2013",
      "Progetto delle strutture per il nuovo polo scolastico.",
    ],
    [
      "ex-fornaci-andina",
      "Ex Fornaci Andina",
      "Zola Predosa",
      "2008–2011",
      "Progetto strutturale per un nuovo complesso residenziale.",
    ],
    [
      "via-dello-scalo",
      "Edificio storico in via dello Scalo",
      "Bologna",
      "2007",
      "Progetto strutturale per la ristrutturazione di un edificio storico.",
    ],
    [
      "caffe-14-luglio",
      "Caffè 14 Luglio",
      "Bologna",
      "2002",
      "Progettazione strutturale per la ristrutturazione del locale.",
    ],
    [
      "capannone-san-lazzaro",
      "Capannone industriale in acciaio",
      "San Lazzaro di Savena",
      "1999",
      "Progetto strutturale per un capannone industriale con struttura in acciaio.",
    ],
    [
      "centro-commerciale-mirandola",
      "Centro commerciale a Mirandola",
      "Mirandola",
      "1997",
      "Progettazione strutturale per un centro commerciale.",
    ],
  ]),
  ...archive("piani-urbanistici", urban, [
    [
      "zona-b-casalecchio",
      "Zona B di Casalecchio di Reno",
      "Casalecchio di Reno",
      "2001–2008",
      "Intervento urbanistico indicato nell’archivio dello studio come Zona B.",
    ],
    [
      "arredo-urbano-calderara",
      "Arredo urbano di via Roma",
      "Calderara di Reno",
      "2003–2004",
      "Rifacimento dell’arredo urbano lungo via Roma.",
    ],
    [
      "ex-beca",
      "Area ex Beca",
      "Prunaro di Budrio",
      "2001–2003",
      "Intervento urbanistico riferito all’area ex Beca a Prunaro.",
    ],
  ]),
];
