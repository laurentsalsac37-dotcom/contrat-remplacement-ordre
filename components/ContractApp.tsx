"use client";

import { useEffect, useState } from "react";
import {
  Resolver,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContractData, contractSchema } from "@/lib/schema";
import { formatDurationLabel } from "@/lib/contract";
import { Field } from "./Field";
import { ContractPreview } from "./ContractPreview";
import { LegalAudit } from "./LegalAudit";
import { TransmissionMail } from "./TransmissionMail";
import { SignaturePad } from "./SignaturePad";

const DRAFT_STORAGE_KEY =
  "contrat-remplacement-ordre-draft-v1";

const FORM_STEPS = [
  {
    number: 1,
    title: "Infirmier remplacé",
    description: "Identité et coordonnées professionnelles",
  },
  {
    number: 2,
    title: "Infirmier remplaçant",
    description: "Identité, autorisation et justificatifs",
  },
  {
    number: 3,
    title: "Motif et période",
    description: "Organisation et durée du remplacement",
  },
  {
    number: 4,
    title: "Exercice, lieu et matériel",
    description:
      "Groupe, cabinet, matériel et états des lieux",
  },
  {
    number: 5,
    title: "Honoraires et facturation",
    description:
      "Rétrocession, tiers payant et redevance",
  },
  {
    number: 6,
    title: "Résiliation et loyauté",
    description:
      "Préavis, loyauté et éventuelle non-réinstallation",
  },
  {
    number: 7,
    title: "Déclarations obligatoires",
    description:
      "Attestations professionnelles et ordinales",
  },
  {
    number: 8,
    title: "Annexes et signatures",
    description:
      "Vérification, annexes et finalisation",
  },
] as const;

const defaultContractValues: Partial<ContractData> = {
  remplaceCivilite: "Mme",
  remplaceCpam: "",

  remplacantCivilite: "Mme",
  cpamAutorisation: "",
  statutRemplacant: "non_installe",
  numeroAutorisation: "",
  dateAutorisation: "",
  dateFinValiditeAutorisation: "",
  conseilAutorisation: "",
  justificatif2400h: "",

  motif: "conge_annuel",
  typeRemplacement: "continu",
  remplacementPlus24h: "oui",
  remplacementRepete: "non",

  exerciceEnGroupe: "non",
  typeGroupe: "",
  clauseAgrement: "",
  agrementObtenu: "",
  confreresInformes: "",
  patientsInformes: false,
  associesInformes: false,

  lieuRemplacement: "cabinet_remplace",
  etatLieuxDebut: "non",
  etatLieuxFin: "non",
  inventaireMateriel: "non",

  modeFacturation: "cps_remplacant",
  pourcentageReverse: 90,
  delaiReversement: 1,
  pourcentageTiersPayant: 90,
  delaiReversementTiersPayant: 1,
  modalitePaiement: "virement",

  redevancePrevue: "oui",
  tauxRedevance: 10,
  assietteSoins: true,
  assietteMajorationsNuit: true,
  assietteDimancheFeries: true,
  assietteFraisKilometriques: false,
  fraisKilometriquesExclus: "oui",

  preavisCommunAccord: 7,
  preavisManquement: 7,

  remplacementSuperieurTroisMois: "non",
  clauseNonConcurrence: "loyaute",
  rayonKm: "",
  communesConcernees: "",
  dureeNonConcurrence: "",
  accordOrdreNonConcurrence: "",
  accordOrdreNotificationConfirmee: false,

  nombreExemplaires: 3,
  annexesSelectionnees: "",

  annexeAttestationRcProf: false,
  annexeAutorisationRemplacement: false,
  annexeJustificatif2400h: false,
  annexePlanning: false,
  annexeInventaireMateriel: false,
  annexeEtatLieuxEntree: false,
  annexeEtatLieuxSortie: false,
  annexeJustificatifAgrementGroupe: false,
  annexeAutreDocument: false,

  remplaceSuspendActivite: false,
  remplacantUtiliseSaCps: false,
  jamaisCpsDuRemplace: false,
  remplacantIdentifiePersonnellement: false,
  rcpValide: false,
  autorisationValide: false,
  pasPlusDeuxRemplacements: false,
  transmissionOrdre: false,
  aucuneContreLettre: false,
  absenceInterdictionRemplace: false,
  absenceInterdictionRemplacant: false,
  absenceLiquidationJudiciaire: false,
  informationCpam: false,
  justificatifsRemuneration: false,
  conventionNationaleInformee: false,
  restitutionLocauxMateriel: false,
  abandonActiviteFinMission: false,
  deconventionnementRemplace: false,
  deconventionnementRemplacant: false,
  conciliationPrealable: false,
  transmissionInformationsContinuiteSoins: false,
  syntheseRelue: false,
};

