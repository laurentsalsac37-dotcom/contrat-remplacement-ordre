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
    numeroAutorisation: z.string().min(1, "Numéro d’autorisation obligatoire"),
    dateAutorisation: z.string().min(1, "Date d’autorisation obligatoire"),
    conseilAutorisation: z.string().min(1, "Conseil ordinal obligatoire"),
    cpamAutorisation: z.string().min(1, "CPAM ayant autorisé l’exercice obligatoire"),

    motif: z.string().min(1, "Motif obligatoire"),
    motifAutre: z.string().optional(),
    dateDebut: z.string().min(1, "Date de début obligatoire"),
    dateFin: z.string().min(1, "Date de fin obligatoire"),
    typeRemplacement: z.string().min(1, "Type de remplacement obligatoire"),
    joursPrecis: z.string().optional(),
    planningAnnexePrecision: z.string().optional(),

    adresseExercice: z.string().min(1, "Adresse du lieu d’exercice obligatoire"),
    materielMisADisposition: z.string().optional(),
    logicielProfessionnel: z.string().optional(),
    secretariat: z.string().optional(),

    modeFacturation: z.string().min(1, "Mode de facturation obligatoire"),
    dateRemiseRecettes: z.string().min(1, "Date de remise des recettes obligatoire"),
    pourcentageReverse: z.coerce.number().min(1).max(100),
    delaiReversement: z.coerce.number().min(0).max(12),
    pourcentageTiersPayant: z.coerce.number().min(1).max(100),
    delaiReversementTiersPayant: z.coerce.number().min(0).max(12),
    modalitePaiement: z.string().min(1, "Modalité de paiement obligatoire"),

    preavisCommunAccord: z.coerce.number().min(0).max(90),
    preavisManquement: z.coerce.number().min(0).max(90),

    remplacementSuperieurTroisMois: z.string().min(1, "Choix obligatoire"),
    clauseNonConcurrence: z.string().optional(),
    rayonKm: z.string().optional(),
    communesConcernees: z.string().optional(),
    dureeNonConcurrence: z.string().optional(),

    faitA: z.string().min(1, "Lieu de signature obligatoire"),
    faitLe: z.string().min(1, "Date de signature obligatoire"),
    nombreExemplaires: z.coerce.number().min(2).max(5),

    remplaceSuspendActivite: z.boolean(),
    remplacantUtiliseSaCps: z.boolean(),
    jamaisCpsDuRemplace: z.boolean(),
    rcpValide: z.boolean(),
    autorisationValide: z.boolean(),
    pasPlusDeuxRemplacements: z.boolean(),
    transmissionOrdre: z.boolean(),
    aucuneContreLettre: z.boolean(),
  })
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
  .refine((data) => data.rcpValide, {
    path: ["rcpValide"],
    message: "Confirmation obligatoire.",
  })
  .refine((data) => data.autorisationValide, {
    path: ["autorisationValide"],
    message: "Confirmation obligatoire.",
  })
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
  });

export type ContractData = z.infer<typeof contractSchema>;