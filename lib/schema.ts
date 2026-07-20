import { z } from "zod";

const requiredString = (message: string) =>
  z.string().trim().min(1, message);

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const yesNoSchema = z.enum(["oui", "non"], {
  message: "Choix obligatoire",
});

const isoDateSchema = (message: string) =>
  requiredString(message).refine(
    (value) => !Number.isNaN(new Date(`${value}T12:00:00`).getTime()),
    {
      message: "Date invalide",
    }
  );

function dateTimestamp(value: string) {
  return new Date(`${value}T12:00:00`).getTime();
}

export const contractSchema = z
  .object({
    remplaceCivilite: requiredString("Civilité obligatoire"),
    remplaceNom: requiredString("Nom obligatoire"),
    remplacePrenom: requiredString("Prénom obligatoire"),
    remplaceNumeroOrdinal: requiredString(
      "Numéro ordinal obligatoire"
    ),
    remplaceNumeroRpps: requiredString("Numéro RPPS obligatoire"),
    remplaceAdresseCabinet: requiredString(
      "Adresse du cabinet obligatoire"
    ),
    remplaceCodePostal: requiredString("Code postal obligatoire"),
    remplaceVille: requiredString("Ville obligatoire"),
    remplaceEmail: z
      .string()
      .trim()
      .email("Adresse électronique invalide"),
    remplaceTelephone: requiredString("Téléphone obligatoire"),
    remplaceCpam: requiredString(
      "CPAM de rattachement obligatoire"
    ),

    remplacantCivilite: requiredString("Civilité obligatoire"),
    remplacantNom: requiredString("Nom obligatoire"),
    remplacantPrenom: requiredString("Prénom obligatoire"),
    remplacantNumeroOrdinal: requiredString(
      "Numéro ordinal obligatoire"
    ),
    remplacantNumeroRpps: requiredString("Numéro RPPS obligatoire"),
    remplacantAdresse: requiredString("Adresse obligatoire"),
    remplacantCodePostal: requiredString("Code postal obligatoire"),
    remplacantVille: requiredString("Ville obligatoire"),
    remplacantEmail: z
      .string()
      .trim()
      .email("Adresse électronique invalide"),
    remplacantTelephone: requiredString("Téléphone obligatoire"),

    numeroAutorisation: requiredString(
      "Numéro d’autorisation obligatoire"
    ),
    dateAutorisation: isoDateSchema(
      "Date de délivrance obligatoire"
    ),
    dateFinValiditeAutorisation: isoDateSchema(
      "Date de fin de validité obligatoire"
    ),
    conseilAutorisation: requiredString(
      "Conseil ordinal obligatoire"
    ),
    cpamAutorisation: requiredString("CPAM concernée obligatoire"),

    statutRemplacant: z.literal("non_installe", {
      message:
        "Ce modèle concerne un infirmier sans résidence professionnelle titulaire d’une autorisation de remplacement",
    }),
    justificatif2400h: optionalString,

    motif: requiredString("Motif obligatoire"),
    motifAutre: optionalString,

    dateDebut: isoDateSchema("Date de début obligatoire"),
    dateFin: isoDateSchema("Date de fin obligatoire"),

    typeRemplacement: z.enum(
      ["continu", "jours_precis", "planning_annexe"],
      {
        message: "Type de remplacement obligatoire",
      }
    ),

    remplacementPlus24h: yesNoSchema,
    remplacementRepete: yesNoSchema,
    joursPrecis: optionalString,
    planningAnnexePrecision: optionalString,

    exerciceEnGroupe: yesNoSchema,
    typeGroupe: optionalString,
    clauseAgrement: optionalString,
    agrementObtenu: optionalString,
    confreresInformes: optionalString,
    patientsInformes: z.boolean(),
    associesInformes: z.boolean(),

    adresseExercice: requiredString(
      "Adresse du lieu d’exercice obligatoire"
    ),
    lieuRemplacement: z.literal("cabinet_remplace", {
      message:
        "Le remplacement doit avoir lieu au cabinet de l’infirmier remplacé",
    }),
    materielMisADisposition: optionalString,
    logicielProfessionnel: optionalString,
    secretariat: optionalString,

    etatLieuxDebut: yesNoSchema,
    etatLieuxFin: yesNoSchema,
    inventaireMateriel: yesNoSchema,

    modeFacturation: z.enum(
      ["cps_remplacant", "feuille_soins", "feuilles_soins"],
      {
        message: "Mode de facturation obligatoire",
      }
    ),

    dateRemiseRecettes: isoDateSchema(
      "Date de remise des recettes obligatoire"
    ),

    pourcentageReverse: z.coerce
      .number({
        message: "Pourcentage de rétrocession obligatoire",
      })
      .min(0, "Le pourcentage doit être au moins égal à 0")
      .max(100, "Le pourcentage ne peut pas dépasser 100"),

    delaiReversement: z.coerce
      .number({
        message: "Délai de reversement obligatoire",
      })
      .int("Le délai doit être exprimé en jours entiers")
      .min(0, "Le délai ne peut pas être négatif")
      .max(365, "Le délai ne peut pas dépasser 365 jours"),

    pourcentageTiersPayant: z.coerce
      .number({
        message:
          "Pourcentage du tiers payant obligatoire",
      })
      .min(0, "Le pourcentage doit être au moins égal à 0")
      .max(100, "Le pourcentage ne peut pas dépasser 100"),

    delaiReversementTiersPayant: z.coerce
      .number({
        message:
          "Délai de reversement du tiers payant obligatoire",
      })
      .int("Le délai doit être exprimé en jours entiers")
      .min(0, "Le délai ne peut pas être négatif")
      .max(365, "Le délai ne peut pas dépasser 365 jours"),

    modalitePaiement: requiredString(
      "Modalité de paiement obligatoire"
    ),

    redevancePrevue: yesNoSchema,

    tauxRedevance: z.coerce
      .number({
        message: "Taux de redevance obligatoire",
      })
      .min(0, "Le taux ne peut pas être négatif")
      .max(100, "Le taux ne peut pas dépasser 100"),

    assietteSoins: z.boolean(),
    assietteMajorationsNuit: z.boolean(),
    assietteDimancheFeries: z.boolean(),
    assietteFraisKilometriques: z.boolean(),
    assietteAutres: optionalString,
    fraisKilometriquesExclus: yesNoSchema,

    preavisCommunAccord: z.coerce
      .number({
        message: "Préavis obligatoire",
      })
      .int("Le préavis doit être exprimé en jours entiers")
      .min(0, "Le préavis ne peut pas être négatif")
      .max(90, "Le préavis ne peut pas dépasser 90 jours"),

    preavisManquement: z.coerce
      .number({
        message: "Préavis obligatoire",
      })
      .int("Le préavis doit être exprimé en jours entiers")
      .min(0, "Le préavis ne peut pas être négatif")
      .max(90, "Le préavis ne peut pas dépasser 90 jours"),

    remplacementSuperieurTroisMois: yesNoSchema,
    clauseNonConcurrence: optionalString,
    rayonKm: optionalString,
    communesConcernees: optionalString,
    dureeNonConcurrence: optionalString,
    accordOrdreNonConcurrence: optionalString,
    accordOrdreNotificationConfirmee: z.boolean(),

    faitA: requiredString("Lieu de signature obligatoire"),
    faitLe: isoDateSchema("Date de signature obligatoire"),

    nombreExemplaires: z.coerce
      .number({
        message: "Nombre d’exemplaires obligatoire",
      })
      .int("Le nombre d’exemplaires doit être entier")
      .min(3, "Trois exemplaires au minimum sont requis")
      .max(10, "Le nombre d’exemplaires paraît excessif"),

    annexesSelectionnees: optionalString,
    annexeAttestationRcProf: z.boolean(),
    annexeAutorisationRemplacement: z.boolean(),
    annexeJustificatif2400h: z.boolean(),
    annexePlanning: z.boolean(),
    annexeInventaireMateriel: z.boolean(),
    annexeEtatLieuxEntree: z.boolean(),
    annexeEtatLieuxSortie: z.boolean(),
    annexeJustificatifAgrementGroupe: z.boolean(),
    annexeAutreDocument: z.boolean(),
    annexeAutreDocumentPrecision: optionalString,

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
    syntheseRelue: z.boolean(),
  })

  .refine(
    (data) =>
      data.motif !== "autre" ||
      Boolean(data.motifAutre?.trim()),
    {
      path: ["motifAutre"],
      message: "Le motif doit être précisé.",
    }
  )

  .refine(
    (data) =>
      dateTimestamp(data.dateDebut) <=
      dateTimestamp(data.dateFin),
    {
      path: ["dateFin"],
      message:
        "La date de fin doit être postérieure ou égale à la date de début.",
    }
  )

  .refine(
    (data) =>
      dateTimestamp(data.dateAutorisation) <=
      dateTimestamp(data.dateFinValiditeAutorisation),
    {
      path: ["dateFinValiditeAutorisation"],
      message:
        "La date de fin de validité doit être postérieure ou égale à la date de délivrance.",
    }
  )

  .refine(
    (data) =>
      dateTimestamp(data.dateAutorisation) <=
      dateTimestamp(data.dateDebut),
    {
      path: ["dateAutorisation"],
      message:
        "L’autorisation doit avoir été délivrée au plus tard à la date de début du remplacement.",
    }
  )

  .refine(
    (data) =>
      dateTimestamp(data.dateFin) <=
      dateTimestamp(data.dateFinValiditeAutorisation),
    {
      path: ["dateFinValiditeAutorisation"],
      message:
        "L’autorisation doit rester valide jusqu’à la fin du remplacement.",
    }
  )

  .refine(
    (data) =>
      Boolean(data.numeroAutorisation?.trim()),
    {
      path: ["numeroAutorisation"],
      message:
        "Le numéro d’autorisation de remplacement est obligatoire.",
    }
  )

  .refine(
    (data) =>
      Boolean(data.conseilAutorisation?.trim()),
    {
      path: ["conseilAutorisation"],
      message:
        "Le conseil ayant délivré l’autorisation doit être renseigné.",
    }
  )

  .refine(
    (data) =>
      Boolean(data.justificatif2400h?.trim()) ||
      data.annexeJustificatif2400h,
    {
      path: ["justificatif2400h"],
      message:
        "Le justificatif des dix-huit mois ou 2 400 heures doit être décrit ou joint en annexe.",
    }
  )

  .refine(
    (data) =>
      data.typeRemplacement !== "jours_precis" ||
      Boolean(data.joursPrecis?.trim()),
    {
      path: ["joursPrecis"],
      message:
        "Les jours concernés par le remplacement doivent être précisés.",
    }
  )

  .refine(
    (data) =>
      data.typeRemplacement !== "planning_annexe" ||
      Boolean(data.planningAnnexePrecision?.trim()),
    {
      path: ["planningAnnexePrecision"],
      message:
        "Le contenu du planning annexé doit être précisé.",
    }
  )

  .refine(
    (data) =>
      data.typeRemplacement !== "planning_annexe" ||
      data.annexePlanning,
    {
      path: ["annexePlanning"],
      message:
        "Le planning doit être sélectionné dans la liste des annexes.",
    }
  )

  .refine(
    (data) =>
      data.exerciceEnGroupe !== "oui" ||
      Boolean(data.typeGroupe?.trim()),
    {
      path: ["typeGroupe"],
      message:
        "Le type d’exercice en groupe doit être renseigné.",
    }
  )

  .refine(
    (data) =>
      data.exerciceEnGroupe !== "oui" ||
      Boolean(data.clauseAgrement?.trim()),
    {
      path: ["clauseAgrement"],
      message:
        "La présence ou l’absence d’une clause d’agrément doit être renseignée.",
    }
  )

  .refine(
    (data) =>
      data.exerciceEnGroupe !== "oui" ||
      data.clauseAgrement !== "oui" ||
      data.agrementObtenu === "oui",
    {
      path: ["agrementObtenu"],
      message:
        "L’agrément du remplaçant doit être obtenu avant le début du remplacement.",
    }
  )

  .refine(
    (data) => {
      const requiresAssociesNotice =
        data.exerciceEnGroupe === "oui" &&
        [
          "societe",
          "cabinet_groupe",
          "exercice_commun",
          "cocontractants",
        ].includes(String(data.typeGroupe || ""));

      return !requiresAssociesNotice || data.associesInformes;
    },
    {
      path: ["associesInformes"],
      message:
        "L’information des associés ou cocontractants doit être confirmée.",
    }
  )

  .refine(
    (data) =>
      data.redevancePrevue !== "oui" ||
      data.tauxRedevance > 0,
    {
      path: ["tauxRedevance"],
      message:
        "Le taux de redevance doit être supérieur à zéro lorsqu’une redevance est prévue.",
    }
  )

  .refine(
    (data) => {
      if (data.redevancePrevue === "oui") {
        return (
          Math.abs(
            data.pourcentageReverse +
              data.tauxRedevance -
              100
          ) < 0.001
        );
      }

      return (
        data.tauxRedevance === 0 &&
        data.pourcentageReverse === 100
      );
    },
    {
      path: ["tauxRedevance"],
      message:
        "La rétrocession et la redevance doivent représenter ensemble 100 %. En l’absence de redevance, le remplaçant doit recevoir 100 % des honoraires concernés.",
    }
  )

  .refine(
    (data) => {
      if (data.redevancePrevue !== "oui") {
        return true;
      }

      return Boolean(
        data.assietteSoins ||
          data.assietteMajorationsNuit ||
          data.assietteDimancheFeries ||
          data.assietteFraisKilometriques ||
          data.assietteAutres?.trim()
      );
    },
    {
      path: ["assietteSoins"],
      message:
        "L’assiette de la redevance doit comporter au moins un élément.",
    }
  )

  .refine(
    (data) =>
      !(
        data.assietteFraisKilometriques &&
        data.fraisKilometriquesExclus === "oui"
      ),
    {
      path: ["fraisKilometriquesExclus"],
      message:
        "Les indemnités kilométriques ne peuvent pas être simultanément incluses dans l’assiette et déclarées exclues.",
    }
  )

  .refine(
    (data) => data.patientsInformes,
    {
      path: ["patientsInformes"],
      message:
        "L’information des patients doit être confirmée.",
    }
  )

  .refine(
    (data) => data.remplaceSuspendActivite,
    {
      path: ["remplaceSuspendActivite"],
      message:
        "La suspension de l’activité objet du remplacement doit être confirmée.",
    }
  )

  .refine(
    (data) => data.remplacantUtiliseSaCps,
    {
      path: ["remplacantUtiliseSaCps"],
      message:
        "L’utilisation de la CPS ou e-CPS personnelle du remplaçant doit être confirmée.",
    }
  )

  .refine(
    (data) => data.jamaisCpsDuRemplace,
    {
      path: ["jamaisCpsDuRemplace"],
      message:
        "L’interdiction d’utiliser directement la CPS du remplacé doit être confirmée.",
    }
  )

  .refine(
    (data) => data.remplacantIdentifiePersonnellement,
    {
      path: ["remplacantIdentifiePersonnellement"],
      message:
        "L’identification personnelle du remplaçant doit être confirmée.",
    }
  )

  .refine(
    (data) => data.rcpValide,
    {
      path: ["rcpValide"],
      message:
        "La validité de l’assurance de responsabilité civile professionnelle doit être confirmée.",
    }
  )

  .refine(
    (data) => data.autorisationValide,
    {
      path: ["autorisationValide"],
      message:
        "La validité de l’autorisation pendant toute la période du remplacement doit être confirmée.",
    }
  )

  .refine(
    (data) => data.pasPlusDeuxRemplacements,
    {
      path: ["pasPlusDeuxRemplacements"],
      message:
        "Le remplaçant doit confirmer ne pas assurer plus de deux remplacements simultanément.",
    }
  )

  .refine(
    (data) => data.transmissionOrdre,
    {
      path: ["transmissionOrdre"],
      message:
        "La transmission du contrat au conseil de l’Ordre doit être confirmée.",
    }
  )

  .refine(
    (data) => data.aucuneContreLettre,
    {
      path: ["aucuneContreLettre"],
      message:
        "L’absence de contre-lettre doit être confirmée.",
    }
  )

  .refine(
    (data) => data.absenceInterdictionRemplace,
    {
      path: ["absenceInterdictionRemplace"],
      message:
        "L’absence d’interdiction d’exercice du remplacé doit être confirmée.",
    }
  )

  .refine(
    (data) => data.absenceInterdictionRemplacant,
    {
      path: ["absenceInterdictionRemplacant"],
      message:
        "L’absence d’interdiction d’exercice du remplaçant doit être confirmée.",
    }
  )

  .refine(
    (data) => data.absenceLiquidationJudiciaire,
    {
      path: ["absenceLiquidationJudiciaire"],
      message:
        "L’absence de liquidation judiciaire incompatible doit être confirmée.",
    }
  )

  .refine(
    (data) => data.informationCpam,
    {
      path: ["informationCpam"],
      message:
        "L’information des CPAM concernées doit être confirmée.",
    }
  )

  .refine(
    (data) => data.justificatifsRemuneration,
    {
      path: ["justificatifsRemuneration"],
      message:
        "La remise des justificatifs de rémunération doit être confirmée.",
    }
  )

  .refine(
    (data) => data.conventionNationaleInformee,
    {
      path: ["conventionNationaleInformee"],
      message:
        "L’information relative à la Convention nationale doit être confirmée.",
    }
  )

  .refine(
    (data) => data.restitutionLocauxMateriel,
    {
      path: ["restitutionLocauxMateriel"],
      message:
        "La restitution des locaux et du matériel doit être confirmée.",
    }
  )

  .refine(
    (data) => data.abandonActiviteFinMission,
    {
      path: ["abandonActiviteFinMission"],
      message:
        "La cessation de l’activité de remplacement à la fin de la mission doit être confirmée.",
    }
  )

  .refine(
    (data) => data.deconventionnementRemplace,
    {
      path: ["deconventionnementRemplace"],
      message:
        "L’absence de déconventionnement du remplacé doit être confirmée.",
    }
  )

  .refine(
    (data) => data.deconventionnementRemplacant,
    {
      path: ["deconventionnementRemplacant"],
      message:
        "L’absence de déconventionnement du remplaçant doit être confirmée.",
    }
  )

  .refine(
    (data) => data.conciliationPrealable,
    {
      path: ["conciliationPrealable"],
      message:
        "La tentative préalable de conciliation doit être acceptée.",
    }
  )

  .refine(
    (data) => data.transmissionInformationsContinuiteSoins,
    {
      path: ["transmissionInformationsContinuiteSoins"],
      message:
        "La transmission des informations nécessaires à la continuité des soins doit être confirmée.",
    }
  )

  .refine(
    (data) => data.syntheseRelue,
    {
      path: ["syntheseRelue"],
      message:
        "La vérification de la synthèse avant signature doit être confirmée.",
    }
  )

  .refine(
    (data) => {
      if (
        data.remplacementSuperieurTroisMois !== "oui"
      ) {
        return true;
      }

      return (
        data.clauseNonConcurrence === "rayon" ||
        data.clauseNonConcurrence === "communes"
      );
    },
    {
      path: ["clauseNonConcurrence"],
      message:
        "Un périmètre défini par rayon ou par communes est requis.",
    }
  )

  .refine(
    (data) => {
      if (
        data.remplacementSuperieurTroisMois !== "oui"
      ) {
        return true;
      }

      if (data.clauseNonConcurrence === "rayon") {
        const rayon = Number(data.rayonKm);

        return (
          Number.isFinite(rayon) &&
          rayon > 0
        );
      }

      return true;
    },
    {
      path: ["rayonKm"],
      message:
        "Le rayon kilométrique doit être renseigné et supérieur à zéro.",
    }
  )

  .refine(
    (data) => {
      if (
        data.remplacementSuperieurTroisMois !== "oui"
      ) {
        return true;
      }

      if (
        data.clauseNonConcurrence === "communes"
      ) {
        return Boolean(
          data.communesConcernees?.trim()
        );
      }

      return true;
    },
    {
      path: ["communesConcernees"],
      message:
        "Les communes concernées doivent être précisées.",
    }
  )

  .refine(
    (data) => {
      if (
        data.remplacementSuperieurTroisMois !== "oui"
      ) {
        return true;
      }

      return Number(data.dureeNonConcurrence) === 2;
    },
    {
      path: ["dureeNonConcurrence"],
      message:
        "La durée de non-réinstallation doit être fixée à deux ans.",
    }
  )

  .refine(
    (data) => {
      if (
        data.remplacementSuperieurTroisMois !== "oui"
      ) {
        return true;
      }

      if (
        data.accordOrdreNonConcurrence !== "oui"
      ) {
        return true;
      }

      return data.accordOrdreNotificationConfirmee;
    },
    {
      path: ["accordOrdreNotificationConfirmee"],
      message:
        "La notification de l’accord au conseil de l’Ordre doit être confirmée.",
    }
  )

  .refine(
    (data) =>
      !data.annexeAutreDocument ||
      Boolean(
        data.annexeAutreDocumentPrecision?.trim()
      ),
    {
      path: ["annexeAutreDocumentPrecision"],
      message:
        "Le contenu de l’autre document annexé doit être précisé.",
    }
  );

export type ContractData = z.infer<
  typeof contractSchema
>;