export function ContractApp() {
  const [validatedData, setValidatedData] =
    useState<ContractData | null>(null);

  const [showPreviewMobile, setShowPreviewMobile] =
    useState(false);

  const [signatureRemplace, setSignatureRemplace] =
    useState("");

  const [signatureRemplacant, setSignatureRemplacant] =
    useState("");

  const [draftSavedAt, setDraftSavedAt] =
    useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [showAllSteps, setShowAllSteps] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ContractData>({
    resolver: zodResolver(
      contractSchema
    ) as Resolver<ContractData>,

    defaultValues:
      defaultContractValues as ContractData,
  });

  const currentData = watch();

  const exerciceEnGroupeValue = watch(
    "exerciceEnGroupe"
  );

  const typeGroupeValue = watch("typeGroupe");

  const remplacementSuperieurTroisMoisValue = watch(
    "remplacementSuperieurTroisMois"
  );

  const clauseNonConcurrenceValue = watch(
    "clauseNonConcurrence"
  );

  const accordOrdreNonConcurrenceValue = watch(
    "accordOrdreNonConcurrence"
  );

  const preavisCommunAccordValue = Number(
    watch("preavisCommunAccord") || 0
  );

  const preavisManquementValue = Number(
    watch("preavisManquement") || 0
  );

  const showAssociatesConfirmation =
    exerciceEnGroupeValue === "oui" &&
    [
      "societe",
      "cabinet_groupe",
      "exercice_commun",
      "cocontractants",
    ].includes(String(typeGroupeValue || ""));

  const showNonReinstallation =
    remplacementSuperieurTroisMoisValue === "oui";

  useEffect(() => {
    if (remplacementSuperieurTroisMoisValue === "oui") {
      setValue("dureeNonConcurrence", "2 ans");

      if (
        getValues("clauseNonConcurrence") === "loyaute"
      ) {
        setValue("clauseNonConcurrence", "");
      }

      return;
    }

    setValue("dureeNonConcurrence", "");
    setValue("clauseNonConcurrence", "loyaute");
    setValue("rayonKm", "");
    setValue("communesConcernees", "");
    setValue("accordOrdreNonConcurrence", "");
    setValue(
      "accordOrdreNotificationConfirmee",
      false
    );
  }, [
    remplacementSuperieurTroisMoisValue,
    getValues,
    setValue,
  ]);

  useEffect(() => {
    if (
      showNonReinstallation &&
      clauseNonConcurrenceValue !== "rayon"
    ) {
      setValue("rayonKm", "");
    }

    if (
      showNonReinstallation &&
      clauseNonConcurrenceValue !== "communes"
    ) {
      setValue("communesConcernees", "");
    }
  }, [
    showNonReinstallation,
    clauseNonConcurrenceValue,
    setValue,
  ]);

  useEffect(() => {
    if (accordOrdreNonConcurrenceValue !== "oui") {
      setValue(
        "accordOrdreNotificationConfirmee",
        false
      );
    }
  }, [accordOrdreNonConcurrenceValue, setValue]);

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(
          DRAFT_STORAGE_KEY
        );

      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as
        Partial<ContractData> & {
          savedAt?: string;
        };

      if (parsed.savedAt) {
        setDraftSavedAt(parsed.savedAt);
      }

      reset({
        ...defaultContractValues,
        ...parsed,
      } as ContractData);
    } catch {
      // Un brouillon local illisible est ignoré.
    }
  }, [reset]);

  function onSubmit(data: ContractData) {
    setValidatedData(data);

    window.setTimeout(() => {
      window.print();
    }, 300);
  }

  function saveDraft() {
    const values = watch();

    const savedAt = new Date().toLocaleString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const payload = {
      ...values,
      savedAt,
    };

    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify(payload)
    );

    setDraftSavedAt(savedAt);
  }

  function deleteDraft() {
    window.localStorage.removeItem(
      DRAFT_STORAGE_KEY
    );

    setDraftSavedAt(null);
  }

  function clearAllData() {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir effacer toutes les données saisies ?"
    );

    if (!confirmed) {
      return;
    }

    reset(defaultContractValues as ContractData);

    setValidatedData(null);
    setSignatureRemplace("");
    setSignatureRemplacant("");
    setDraftSavedAt(null);
    setCurrentStep(1);
    setShowAllSteps(false);

    window.localStorage.removeItem(
      DRAFT_STORAGE_KEY
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function scrollToFormTop() {
    window.setTimeout(() => {
      const form =
        document.getElementById("contract-form");

      if (form) {
        form.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        return;
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  }

  function goToNextStep() {
    setCurrentStep((step) =>
      Math.min(step + 1, FORM_STEPS.length)
    );

    scrollToFormTop();
  }

  function goToPreviousStep() {
    setCurrentStep((step) =>
      Math.max(step - 1, 1)
    );

    scrollToFormTop();
  }

  function goToStep(step: number) {
    setCurrentStep(
      Math.min(
        Math.max(step, 1),
        FORM_STEPS.length
      )
    );

    scrollToFormTop();
  }

  function toggleAllSteps() {
    setShowAllSteps((value) => !value);
  }

  function isStepVisible(step: number) {
    return showAllSteps || currentStep === step;
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 md:px-3 md:py-2 md:text-sm";

  return (
    <main className="min-h-screen bg-slate-100 pb-28 md:p-6 md:pb-6">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-4 rounded-none bg-white p-4 shadow-sm md:mb-8 md:rounded-2xl md:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-700 md:text-sm">
            Générateur fondé sur le modèle du
            Conseil national de l’Ordre des
            infirmiers
          </p>

          <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-950 md:text-3xl">
            Générateur de contrat de remplacement
            infirmier
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Outil de rédaction fondé sur le modèle
            ordinal mis à jour le 15 novembre 2023.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700 md:max-w-4xl md:text-base">
            Complétez les informations des deux
            infirmiers, le motif, la durée, les
            honoraires, les modalités de facturation
            et les attestations obligatoires.
          </p>

          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Les informations saisies sont traitées
            localement dans votre navigateur. Elles
            ne sont ni enregistrées sur un serveur ni
            transmises à un tiers.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-800"
            >
              Enregistrer un brouillon sur cet
              appareil
            </button>

            <button
              type="button"
              onClick={deleteDraft}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Supprimer le brouillon
            </button>

            <button
              type="button"
              onClick={clearAllData}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Effacer toutes les données saisies
            </button>
          </div>

          {draftSavedAt && (
            <p className="mt-2 text-sm text-slate-600">
              Dernière sauvegarde locale :{" "}
              {draftSavedAt}
            </p>
          )}

          <button
            type="button"
            onClick={() =>
              setShowPreviewMobile(
                (value) => !value
              )
            }
            className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 md:hidden"
          >
            {showPreviewMobile
              ? "Masquer le contrat"
              : "Afficher le contrat"}
          </button>
        </header>

        <div className="print-wrapper grid gap-4 md:gap-6 lg:grid-cols-[1fr_0.95fr]">
          <form
            id="contract-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-none bg-white p-4 shadow-sm md:space-y-6 md:rounded-2xl md:p-6"
          >
            <div className="no-print mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                      Étape {currentStep} sur{" "}
                      {FORM_STEPS.length}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-950">
                      {
                        FORM_STEPS[
                          currentStep - 1
                        ].title
                      }
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      {
                        FORM_STEPS[
                          currentStep - 1
                        ].description
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={toggleAllSteps}
                    className="shrink-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {showAllSteps
                      ? "Revenir au mode guidé"
                      : "Afficher toutes les étapes"}
                  </button>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-slate-200"
                  aria-label={`Progression : étape ${currentStep} sur ${FORM_STEPS.length}`}
                >
                  <div
                    className="h-full rounded-full bg-red-700 transition-all duration-300"
                    style={{
                      width: `${
                        (currentStep /
                          FORM_STEPS.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <div className="hidden grid-cols-4 gap-2 lg:grid">
                  {FORM_STEPS.map((step) => {
                    const active =
                      currentStep === step.number;

                    const completed =
                      currentStep > step.number;

                    return (
                      <button
                        key={step.number}
                        type="button"
                        onClick={() =>
                          goToStep(step.number)
                        }
                        className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                          active
                            ? "border-red-700 bg-red-50 text-red-800"
                            : completed
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="block font-bold">
                          {completed
                            ? "✓"
                            : step.number}
                          . {step.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {isStepVisible(1) && (
              <section className="space-y-4">
                <StepHeader
                  number={1}
                  title="Infirmier remplacé"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Civilité"
                    error={
                      errors.remplaceCivilite
                        ?.message
                    }
                  >
                    <select
                      className={inputClass}
                      {...register(
                        "remplaceCivilite"
                      )}
                    >
                      <option value="Mme">
                        Madame
                      </option>
                      <option value="M">
                        Monsieur
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Nom"
                    error={
                      errors.remplaceNom?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register("remplaceNom")}
                    />
                  </Field>

                  <Field
                    label="Prénom"
                    error={
                      errors.remplacePrenom
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "remplacePrenom"
                      )}
                    />
                  </Field>

                  <Field
                    label="Numéro ordinal"
                    error={
                      errors.remplaceNumeroOrdinal
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "remplaceNumeroOrdinal"
                      )}
                    />
                  </Field>

                  <Field
                    label="Numéro RPPS"
                    error={
                      errors.remplaceNumeroRpps
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "remplaceNumeroRpps"
                      )}
                    />
                  </Field>

                  <Field
                    label="Téléphone"
                    error={
                      errors.remplaceTelephone
                        ?.message
                    }
                  >
                    <input
                      inputMode="tel"
                      className={inputClass}
                      {...register(
                        "remplaceTelephone"
                      )}
                    />
                  </Field>

                  <Field
                    label="E-mail"
                    error={
                      errors.remplaceEmail?.message
                    }
                  >
                    <input
                      type="email"
                      className={inputClass}
                      {...register(
                        "remplaceEmail"
                      )}
                    />
                  </Field>

                  <Field
                    label="CPAM de rattachement"
                    error={
                      errors.remplaceCpam?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register("remplaceCpam")}
                    />
                  </Field>
                </div>

                <Field
                  label="Adresse du cabinet"
                  error={
                    errors.remplaceAdresseCabinet
                      ?.message
                  }
                >
                  <input
                    className={inputClass}
                    {...register(
                      "remplaceAdresseCabinet"
                    )}
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Code postal"
                    error={
                      errors.remplaceCodePostal
                        ?.message
                    }
                  >
                    <input
                      inputMode="numeric"
                      className={inputClass}
                      {...register(
                        "remplaceCodePostal"
                      )}
                    />
                  </Field>

                  <Field
                    label="Ville"
                    error={
                      errors.remplaceVille?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "remplaceVille"
                      )}
                    />
                  </Field>
                </div>
              </section>
            )}

            {isStepVisible(2) && (
              <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
                <StepHeader
                  number={2}
                  title="Infirmier remplaçant et autorisation"
                />

                <Field
                  label="Statut du remplaçant"
                  error={
                    errors.statutRemplacant
                      ?.message
                  }
                >
                  <select
                    className={inputClass}
                    {...register(
                      "statutRemplacant"
                    )}
                  >
                    <option value="non_installe">
                      Sans résidence professionnelle
                    </option>
                  </select>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Civilité"
                    error={
                      errors.remplacantCivilite
                        ?.message
                    }
                  >
                    <select
                      className={inputClass}
                      {...register(
                        "remplacantCivilite"
                      )}
                    >
                      <option value="Mme">
                        Madame
                      </option>
                      <option value="M">
                        Monsieur
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Nom"
                    error={
                      errors.remplacantNom
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "remplacantNom"
                      )}
                    />
                  </Field>

                  <Field
                    label="Prénom"
                    error={
                      errors.remplacantPrenom
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "remplacantPrenom"
                      )}
                    />
                  </Field>

                  <Field
                    label="Numéro ordinal"
                    error={
                      errors
                        .remplacantNumeroOrdinal
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "remplacantNumeroOrdinal"
                      )}
                    />
                  </Field>

                  <Field
                    label="Numéro RPPS"
                    error={
                      errors.remplacantNumeroRpps
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "remplacantNumeroRpps"
                      )}
                    />
                  </Field>

                  <Field
                    label="Téléphone"
                    error={
                      errors.remplacantTelephone
                        ?.message
                    }
                  >
                    <input
                      inputMode="tel"
                      className={inputClass}
                      {...register(
                        "remplacantTelephone"
                      )}
                    />
                  </Field>

                  <Field
                    label="E-mail"
                    error={
                      errors.remplacantEmail
                        ?.message
                    }
                  >
                    <input
                      type="email"
                      className={inputClass}
                      {...register(
                        "remplacantEmail"
                      )}
                    />
                  </Field>

                  <Field
                    label="Numéro d’autorisation de remplacement"
                    error={
                      errors.numeroAutorisation
                        ?.message
                    }
                    hint="Ce numéro doit être conservé pour la preuve de l’autorisation ordinale de remplacement."
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "numeroAutorisation"
                      )}
                    />
                  </Field>

                  <Field
                    label="Date d’autorisation"
                    error={
                      errors.dateAutorisation
                        ?.message
                    }
                  >
                    <input
                      type="date"
                      className={inputClass}
                      {...register(
                        "dateAutorisation"
                      )}
                    />
                  </Field>

                  <Field
                    label="Date de fin de validité de l’autorisation"
                    error={
                      errors
                        .dateFinValiditeAutorisation
                        ?.message
                    }
                  >
                    <input
                      type="date"
                      className={inputClass}
                      {...register(
                        "dateFinValiditeAutorisation"
                      )}
                    />
                  </Field>

                  <Field
                    label="Conseil ordinal ayant délivré l’autorisation"
                    error={
                      errors.conseilAutorisation
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "conseilAutorisation"
                      )}
                    />
                  </Field>

                  <Field
                    label="CPAM concernée"
                    error={
                      errors.cpamAutorisation
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "cpamAutorisation"
                      )}
                    />
                  </Field>
                </div>

                <Field
                  label="Justificatif des 18 mois ou 2 400 heures, si remplaçant non installé"
                  error={
                    errors.justificatif2400h
                      ?.message
                  }
                  hint="Ce justificatif peut être joint en annexe aux fins de vérification administrative."
                >
                  <input
                    className={inputClass}
                    {...register(
                      "justificatif2400h"
                    )}
                  />
                </Field>

                <Field
                  label="Adresse personnelle"
                  error={
                    errors.remplacantAdresse
                      ?.message
                  }
                >
                  <input
                    className={inputClass}
                    {...register(
                      "remplacantAdresse"
                    )}
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Code postal"
                    error={
                      errors.remplacantCodePostal
                        ?.message
                    }
                  >
                    <input
                      inputMode="numeric"
                      className={inputClass}
                      {...register(
                        "remplacantCodePostal"
                      )}
                    />
                  </Field>

                  <Field
                    label="Ville"
                    error={
                      errors.remplacantVille
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "remplacantVille"
                      )}
                    />
                  </Field>
                </div>
              </section>
            )}

            {isStepVisible(3) && (
              <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
                <StepHeader
                  number={3}
                  title="Motif et période du remplacement"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Motif"
                    error={errors.motif?.message}
                  >
                    <select
                      className={inputClass}
                      {...register("motif")}
                    >
                      <option value="conge_annuel">
                        Congé annuel
                      </option>
                      <option value="conge_personnel">
                        Congé personnel
                      </option>
                      <option value="conge_maladie">
                        Congé maladie
                      </option>
                      <option value="conge_maternite">
                        Congé maternité
                      </option>
                      <option value="conge_paternite">
                        Congé paternité
                      </option>
                      <option value="formation_professionnelle">
                        Formation professionnelle
                      </option>
                      <option value="mandat_ordinal">
                        Mandat ordinal
                      </option>
                      <option value="mandat_syndical">
                        Mandat syndical
                      </option>
                      <option value="motif_familial">
                        Motif familial
                      </option>
                      <option value="autre">
                        Autre
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Précision si autre motif"
                    error={
                      errors.motifAutre?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register("motifAutre")}
                    />
                  </Field>

                  <Field
                    label="Date de début"
                    error={
                      errors.dateDebut?.message
                    }
                  >
                    <input
                      type="date"
                      className={inputClass}
                      {...register("dateDebut")}
                    />
                  </Field>

                  <Field
                    label="Date de fin"
                    error={
                      errors.dateFin?.message
                    }
                  >
                    <input
                      type="date"
                      className={inputClass}
                      {...register("dateFin")}
                    />
                  </Field>

                  <Field
                    label="Type de remplacement"
                    error={
                      errors.typeRemplacement
                        ?.message
                    }
                  >
                    <select
                      className={inputClass}
                      {...register(
                        "typeRemplacement"
                      )}
                    >
                      <option value="continu">
                        Continu
                      </option>
                      <option value="jours_precis">
                        Jours précis
                      </option>
                      <option value="planning_annexe">
                        Planning annexé
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Remplacement supérieur à 24 heures ?"
                    error={
                      errors.remplacementPlus24h
                        ?.message
                    }
                  >
                    <select
                      className={inputClass}
                      {...register(
                        "remplacementPlus24h"
                      )}
                    >
                      <option value="oui">
                        Oui
                      </option>
                      <option value="non">
                        Non
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Remplacement répété ?"
                    error={
                      errors.remplacementRepete
                        ?.message
                    }
                  >
                    <select
                      className={inputClass}
                      {...register(
                        "remplacementRepete"
                      )}
                    >
                      <option value="non">
                        Non
                      </option>
                      <option value="oui">
                        Oui
                      </option>
                    </select>
                  </Field>
                </div>

                <Field
                  label="Jours précis, si applicable"
                  error={
                    errors.joursPrecis?.message
                  }
                >
                  <textarea
                    className={inputClass}
                    rows={4}
                    {...register("joursPrecis")}
                  />
                </Field>

                <Field
                  label="Précisions relatives au planning annexé"
                  error={
                    errors.planningAnnexePrecision
                      ?.message
                  }
                >
                  <textarea
                    className={inputClass}
                    rows={4}
                    {...register(
                      "planningAnnexePrecision"
                    )}
                  />
                </Field>
              </section>
            )}

            {isStepVisible(4) && (
              <>
                <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
                  <StepHeader
                    number={4}
                    title="Exercice en groupe, lieu et matériel"
                  />

                  <Field
                    label="Le remplacé exerce-t-il en groupe ?"
                    error={
                      errors.exerciceEnGroupe
                        ?.message
                    }
                  >
                    <select
                      className={inputClass}
                      {...register(
                        "exerciceEnGroupe"
                      )}
                    >
                      <option value="non">
                        Non
                      </option>
                      <option value="oui">
                        Oui
                      </option>
                    </select>
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Type de groupe"
                      error={
                        errors.typeGroupe?.message
                      }
                    >
                      <select
                        className={inputClass}
                        {...register("typeGroupe")}
                      >
                        <option value="">
                          Non concerné
                        </option>
                        <option value="societe">
                          Société
                        </option>
                        <option value="cabinet_groupe">
                          Cabinet de groupe
                        </option>
                        <option value="exercice_commun">
                          Exercice commun
                        </option>
                        <option value="cocontractants">
                          Cocontractants
                        </option>
                        <option value="autre">
                          Autre
                        </option>
                      </select>
                    </Field>

                    <Field
                      label="Clause d’agrément ?"
                      error={
                        errors.clauseAgrement
                          ?.message
                      }
                    >
                      <select
                        className={inputClass}
                        {...register(
                          "clauseAgrement"
                        )}
                      >
                        <option value="">
                          Non concerné
                        </option>
                        <option value="oui">
                          Oui
                        </option>
                        <option value="non">
                          Non
                        </option>
                        <option value="ne_sait_pas">
                          Ne sait pas
                        </option>
                      </select>
                    </Field>

                    <Field
                      label="Agrément obtenu ?"
                      error={
                        errors.agrementObtenu
                          ?.message
                      }
                    >
                      <select
                        className={inputClass}
                        {...register(
                          "agrementObtenu"
                        )}
                      >
                        <option value="">
                          Non concerné
                        </option>
                        <option value="oui">
                          Oui
                        </option>
                        <option value="non">
                          Non
                        </option>
                      </select>
                    </Field>

                    <Field
                      label="Confrères informés ?"
                      error={
                        errors.confreresInformes
                          ?.message
                      }
                    >
                      <select
                        className={inputClass}
                        {...register(
                          "confreresInformes"
                        )}
                      >
                        <option value="">
                          Non concerné
                        </option>
                        <option value="oui">
                          Oui
                        </option>
                        <option value="non">
                          Non
                        </option>
                      </select>
                    </Field>

                    <Field
                      label="Lieu de remplacement"
                      error={
                        errors.lieuRemplacement
                          ?.message
                      }
                    >
                      <select
                        className={inputClass}
                        {...register(
                          "lieuRemplacement"
                        )}
                      >
                        <option value="cabinet_remplace">
                          Cabinet du remplacé
                        </option>
                      </select>
                    </Field>
                  </div>

                  <Field
                    label="Adresse du lieu d’exercice"
                    error={
                      errors.adresseExercice
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "adresseExercice"
                      )}
                    />
                  </Field>

                  <Field
                    label="Matériel mis à disposition"
                    error={
                      errors
                        .materielMisADisposition
                        ?.message
                    }
                  >
                    <textarea
                      className={inputClass}
                      rows={4}
                      {...register(
                        "materielMisADisposition"
                      )}
                    />
                  </Field>

                  <Field
                    label="Logiciel professionnel utilisé"
                    error={
                      errors
                        .logicielProfessionnel
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "logicielProfessionnel"
                      )}
                    />
                  </Field>

                  <Field
                    label="Secrétariat ou organisation administrative"
                    error={
                      errors.secretariat?.message
                    }
                  >
                    <textarea
                      className={inputClass}
                      rows={4}
                      {...register("secretariat")}
                    />
                  </Field>
                </section>

                <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
                  <SubsectionHeader title="États des lieux et restitution" />

                  <div className="grid gap-4 md:grid-cols-3">
                    <Field
                      label="État des lieux au début ?"
                      error={
                        errors.etatLieuxDebut
                          ?.message
                      }
                    >
                      <select
                        className={inputClass}
                        {...register(
                          "etatLieuxDebut"
                        )}
                      >
                        <option value="non">
                          Non
                        </option>
                        <option value="oui">
                          Oui
                        </option>
                      </select>
                    </Field>

                    <Field
                      label="État des lieux à la fin ?"
                      error={
                        errors.etatLieuxFin
                          ?.message
                      }
                    >
                      <select
                        className={inputClass}
                        {...register(
                          "etatLieuxFin"
                        )}
                      >
                        <option value="non">
                          Non
                        </option>
                        <option value="oui">
                          Oui
                        </option>
                      </select>
                    </Field>

                    <Field
                      label="Inventaire annexé ?"
                      error={
                        errors.inventaireMateriel
                          ?.message
                      }
                    >
                      <select
                        className={inputClass}
                        {...register(
                          "inventaireMateriel"
                        )}
                      >
                        <option value="non">
                          Non
                        </option>
                        <option value="oui">
                          Oui
                        </option>
                      </select>
                    </Field>
                  </div>
                </section>
              </>
            )}

            {isStepVisible(5) && (
              <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
                <StepHeader
                  number={5}
                  title="Facturation, honoraires et redevance"
                />

                <Field
                  label="Mode de facturation"
                  error={
                    errors.modeFacturation
                      ?.message
                  }
                >
                  <select
                    className={inputClass}
                    {...register(
                      "modeFacturation"
                    )}
                  >
                    <option value="cps_remplacant">
                      CPS ou e-CPS personnelle du
                      remplaçant
                    </option>
                    <option value="feuille_soins">
                      Feuilles de soins papier avec
                      identification du remplaçant
                    </option>
                  </select>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Date de remise des recettes"
                    error={
                      errors.dateRemiseRecettes
                        ?.message
                    }
                  >
                    <input
                      type="date"
                      className={inputClass}
                      {...register(
                        "dateRemiseRecettes"
                      )}
                    />
                  </Field>

                  <Field
                    label="Pourcentage reversé au remplaçant"
                    error={
                      errors.pourcentageReverse
                        ?.message
                    }
                  >
                    <input
                      type="number"
                      inputMode="numeric"
                      className={inputClass}
                      {...register(
                        "pourcentageReverse"
                      )}
                    />
                  </Field>

                  <Field
                    label="Délai de reversement en jours"
                    error={
                      errors.delaiReversement
                        ?.message
                    }
                  >
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      className={inputClass}
                      {...register(
                        "delaiReversement"
                      )}
                    />
                  </Field>

                  <Field
                    label="Pourcentage du tiers payant reversé"
                    error={
                      errors
                        .pourcentageTiersPayant
                        ?.message
                    }
                  >
                    <input
                      type="number"
                      inputMode="numeric"
                      className={inputClass}
                      {...register(
                        "pourcentageTiersPayant"
                      )}
                    />
                  </Field>

                  <Field
                    label="Délai de reversement du tiers payant en jours"
                    error={
                      errors
                        .delaiReversementTiersPayant
                        ?.message
                    }
                  >
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      className={inputClass}
                      {...register(
                        "delaiReversementTiersPayant"
                      )}
                    />
                  </Field>

                  <Field
                    label="Modalité de paiement"
                    error={
                      errors.modalitePaiement
                        ?.message
                    }
                  >
                    <select
                      className={inputClass}
                      {...register(
                        "modalitePaiement"
                      )}
                    >
                      <option value="virement">
                        Virement
                      </option>
                      <option value="cheque">
                        Chèque
                      </option>
                      <option value="autre">
                        Autre
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Redevance prévue ?"
                    error={
                      errors.redevancePrevue
                        ?.message
                    }
                  >
                    <select
                      className={inputClass}
                      {...register(
                        "redevancePrevue"
                      )}
                    >
                      <option value="oui">
                        Oui
                      </option>
                      <option value="non">
                        Non
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Taux de redevance en %"
                    error={
                      errors.tauxRedevance
                        ?.message
                    }
                    hint="La redevance correspond aux frais et services fournis. Son taux et son assiette doivent être définis sans ambiguïté."
                  >
                    <input
                      type="number"
                      inputMode="numeric"
                      className={inputClass}
                      {...register(
                        "tauxRedevance"
                      )}
                    />
                  </Field>

                  <Field
                    label="Frais kilométriques exclus de l’assiette ?"
                    error={
                      errors
                        .fraisKilometriquesExclus
                        ?.message
                    }
                  >
                    <select
                      className={inputClass}
                      {...register(
                        "fraisKilometriquesExclus"
                      )}
                    >
                      <option value="oui">
                        Oui
                      </option>
                      <option value="non">
                        Non
                      </option>
                    </select>
                  </Field>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-3 text-sm font-semibold text-slate-900">
                    Éléments inclus dans l’assiette
                    de la redevance
                  </p>

                  <CheckboxSimple
                    register={register}
                    name="assietteSoins"
                    label="Soins"
                  />

                  <CheckboxSimple
                    register={register}
                    name="assietteMajorationsNuit"
                    label="Majorations de nuit"
                  />

                  <CheckboxSimple
                    register={register}
                    name="assietteDimancheFeries"
                    label="Majorations du dimanche et des jours fériés"
                  />

                  <CheckboxSimple
                    register={register}
                    name="assietteFraisKilometriques"
                    label="Frais kilométriques"
                  />

                  <Field
                    label="Autres éléments"
                    error={
                      errors.assietteAutres
                        ?.message
                    }
                  >
                    <input
                      className={inputClass}
                      {...register(
                        "assietteAutres"
                      )}
                    />
                  </Field>
                </div>
              </section>
            )}

            {isStepVisible(6) && (
              <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
                <StepHeader
                  number={6}
                  title={
                    showNonReinstallation
                      ? "Résiliation et non-réinstallation"
                      : "Résiliation et loyauté"
                  }
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Préavis en cas de résiliation d’un commun accord"
                    error={
                      errors.preavisCommunAccord
                        ?.message
                    }
                    hint={`Un préavis de ${formatDurationLabel(
                      preavisCommunAccordValue
                    )}`}
                  >
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      className={inputClass}
                      {...register(
                        "preavisCommunAccord"
                      )}
                    />
                  </Field>

                  <Field
                    label="Préavis en cas de manquement"
                    error={
                      errors.preavisManquement
                        ?.message
                    }
                    hint={`Un préavis de ${formatDurationLabel(
                      preavisManquementValue
                    )}`}
                  >
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      className={inputClass}
                      {...register(
                        "preavisManquement"
                      )}
                    />
                  </Field>

                  <Field
                    label="La durée totale du remplacement dépasse-t-elle trois mois, consécutifs ou non ?"
                    error={
                      errors
                        .remplacementSuperieurTroisMois
                        ?.message
                    }
                  >
                    <select
                      className={inputClass}
                      {...register(
                        "remplacementSuperieurTroisMois"
                      )}
                    >
                      <option value="non">
                        Non
                      </option>
                      <option value="oui">
                        Oui
                      </option>
                    </select>
                  </Field>

                  {showNonReinstallation ? (
                    <Field
                      label="Périmètre de non-réinstallation"
                      error={
                        errors
                          .clauseNonConcurrence
                          ?.message
                      }
                    >
                      <select
                        className={inputClass}
                        {...register(
                          "clauseNonConcurrence"
                        )}
                      >
                        <option value="">
                          Choisir un périmètre
                        </option>
                        <option value="rayon">
                          Rayon kilométrique
                        </option>
                        <option value="communes">
                          Communes déterminées
                        </option>
                      </select>
                    </Field>
                  ) : (
                    <div className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                      Le remplacement n’excédant pas
                      trois mois, la clause de
                      non-réinstallation ne
                      s’applique pas. Le remplaçant
                      demeure tenu à une obligation
                      de loyauté et de confraternité.
                      Il s’interdit tout détournement
                      de patientèle et tout procédé
                      de concurrence déloyale.
                    </div>
                  )}

                  {showNonReinstallation &&
                    clauseNonConcurrenceValue ===
                      "rayon" && (
                      <Field
                        label="Rayon en kilomètres"
                        error={
                          errors.rayonKm?.message
                        }
                      >
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          className={inputClass}
                          {...register("rayonKm")}
                        />
                      </Field>
                    )}

                  {showNonReinstallation &&
                    clauseNonConcurrenceValue ===
                      "communes" && (
                      <Field
                        label="Communes concernées"
                        error={
                          errors
                            .communesConcernees
                            ?.message
                        }
                      >
                        <textarea
                          className={inputClass}
                          rows={4}
                          {...register(
                            "communesConcernees"
                          )}
                        />
                      </Field>
                    )}

                  {showNonReinstallation && (
                    <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                      Pour un remplacement supérieur
                      à trois mois, consécutifs ou
                      non, la durée de la restriction
                      de réinstallation est fixée à
                      deux ans.
                    </div>
                  )}

                  {showNonReinstallation && (
                    <Field
                      label="Un accord dérogatoire est-il conclu entre les parties ?"
                      error={
                        errors
                          .accordOrdreNonConcurrence
                          ?.message
                      }
                    >
                      <select
                        className={inputClass}
                        {...register(
                          "accordOrdreNonConcurrence"
                        )}
                      >
                        <option value="">
                          Choisir
                        </option>
                        <option value="non">
                          Non
                        </option>
                        <option value="oui">
                          Oui
                        </option>
                      </select>
                    </Field>
                  )}
                </div>

                {showNonReinstallation &&
                  accordOrdreNonConcurrenceValue ===
                    "oui" && (
                    <CheckboxLine
                      register={register}
                      name="accordOrdreNotificationConfirmee"
                      error={Boolean(
                        errors
                          .accordOrdreNotificationConfirmee
                      )}
                      label="Les parties confirment que l’accord dérogatoire a été notifié au conseil de l’Ordre compétent."
                    />
                  )}
              </section>
            )}

            {isStepVisible(7) && (
              <section className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 md:p-5">
                <StepHeader
                  number={7}
                  title="Déclarations obligatoires"
                />

                <CheckboxLine
                  register={register}
                  name="remplaceSuspendActivite"
                  error={Boolean(
                    errors.remplaceSuspendActivite
                  )}
                  label="L’infirmier remplacé s’interdit, pendant les périodes couvertes par le présent contrat, toute activité professionnelle infirmière objet du remplacement, sous réserve du suivi d’une formation professionnelle, de l’assistance à une personne en péril et de la participation à un dispositif de secours dans les conditions prévues par les textes applicables."
                />

                <CheckboxLine
                  register={register}
                  name="patientsInformes"
                  error={Boolean(
                    errors.patientsInformes
                  )}
                  label="Les patients sont informés dès que possible de la présence, de l’identité et de la qualité de l’infirmier remplaçant."
                />

                {showAssociatesConfirmation && (
                  <CheckboxLine
                    register={register}
                    name="associesInformes"
                    error={Boolean(
                      errors.associesInformes
                    )}
                    label="Le remplacé confirme avoir informé ses associés ou cocontractants et leur avoir communiqué une copie du présent contrat lorsque les statuts ou conventions applicables l’exigent."
                  />
                )}

                <CheckboxLine
                  register={register}
                  name="absenceInterdictionRemplace"
                  error={Boolean(
                    errors
                      .absenceInterdictionRemplace
                  )}
                  label="L’infirmier remplacé atteste ne pas faire l’objet d’une interdiction d’exercice."
                />

                <CheckboxLine
                  register={register}
                  name="absenceInterdictionRemplacant"
                  error={Boolean(
                    errors
                      .absenceInterdictionRemplacant
                  )}
                  label="L’infirmier remplaçant atteste ne pas faire l’objet d’une interdiction d’exercice."
                />

                <CheckboxLine
                  register={register}
                  name="absenceLiquidationJudiciaire"
                  error={Boolean(
                    errors
                      .absenceLiquidationJudiciaire
                  )}
                  label="Les parties attestent ne pas faire l’objet d’une liquidation judiciaire incompatible avec l’exercice ou le remplacement."
                />

                <CheckboxLine
                  register={register}
                  name="deconventionnementRemplace"
                  error={Boolean(
                    errors
                      .deconventionnementRemplace
                  )}
                  label="L’infirmier remplacé déclare ne faire l’objet d’aucune mesure de déconventionnement faisant obstacle à son remplacement."
                />

                <CheckboxLine
                  register={register}
                  name="deconventionnementRemplacant"
                  error={Boolean(
                    errors
                      .deconventionnementRemplacant
                  )}
                  label="L’infirmier remplaçant déclare ne faire l’objet d’aucune mesure de déconventionnement faisant obstacle au remplacement."
                />

                <CheckboxLine
                  register={register}
                  name="remplacantUtiliseSaCps"
                  error={Boolean(
                    errors.remplacantUtiliseSaCps
                  )}
                  label="L’infirmier remplaçant confirme utiliser sa propre CPS ou e-CPS lorsque ce mode est retenu."
                />

                <CheckboxLine
                  register={register}
                  name="jamaisCpsDuRemplace"
                  error={Boolean(
                    errors.jamaisCpsDuRemplace
                  )}
                  label="Les parties confirment que la CPS personnelle du remplacé ne sera jamais utilisée directement par le remplaçant."
                />

                <CheckboxLine
                  register={register}
                  name="remplacantIdentifiePersonnellement"
                  error={Boolean(
                    errors
                      .remplacantIdentifiePersonnellement
                  )}
                  label="Le remplaçant sera personnellement identifié pour les actes réalisés pendant le remplacement."
                />

                <CheckboxLine
                  register={register}
                  name="rcpValide"
                  error={Boolean(
                    errors.rcpValide
                  )}
                  label="Le remplaçant atteste disposer d’une assurance de responsabilité civile professionnelle valide."
                />

                <CheckboxLine
                  register={register}
                  name="autorisationValide"
                  error={Boolean(
                    errors.autorisationValide
                  )}
                  label="Le remplaçant non installé atteste disposer d’une autorisation de remplacement valide."
                />

                <CheckboxLine
                  register={register}
                  name="pasPlusDeuxRemplacements"
                  error={Boolean(
                    errors
                      .pasPlusDeuxRemplacements
                  )}
                  label="Le remplaçant atteste ne pas assurer plus de deux remplacements simultanément."
                />

                <CheckboxLine
                  register={register}
                  name="informationCpam"
                  error={Boolean(
                    errors.informationCpam
                  )}
                  label="Les CPAM concernées ont été informées des modalités du remplacement."
                />

                <CheckboxLine
                  register={register}
                  name="justificatifsRemuneration"
                  error={Boolean(
                    errors
                      .justificatifsRemuneration
                  )}
                  label="Le remplacé s’engage à fournir les justificatifs permettant de vérifier la rémunération due."
                />

                <CheckboxLine
                  register={register}
                  name="conventionNationaleInformee"
                  error={Boolean(
                    errors
                      .conventionNationaleInformee
                  )}
                  label="Le remplacé s’engage à informer le remplaçant des dispositions utiles de la Convention nationale."
                />

                <CheckboxLine
                  register={register}
                  name="restitutionLocauxMateriel"
                  error={Boolean(
                    errors
                      .restitutionLocauxMateriel
                  )}
                  label="Le remplaçant s’engage à restituer les locaux et le matériel dans leur état initial, sous réserve de leur usage normal."
                />

                <CheckboxLine
                  register={register}
                  name="transmissionInformationsContinuiteSoins"
                  error={Boolean(
                    errors
                      .transmissionInformationsContinuiteSoins
                  )}
                  label="Le remplaçant s’engage, à la fin de la mission, à cesser ses activités de remplacement auprès des patients du remplacé et à transmettre les informations nécessaires à la continuité des soins."
                />

                <CheckboxLine
                  register={register}
                  name="conciliationPrealable"
                  error={Boolean(
                    errors.conciliationPrealable
                  )}
                  label="Les parties s’engagent à recourir à une tentative préalable de conciliation en cas de différend relatif au présent contrat."
                />

                <CheckboxLine
                  register={register}
                  name="transmissionOrdre"
                  error={Boolean(
                    errors.transmissionOrdre
                  )}
                  label="Les parties s’engagent à transmettre le contrat au conseil de l’Ordre compétent dans le délai d’un mois suivant sa signature."
                />

                <CheckboxLine
                  register={register}
                  name="aucuneContreLettre"
                  error={Boolean(
                    errors.aucuneContreLettre
                  )}
                  label="Les parties déclarent qu’aucune contre-lettre ne modifie le présent contrat."
                />
              </section>
            )}

            {isStepVisible(8) && (
              <>
                <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
                  <StepHeader
                    number={8}
                    title="Annexes et synthèse"
                  />

                  <Field
                    label="Annexes retenues"
                    error={
                      errors.annexesSelectionnees
                        ?.message
                    }
                  >
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <CheckboxSimple
                        register={register}
                        name="annexeAttestationRcProf"
                        label="Attestation de responsabilité civile professionnelle"
                      />

                      <CheckboxSimple
                        register={register}
                        name="annexeAutorisationRemplacement"
                        label="Copie de l’autorisation de remplacement"
                      />

                      <CheckboxSimple
                        register={register}
                        name="annexeJustificatif2400h"
                        label="Justificatif des 18 mois ou 2 400 heures"
                      />

                      <CheckboxSimple
                        register={register}
                        name="annexePlanning"
                        label="Planning"
                      />

                      <CheckboxSimple
                        register={register}
                        name="annexeInventaireMateriel"
                        label="Inventaire du matériel"
                      />

                      <CheckboxSimple
                        register={register}
                        name="annexeEtatLieuxEntree"
                        label="État des lieux d’entrée"
                      />

                      <CheckboxSimple
                        register={register}
                        name="annexeEtatLieuxSortie"
                        label="État des lieux de sortie"
                      />

                      <CheckboxSimple
                        register={register}
                        name="annexeJustificatifAgrementGroupe"
                        label="Justificatif d’information ou d’agrément du groupe"
                      />

                      <CheckboxSimple
                        register={register}
                        name="annexeAutreDocument"
                        label="Autre document renseigné"
                      />
                    </div>
                  </Field>

                  <CheckboxLine
                    register={register}
                    name="syntheseRelue"
                    error={Boolean(
                      errors.syntheseRelue
                    )}
                    label="Les parties confirment avoir vérifié la synthèse avant la signature."
                  />
                </section>

                <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
                  <SubsectionHeader title="Signature du contrat" />

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Fait à"
                      error={errors.faitA?.message}
                    >
                      <input
                        className={inputClass}
                        {...register("faitA")}
                      />
                    </Field>

                    <Field
                      label="Fait le"
                      error={errors.faitLe?.message}
                    >
                      <input
                        type="date"
                        className={inputClass}
                        {...register("faitLe")}
                      />
                    </Field>

                    <Field
                      label="Nombre d’exemplaires"
                      error={
                        errors.nombreExemplaires
                          ?.message
                      }
                    >
                      <input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        className={inputClass}
                        {...register(
                          "nombreExemplaires"
                        )}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Précisions complémentaires relatives aux annexes"
                    error={
                      errors.annexesSelectionnees
                        ?.message
                    }
                  >
                    <textarea
                      className={inputClass}
                      rows={3}
                      {...register(
                        "annexesSelectionnees"
                      )}
                    />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <SignaturePad
                      label="Signature de l’infirmier remplacé"
                      value={signatureRemplace}
                      onChange={
                        setSignatureRemplace
                      }
                    />

                    <SignaturePad
                      label="Signature de l’infirmier remplaçant"
                      value={signatureRemplacant}
                      onChange={
                        setSignatureRemplacant
                      }
                    />
                  </div>
                </section>
              </>
            )}

            <div className="no-print mt-6 hidden flex-col gap-3 border-t border-slate-200 pt-5 md:flex sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Précédent
              </button>

              <p className="text-center text-sm text-slate-500">
                Étape {currentStep} sur{" "}
                {FORM_STEPS.length}
              </p>

              {currentStep <
              FORM_STEPS.length ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="rounded-xl bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800"
                >
                  Suivant →
                </button>
              ) : (
                <button
                  type="submit"
                  className="rounded-xl bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800"
                >
                  Valider le contrat et imprimer en
                  PDF
                </button>
              )}
            </div>

            {validatedData && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
                Contrat validé. Choisissez
                « Enregistrer en PDF » dans la
                fenêtre d’impression.
              </p>
            )}
          </form>

          <div
            className={`${
              showPreviewMobile
                ? "block"
                : "hidden"
            } space-y-4 md:block`}
          >
            <LegalAudit data={currentData} />

            <TransmissionMail
              data={currentData}
            />

            <ContractPreview
              data={currentData}
              signatureRemplace={
                signatureRemplace
              }
              signatureRemplacant={
                signatureRemplacant
              }
            />
          </div>
        </div>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-3 shadow-lg md:hidden">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="rounded-xl border border-slate-300 bg-white px-3 py-4 text-sm font-semibold text-slate-700 disabled:opacity-40"
          >
            ← Précédent
          </button>

          {currentStep < FORM_STEPS.length ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="rounded-xl bg-red-700 px-3 py-4 text-sm font-semibold text-white"
            >
              Suivant →
            </button>
          ) : (
            <button
              type="submit"
              form="contract-form"
              className="rounded-xl bg-red-700 px-3 py-4 text-sm font-semibold text-white"
            >
              Générer le PDF
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function StepHeader({
  number,
  title,
}: {
  number: number;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 md:text-sm">
        Étape {number}
      </p>

      <h2 className="text-lg font-bold text-slate-950 md:text-xl">
        {title}
      </h2>
    </div>
  );
}

function SubsectionHeader({
  title,
}: {
  title: string;
}) {
  return (
    <h3 className="text-base font-bold text-slate-950 md:text-lg">
      {title}
    </h3>
  );
}

function CheckboxLine({
  register,
  name,
  label,
  error,
}: {
  register: UseFormRegister<ContractData>;
  name: keyof ContractData;
  label: string;
  error: boolean;
}) {
  return (
    <div>
      <label className="flex gap-3 text-sm leading-6 text-slate-900">
        <input
          className="mt-1 h-5 w-5 shrink-0 md:h-4 md:w-4"
          type="checkbox"
          {...register(name)}
        />

        <span>{label}</span>
      </label>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          Cette confirmation est obligatoire.
        </p>
      )}
    </div>
  );
}

function CheckboxSimple({
  register,
  name,
  label,
}: {
  register: UseFormRegister<ContractData>;
  name: keyof ContractData;
  label: string;
}) {
  return (
    <label className="mb-2 flex gap-3 text-sm leading-6 text-slate-900">
      <input
        className="mt-1 h-5 w-5 shrink-0 md:h-4 md:w-4"
        type="checkbox"
        {...register(name)}
      />

      <span>{label}</span>
    </label>
  );
}