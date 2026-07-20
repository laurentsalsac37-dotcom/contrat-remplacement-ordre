import { z } from "zod";

export const contractSchema = z
  .object({
    remplaceCivilite: z.string().min(1, "Civilité obligatoire"),
    remplaceNom: z.string().min(1, "Nom obligatoire"),
    remplacePrenom: z.string().min(1, "Prénom obligatoire"),
    remplaceNumeroOrdinal: z.string().min(1, "Numéro ordinal obligatoire"),
    remplaceNumeroRpps: z.string().min(1, "Numéro RPPS obligatoire"),
    remplaceAdresseCabinet: z.string().min(1, "Adresse du cabinet obligatoire"),
    remplaceCodePostal: z.string().min(1, "Code postal obligatoire"),
    remplaceVille: z.string().min(1, "Ville obligatoire"),
    remplaceEmail: z.string().email("E-mail invalide"),
    remplaceTelephone: z.string().min(1, "Téléphone obligatoire"),
    remplaceCpam: z.string().min(1, "CPAM de rattachement obligatoire"),

    remplacantCivilite: z.string().min(1, "Civilité obligatoire"),
    remplacantNom: z.string().min(1, "Nom obligatoire"),
    remplacantPrenom: z.string().min(1, "Prénom obligatoire"),
    remplacantNumeroOrdinal: z.string().min(1, "Numéro ordinal obligatoire"),
    remplacantNumeroRpps: z.string().min(1, "Numéro RPPS obligatoire"),
    remplacantAdresse: z.string().min(1, "Adresse obligatoire"),
    remplacantCodePostal: z.string().min(1, "Code postal obligatoire"),
    remplacantVille: z.string().min(1, "Ville obligatoire"),
    remplacantEmail: z.string().email("E-mail invalide"),
    remplacantTelephone: z.string().min(1, "Téléphone obligatoire"),
    numeroAutorisation: z.string().optional(),
    dateAutorisation: z.string().optional(),
    conseilAutorisation: z.string().optional(),
    cpamAutorisation: z.string().min(1, "CPAM concernée obligatoire"),

    statutRemplacant: z.string().min(1, "Statut du remplaçant obligatoire"),
    justificatif2400h: z.string().optional(),

    motif: z.string().min(1, "Motif obligatoire"),
    motifAutre: z.string().optional(),
    dateDebut: z.string().min(1, "Date de début obligatoire"),
    dateFin: z.string().min(1, "Date de fin obligatoire"),
    typeRemplacement: z.string().min(1, "Type de remplacement obligatoire"),
    remplacementPlus24h: z.string().min(1, "Choix obligatoire"),
    remplacementRepete: z.string().min(1, "Choix obligatoire"),
    joursPrecis: z.string().optional(),
    planningAnnexePrecision: z.string().optional(),

    exerciceEnGroupe: z.string().min(1, "Choix obligatoire"),
    typeGroupe: z.string().optional(),
    clauseAgrement: z.string().optional(),
    agrementObtenu: z.string().optional(),
    confreresInformes: z.string().optional(),
    patientsInformes: z.boolean(),
    associesInformes: z.boolean(),

    adresseExercice: z.string().min(1, "Adresse du lieu d’exercice obligatoire"),
    lieuRemplacement: z.string().min(1, "Lieu de remplacement obligatoire"),
    materielMisADisposition: z.string().optional(),
    logicielProfessionnel: z.string().optional(),
    secretariat: z.string().optional(),

    etatLieuxDebut: z.string().min(1, "Choix obligatoire"),
    etatLieuxFin: z.string().min(1, "Choix obligatoire"),
    inventaireMateriel: z.string().min(1, "Choix obligatoire"),

    modeFacturation: z.string().min(1, "Mode de facturation obligatoire"),
    dateRemiseRecettes: z.string().min(1, "Date de remise des recettes obligatoire"),
    pourcentageReverse: z.coerce.number().min(1).max(100),
    delaiReversement: z.coerce.number().min(0).max(12),
    pourcentageTiersPayant: z.coerce.number().min(1).max(100),
    delaiReversementTiersPayant: z.coerce.number().min(0).max(12),
    modalitePaiement: z.string().min(1, "Modalité de paiement obligatoire"),

    redevancePrevue: z.string().min(1, "Choix obligatoire"),
    tauxRedevance: z.coerce.number().min(0).max(100),
    assietteSoins: z.boolean(),
    assietteMajorationsNuit: z.boolean(),
    assietteDimancheFeries: z.boolean(),
    assietteFraisKilometriques: z.boolean(),
    assietteAutres: z.string().optional(),
    fraisKilometriquesExclus: z.string().min(1, "Choix obligatoire"),

    preavisCommunAccord: z.coerce.number().min(0).max(90),
    preavisManquement: z.coerce.number().min(0).max(90),

    remplacementSuperieurTroisMois: z.string().min(1, "Choix obligatoire"),
    clauseNonConcurrence: z.string().optional(),
    rayonKm: z.string().optional(),
    communesConcernees: z.string().optional(),
    dureeNonConcurrence: z.string().optional(),
    accordOrdreNonConcurrence: z.string().optional(),

    faitA: z.string().min(1, "Lieu de signature obligatoire"),
    faitLe: z.string().min(1, "Date de signature obligatoire"),
    nombreExemplaires: z.coerce.number().min(3).max(5),
    annexesSelectionnees: z.string().optional(),

    remplaceSuspendActivite: z.boolean(),
    remplacantUtiliseSaCps: z.boolean(),
    jamaisCpsDuRemplace: z.boolean(),
    remplacantIdentifiePersonnellement: z.boolean(),
    rcpValide: z.boolean(),
    autorisationValide: z.boolean(),
    pasPlusDeuxRemplacements: z.boolean(),
    transmissionOrdre: z.boolean(),
    aucuneContreLettre: z.boolean(),
    absenceInterdictionRemplace: z.boolean(),
    absenceInterdictionRemplacant: z.boolean(),
    absenceLiquidationJudiciaire: z.boolean(),
    informationCpam: z.boolean(),
    justificatifsRemuneration: z.boolean(),
    conventionNationaleInformee: z.boolean(),
    restitutionLocauxMateriel: z.boolean(),
    abandonActiviteFinMission: z.boolean(),
    deconventionnementRemplace: z.boolean(),
    deconventionnementRemplacant: z.boolean(),
    conciliationPrealable: z.boolean(),
    transmissionInformationsContinuiteSoins: z.boolean(),
  })
  .refine((data) => data.motif !== "autre" || Boolean(data.motifAutre), {
    path: ["motifAutre"],
    message: "Le motif doit être précisé.",
  })
  .refine(
    (data) =>
      data.statutRemplacant !== "non_installe" ||
      Boolean(data.numeroAutorisation),
    {
      path: ["numeroAutorisation"],
      message: "L’autorisation est obligatoire pour un remplaçant non installé.",
    }
  )
  .refine(
    (data) =>
      data.statutRemplacant !== "non_installe" ||
      Boolean(data.dateAutorisation),
    {
      path: ["dateAutorisation"],
      message: "La date d’autorisation est obligatoire.",
    }
  )
  .refine(
    (data) =>
      data.statutRemplacant !== "non_installe" ||
      Boolean(data.conseilAutorisation),
    {
      path: ["conseilAutorisation"],
      message: "Le conseil ordinal doit être renseigné.",
    }
  )
  .refine(
    (data) =>
      data.statutRemplacant !== "non_installe" ||
      Boolean(data.justificatif2400h),
    {
      path: ["justificatif2400h"],
      message: "Le justificatif des 18 mois ou 2 400 heures doit être renseigné.",
    }
  )
  .refine(
    (data) =>
      data.exerciceEnGroupe !== "oui" ||
      Boolean(data.typeGroupe),
    {
      path: ["typeGroupe"],
      message: "Le type d’exercice en groupe doit être renseigné.",
    }
  )
  .refine(
    (data) =>
      data.exerciceEnGroupe !== "oui" ||
      Boolean(data.clauseAgrement),
    {
      path: ["clauseAgrement"],
      message: "La présence ou l’absence de clause d’agrément doit être renseignée.",
    }
  )
  .refine(
    (data) =>
      data.redevancePrevue !== "oui" ||
      data.tauxRedevance > 0,
    {
      path: ["tauxRedevance"],
      message: "Le taux de redevance doit être renseigné.",
    }
  )
  .refine(
    (data) => {
      if (data.redevancePrevue === "oui") {
        return Number(data.tauxRedevance) === 100 - Number(data.pourcentageReverse || 0);
      }

      return Number(data.tauxRedevance) === 0;
    },
    {
      path: ["tauxRedevance"],
      message: "Le taux de redevance doit correspondre à 100 % moins le pourcentage reversé au remplaçant.",
    }
  )
  .refine((data) => data.patientsInformes, {
    path: ["patientsInformes"],
    message: "Confirmation obligatoire.",
  })
  .refine(
    (data) => {
      const requiresAssociesNotice =
        data.exerciceEnGroupe === "oui" &&
        ["societe", "cabinet_groupe", "exercice_commun", "cocontractants"].includes(
          String(data.typeGroupe || "")
        );

      return !requiresAssociesNotice || data.associesInformes;
    },
    {
      path: ["associesInformes"],
      message: "Confirmation obligatoire.",
    }
  )
  .refine((data) => data.remplaceSuspendActivite, {
    path: ["remplaceSuspendActivite"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.remplacantUtiliseSaCps, {
    path: ["remplacantUtiliseSaCps"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.jamaisCpsDuRemplace, {
    path: ["jamaisCpsDuRemplace"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.remplacantIdentifiePersonnellement, {
    path: ["remplacantIdentifiePersonnellement"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.rcpValide, {
    path: ["rcpValide"],
    message: "Confirmation obligatoire.",
  })
  .refine(
    (data) => data.statutRemplacant !== "non_installe" || data.autorisationValide,
    {
      path: ["autorisationValide"],
      message: "Confirmation obligatoire pour un remplaçant non installé.",
    }
  )
  .refine((data) => data.pasPlusDeuxRemplacements, {
    path: ["pasPlusDeuxRemplacements"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.transmissionOrdre, {
    path: ["transmissionOrdre"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.aucuneContreLettre, {
    path: ["aucuneContreLettre"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.absenceInterdictionRemplace, {
    path: ["absenceInterdictionRemplace"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.absenceInterdictionRemplacant, {
    path: ["absenceInterdictionRemplacant"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.absenceLiquidationJudiciaire, {
    path: ["absenceLiquidationJudiciaire"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.informationCpam, {
    path: ["informationCpam"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.justificatifsRemuneration, {
    path: ["justificatifsRemuneration"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.conventionNationaleInformee, {
    path: ["conventionNationaleInformee"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.restitutionLocauxMateriel, {
    path: ["restitutionLocauxMateriel"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.abandonActiviteFinMission, {
    path: ["abandonActiviteFinMission"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.deconventionnementRemplace, {
    path: ["deconventionnementRemplace"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.deconventionnementRemplacant, {
    path: ["deconventionnementRemplacant"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.conciliationPrealable, {
    path: ["conciliationPrealable"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.transmissionInformationsContinuiteSoins, {
    path: ["transmissionInformationsContinuiteSoins"],
    message: "Confirmation obligatoire.",
  });

export type ContractData = z.infer<typeof contractSchema>;