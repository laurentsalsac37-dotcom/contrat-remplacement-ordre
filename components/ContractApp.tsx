"use client";

import { useState } from "react";
import { Resolver, UseFormRegister, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContractData, contractSchema } from "@/lib/schema";
import { Field } from "./Field";
import { ContractPreview } from "./ContractPreview";

export function ContractApp() {
  const [validatedData, setValidatedData] = useState<ContractData | null>(null);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContractData>({
    resolver: zodResolver(contractSchema) as Resolver<ContractData>,
    defaultValues: {
      remplaceCivilite: "Mme",
      remplaceCpam: "",
      remplacantCivilite: "Mme",
      cpamAutorisation: "",
      motif: "conge_annuel",
      typeRemplacement: "continu",
      modeFacturation: "cps_remplacant",
      pourcentageReverse: 90,
      delaiReversement: 1,
      pourcentageTiersPayant: 90,
      delaiReversementTiersPayant: 1,
      modalitePaiement: "virement",
      preavisCommunAccord: 7,
      preavisManquement: 7,
      remplacementSuperieurTroisMois: "non",
      nombreExemplaires: 3,
      remplaceSuspendActivite: false,
      remplacantUtiliseSaCps: false,
      jamaisCpsDuRemplace: false,
      rcpValide: false,
      autorisationValide: false,
      pasPlusDeuxRemplacements: false,
      transmissionOrdre: false,
      aucuneContreLettre: false,
    },
  });

  const currentData = watch();

  function onSubmit(data: ContractData) {
    setValidatedData(data);
    setTimeout(() => {
      window.print();
    }, 300);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 md:px-3 md:py-2 md:text-sm";

  return (
    <main className="min-h-screen bg-slate-100 pb-28 md:p-6 md:pb-6">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-4 rounded-none bg-white p-4 shadow-sm md:mb-8 md:rounded-2xl md:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-700 md:text-sm">
            Ordre national des infirmiers
          </p>

          <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-950 md:text-3xl">
            Générateur de contrat de remplacement infirmier
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-700 md:max-w-4xl md:text-base">
            Complétez les informations des deux infirmiers, le motif, la durée,
            les honoraires, les modalités de facturation et les attestations
            obligatoires.
          </p>

          <button
            type="button"
            onClick={() => setShowPreviewMobile((value) => !value)}
            className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 md:hidden"
          >
            {showPreviewMobile ? "Masquer le contrat" : "Afficher le contrat"}
          </button>
        </header>

        <div className="print-wrapper grid gap-4 md:gap-6 lg:grid-cols-[1fr_0.95fr]">
          <form
            id="contract-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-none bg-white p-4 shadow-sm md:space-y-6 md:rounded-2xl md:p-6"
          >
            <section className="space-y-4">
              <StepHeader number="1" title="Infirmier remplacé" />

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Civilité" error={errors.remplaceCivilite?.message}>
                  <select className={inputClass} {...register("remplaceCivilite")}>
                    <option value="Mme">Madame</option>
                    <option value="M">Monsieur</option>
                  </select>
                </Field>

                <Field label="Nom" error={errors.remplaceNom?.message}>
                  <input className={inputClass} {...register("remplaceNom")} />
                </Field>

                <Field label="Prénom" error={errors.remplacePrenom?.message}>
                  <input className={inputClass} {...register("remplacePrenom")} />
                </Field>

                <Field label="Numéro ordinal" error={errors.remplaceNumeroOrdinal?.message}>
                  <input className={inputClass} {...register("remplaceNumeroOrdinal")} />
                </Field>

                <Field label="Numéro RPPS" error={errors.remplaceNumeroRpps?.message}>
                  <input className={inputClass} {...register("remplaceNumeroRpps")} />
                </Field>

                <Field label="Téléphone" error={errors.remplaceTelephone?.message}>
                  <input inputMode="tel" className={inputClass} {...register("remplaceTelephone")} />
                </Field>

                <Field label="E-mail" error={errors.remplaceEmail?.message}>
                  <input type="email" className={inputClass} {...register("remplaceEmail")} />
                </Field>

                <Field label="CPAM de rattachement" error={errors.remplaceCpam?.message}>
                  <input className={inputClass} {...register("remplaceCpam")} />
                </Field>
              </div>

              <Field label="Adresse du cabinet" error={errors.remplaceAdresseCabinet?.message}>
                <input className={inputClass} {...register("remplaceAdresseCabinet")} />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Code postal" error={errors.remplaceCodePostal?.message}>
                  <input inputMode="numeric" className={inputClass} {...register("remplaceCodePostal")} />
                </Field>

                <Field label="Ville" error={errors.remplaceVille?.message}>
                  <input className={inputClass} {...register("remplaceVille")} />
                </Field>
              </div>
            </section>

            <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
              <StepHeader number="2" title="Infirmier remplaçant" />

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Civilité" error={errors.remplacantCivilite?.message}>
                  <select className={inputClass} {...register("remplacantCivilite")}>
                    <option value="Mme">Madame</option>
                    <option value="M">Monsieur</option>
                  </select>
                </Field>

                <Field label="Nom" error={errors.remplacantNom?.message}>
                  <input className={inputClass} {...register("remplacantNom")} />
                </Field>

                <Field label="Prénom" error={errors.remplacantPrenom?.message}>
                  <input className={inputClass} {...register("remplacantPrenom")} />
                </Field>

                <Field label="Numéro ordinal" error={errors.remplacantNumeroOrdinal?.message}>
                  <input className={inputClass} {...register("remplacantNumeroOrdinal")} />
                </Field>

                <Field label="Numéro RPPS" error={errors.remplacantNumeroRpps?.message}>
                  <input className={inputClass} {...register("remplacantNumeroRpps")} />
                </Field>

                <Field label="Téléphone" error={errors.remplacantTelephone?.message}>
                  <input inputMode="tel" className={inputClass} {...register("remplacantTelephone")} />
                </Field>

                <Field label="E-mail" error={errors.remplacantEmail?.message}>
                  <input type="email" className={inputClass} {...register("remplacantEmail")} />
                </Field>

                <Field label="Numéro d’autorisation de remplacement" error={errors.numeroAutorisation?.message}>
                  <input className={inputClass} {...register("numeroAutorisation")} />
                </Field>

                <Field label="Date d’autorisation" error={errors.dateAutorisation?.message}>
                  <input type="date" className={inputClass} {...register("dateAutorisation")} />
                </Field>

                <Field label="Conseil ordinal ayant délivré l’autorisation" error={errors.conseilAutorisation?.message}>
                  <input className={inputClass} {...register("conseilAutorisation")} />
                </Field>

                <Field label="CPAM ayant autorisé l’exercice" error={errors.cpamAutorisation?.message}>
                  <input className={inputClass} {...register("cpamAutorisation")} />
                </Field>
              </div>

              <Field label="Adresse personnelle" error={errors.remplacantAdresse?.message}>
                <input className={inputClass} {...register("remplacantAdresse")} />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Code postal" error={errors.remplacantCodePostal?.message}>
                  <input inputMode="numeric" className={inputClass} {...register("remplacantCodePostal")} />
                </Field>

                <Field label="Ville" error={errors.remplacantVille?.message}>
                  <input className={inputClass} {...register("remplacantVille")} />
                </Field>
              </div>
            </section>

            <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
              <StepHeader number="3" title="Motif et durée du remplacement" />

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Motif" error={errors.motif?.message}>
                  <select className={inputClass} {...register("motif")}>
                    <option value="conge_annuel">Congé annuel</option>
                    <option value="conge_personnel">Congé personnel</option>
                    <option value="conge_maladie">Congé maladie</option>
                    <option value="conge_maternite">Congé maternité</option>
                    <option value="conge_paternite">Congé paternité</option>
                    <option value="formation">Formation professionnelle</option>
                    <option value="mandat_ordinal">Mandat ordinal</option>
                    <option value="mandat_syndical">Mandat syndical</option>
                    <option value="motif_familial">Motif familial</option>
                    <option value="autre">Autre</option>
                  </select>
                </Field>

                <Field label="Précision si autre motif" error={errors.motifAutre?.message}>
                  <input className={inputClass} {...register("motifAutre")} />
                </Field>

                <Field label="Date de début" error={errors.dateDebut?.message}>
                  <input type="date" className={inputClass} {...register("dateDebut")} />
                </Field>

                <Field label="Date de fin" error={errors.dateFin?.message}>
                  <input type="date" className={inputClass} {...register("dateFin")} />
                </Field>

                <Field label="Type de remplacement" error={errors.typeRemplacement?.message}>
                  <select className={inputClass} {...register("typeRemplacement")}>
                    <option value="continu">Continu</option>
                    <option value="jours_precis">Jours précis</option>
                    <option value="planning_annexe">Planning annexé</option>
                  </select>
                </Field>
              </div>

              <Field label="Jours précis, si applicable" error={errors.joursPrecis?.message}>
                <textarea className={inputClass} rows={4} {...register("joursPrecis")} />
              </Field>

              <Field label="Précisions relatives au planning annexé" error={errors.planningAnnexePrecision?.message}>
                <textarea className={inputClass} rows={4} {...register("planningAnnexePrecision")} />
              </Field>
            </section>

            <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
              <StepHeader number="4" title="Lieu, matériel et organisation" />

              <Field label="Adresse du lieu d’exercice" error={errors.adresseExercice?.message}>
                <input className={inputClass} {...register("adresseExercice")} />
              </Field>

              <Field label="Matériel mis à disposition" error={errors.materielMisADisposition?.message}>
                <textarea className={inputClass} rows={4} {...register("materielMisADisposition")} />
              </Field>

              <Field label="Logiciel professionnel utilisé" error={errors.logicielProfessionnel?.message}>
                <input className={inputClass} {...register("logicielProfessionnel")} />
              </Field>

              <Field label="Secrétariat ou organisation administrative" error={errors.secretariat?.message}>
                <textarea className={inputClass} rows={4} {...register("secretariat")} />
              </Field>
            </section>

            <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
              <StepHeader number="5" title="Facturation et honoraires" />

              <Field label="Mode de facturation" error={errors.modeFacturation?.message}>
                <select className={inputClass} {...register("modeFacturation")}>
                  <option value="cps_remplacant">CPS ou e-CPS personnelle du remplaçant</option>
                  <option value="feuilles_soins">Feuilles de soins papier avec identification du remplaçant</option>
                </select>
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Date de remise des recettes" error={errors.dateRemiseRecettes?.message}>
                  <input type="date" className={inputClass} {...register("dateRemiseRecettes")} />
                </Field>

                <Field label="Pourcentage reversé au remplaçant" error={errors.pourcentageReverse?.message}>
                  <input type="number" inputMode="numeric" className={inputClass} {...register("pourcentageReverse")} />
                </Field>

                <Field label="Délai de reversement en mois" error={errors.delaiReversement?.message}>
                  <input type="number" inputMode="numeric" className={inputClass} {...register("delaiReversement")} />
                </Field>

                <Field label="Pourcentage tiers payant reversé" error={errors.pourcentageTiersPayant?.message}>
                  <input type="number" inputMode="numeric" className={inputClass} {...register("pourcentageTiersPayant")} />
                </Field>

                <Field label="Délai tiers payant en mois" error={errors.delaiReversementTiersPayant?.message}>
                  <input type="number" inputMode="numeric" className={inputClass} {...register("delaiReversementTiersPayant")} />
                </Field>

                <Field label="Modalité de paiement" error={errors.modalitePaiement?.message}>
                  <select className={inputClass} {...register("modalitePaiement")}>
                    <option value="virement">Virement</option>
                    <option value="cheque">Chèque</option>
                    <option value="autre">Autre</option>
                  </select>
                </Field>
              </div>
            </section>

            <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
              <StepHeader number="6" title="Résiliation et non-concurrence" />

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Préavis accord commun en jours" error={errors.preavisCommunAccord?.message}>
                  <input type="number" inputMode="numeric" className={inputClass} {...register("preavisCommunAccord")} />
                </Field>

                <Field label="Préavis en cas de manquement en jours" error={errors.preavisManquement?.message}>
                  <input type="number" inputMode="numeric" className={inputClass} {...register("preavisManquement")} />
                </Field>

                <Field label="Remplacement supérieur à 3 mois ?" error={errors.remplacementSuperieurTroisMois?.message}>
                  <select className={inputClass} {...register("remplacementSuperieurTroisMois")}>
                    <option value="non">Non</option>
                    <option value="oui">Oui</option>
                  </select>
                </Field>

                <Field label="Type de périmètre de non-concurrence" error={errors.clauseNonConcurrence?.message}>
                  <select className={inputClass} {...register("clauseNonConcurrence")}>
                    <option value="">Non applicable</option>
                    <option value="rayon">Rayon kilométrique</option>
                    <option value="communes">Communes listées</option>
                  </select>
                </Field>

                <Field label="Rayon en kilomètres" error={errors.rayonKm?.message}>
                  <input inputMode="numeric" className={inputClass} {...register("rayonKm")} />
                </Field>

                <Field label="Durée de la clause" error={errors.dureeNonConcurrence?.message}>
                  <input className={inputClass} {...register("dureeNonConcurrence")} />
                </Field>
              </div>

              <Field label="Communes concernées" error={errors.communesConcernees?.message}>
                <textarea className={inputClass} rows={4} {...register("communesConcernees")} />
              </Field>
            </section>

            <section className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 md:p-5">
              <StepHeader number="7" title="Déclarations obligatoires" />

              <CheckboxLine register={register} name="remplaceSuspendActivite" error={Boolean(errors.remplaceSuspendActivite)} label="L’infirmier remplacé confirme suspendre son activité pendant les périodes de remplacement." />
              <CheckboxLine register={register} name="remplacantUtiliseSaCps" error={Boolean(errors.remplacantUtiliseSaCps)} label="L’infirmier remplaçant confirme utiliser sa propre CPS ou e-CPS." />
              <CheckboxLine register={register} name="jamaisCpsDuRemplace" error={Boolean(errors.jamaisCpsDuRemplace)} label="Les parties confirment que la CPS personnelle du remplacé ne sera jamais utilisée." />
              <CheckboxLine register={register} name="rcpValide" error={Boolean(errors.rcpValide)} label="Le remplaçant atteste disposer d’une assurance responsabilité civile professionnelle valide." />
              <CheckboxLine register={register} name="autorisationValide" error={Boolean(errors.autorisationValide)} label="Le remplaçant atteste disposer d’une autorisation de remplacement valide." />
              <CheckboxLine register={register} name="pasPlusDeuxRemplacements" error={Boolean(errors.pasPlusDeuxRemplacements)} label="Le remplaçant atteste ne pas assurer plus de deux remplacements simultanément." />
              <CheckboxLine register={register} name="transmissionOrdre" error={Boolean(errors.transmissionOrdre)} label="Les parties s’engagent à transmettre le contrat au Conseil de l’Ordre compétent." />
              <CheckboxLine register={register} name="aucuneContreLettre" error={Boolean(errors.aucuneContreLettre)} label="Les parties déclarent qu’aucune contre-lettre ne modifie le présent contrat." />
            </section>

            <section className="space-y-4 border-t border-slate-200 pt-5 md:pt-6">
              <StepHeader number="8" title="Signature" />

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Fait à" error={errors.faitA?.message}>
                  <input className={inputClass} {...register("faitA")} />
                </Field>

                <Field label="Fait le" error={errors.faitLe?.message}>
                  <input type="date" className={inputClass} {...register("faitLe")} />
                </Field>

                <Field label="Nombre d’exemplaires" error={errors.nombreExemplaires?.message}>
                  <input type="number" inputMode="numeric" className={inputClass} {...register("nombreExemplaires")} />
                </Field>
              </div>
            </section>

            <button
              type="submit"
              className="hidden w-full rounded-xl bg-red-700 px-4 py-3 font-semibold text-white hover:bg-red-800 md:block"
            >
              Valider le contrat et imprimer en PDF
            </button>

            {validatedData && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
                Contrat validé. Choisis « Enregistrer en PDF » dans la fenêtre
                d’impression.
              </p>
            )}
          </form>

          <div className={`${showPreviewMobile ? "block" : "hidden"} md:block`}>
            <ContractPreview data={currentData} />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-3 shadow-lg md:hidden no-print">
        <button
          type="submit"
          form="contract-form"
          className="w-full rounded-xl bg-red-700 px-4 py-4 text-base font-semibold text-white"
        >
          Valider et générer le PDF
        </button>
      </div>
    </main>
  );
}

function StepHeader({ number, title }: { number: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 md:text-sm">
        Étape {number}
      </p>
      <h2 className="text-lg font-bold text-slate-950 md:text-xl">{title}</h2>
    </div>
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
        <input className="mt-1 h-5 w-5 shrink-0 md:h-4 md:w-4" type="checkbox" {...register(name)} />
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