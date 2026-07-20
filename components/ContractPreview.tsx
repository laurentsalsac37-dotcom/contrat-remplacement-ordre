import Image from "next/image";
import { ContractData } from "@/lib/schema";
import {
  buildContractText,
  modeFacturationLabel,
  motifLabel,
  yesNoLabel,
} from "@/lib/contract";

type Props = {
  data: Partial<ContractData>;
  signatureRemplace?: string;
  signatureRemplacant?: string;
};

type CiviliteLabels = {
  roleRemplace: string;
  roleRemplacant: string;
  signatureRemplace: string;
  signatureRemplacant: string;
};

function civiliteLabels(
  remplaceCivilite?: string,
  remplacantCivilite?: string
): CiviliteLabels {
  const remplaceEstFemme =
    remplaceCivilite === "Mme" ||
    remplaceCivilite === "Madame" ||
    remplaceCivilite?.toLowerCase() === "femme";

  const remplacantEstFemme =
    remplacantCivilite === "Mme" ||
    remplacantCivilite === "Madame" ||
    remplacantCivilite?.toLowerCase() === "femme";

  return {
    roleRemplace: remplaceEstFemme
      ? "infirmière remplacée"
      : "infirmier remplacé",
    roleRemplacant: remplacantEstFemme
      ? "infirmière remplaçante"
      : "infirmier remplaçant",
    signatureRemplace: remplaceEstFemme
      ? "Signature de l’infirmière remplacée"
      : "Signature de l’infirmier remplacé",
    signatureRemplacant: remplacantEstFemme
      ? "Signature de l’infirmière remplaçante"
      : "Signature de l’infirmier remplaçant",
  };
}

function formatDate(date?: string) {
  if (!date) {
    return "à compléter";
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

function formatNumber(input: unknown, fallback = "à compléter") {
  if (input === undefined || input === null || input === "") {
    return fallback;
  }

  const parsed = Number(input);

  if (!Number.isFinite(parsed)) {
    return String(input);
  }

  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(parsed);
}

function buildAnnexes(data: Partial<ContractData>) {
  const annexes: string[] = [];

  if (data.annexeAttestationRcProf) {
    annexes.push("Attestation de responsabilité civile professionnelle");
  }

  if (data.annexeAutorisationRemplacement) {
    annexes.push("Copie de l’autorisation de remplacement");
  }

  if (data.annexeJustificatif2400h) {
    annexes.push("Justificatif des dix-huit mois ou 2 400 heures");
  }

  if (data.annexePlanning) {
    annexes.push("Planning du remplacement");
  }

  if (data.annexeInventaireMateriel) {
    annexes.push("Inventaire du matériel");
  }

  if (data.annexeEtatLieuxEntree) {
    annexes.push("État des lieux d’entrée");
  }

  if (data.annexeEtatLieuxSortie) {
    annexes.push("État des lieux de sortie");
  }

  if (data.annexeJustificatifAgrementGroupe) {
    annexes.push("Justificatif d’information ou d’agrément du groupe");
  }

  if (data.annexeAutreDocument) {
    annexes.push(
      data.annexeAutreDocumentPrecision
        ? `Autre document : ${data.annexeAutreDocumentPrecision}`
        : "Autre document"
    );
  }

  return annexes;
}

function retrocessionLabel(data: Partial<ContractData>) {
  if (
    data.pourcentageReverse === undefined ||
    data.pourcentageReverse === null
  ) {
    return "à compléter";
  }

  return `${formatNumber(data.pourcentageReverse)} %`;
}

function redevanceLabel(data: Partial<ContractData>) {
  if (data.redevancePrevue !== "oui") {
    return "Aucune redevance";
  }

  return `${formatNumber(data.tauxRedevance)} %`;
}

function fraisKilometriquesLabel(data: Partial<ContractData>) {
  if (data.redevancePrevue !== "oui") {
    return "Sans objet";
  }

  if (data.fraisKilometriquesExclus === "oui") {
    return "Exclus de l’assiette de la redevance";
  }

  if (data.fraisKilometriquesExclus === "non") {
    return "Inclus dans l’assiette de la redevance";
  }

  return "à confirmer";
}

function nonReinstallationLabel(data: Partial<ContractData>) {
  if (data.remplacementSuperieurTroisMois !== "oui") {
    return "Remplacement n’excédant pas trois mois";
  }

  const details: string[] = ["Durée de deux ans"];

  if (data.rayonKm) {
    details.push(`rayon de ${data.rayonKm} km`);
  }

  if (data.communesConcernees) {
    details.push(`communes : ${data.communesConcernees}`);
  }

  if (data.clauseNonConcurrence) {
    details.push(data.clauseNonConcurrence);
  }

  return details.join(", ");
}

function partiesLabel(data: Partial<ContractData>) {
  const remplace = [
    data.remplaceCivilite,
    data.remplacePrenom,
    data.remplaceNom,
  ]
    .filter(Boolean)
    .join(" ");

  const remplacant = [
    data.remplacantCivilite,
    data.remplacantPrenom,
    data.remplacantNom,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    remplace: remplace || "à compléter",
    remplacant: remplacant || "à compléter",
  };
}

export function ContractPreview({
  data,
  signatureRemplace,
  signatureRemplacant,
}: Props) {
  const showAssociesLine = data.exerciceEnGroupe === "oui";

  const labels = civiliteLabels(
    data.remplaceCivilite,
    data.remplacantCivilite
  );

  const parties = partiesLabel(data);
  const annexes = buildAnnexes(data);

  const generatedAt = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="contract-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="no-print mb-6 border-b border-slate-200 pb-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
          Prévisualisation
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-950">
          Contrat rempli automatiquement
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Vérifiez le contenu, la synthèse et les signatures avant l’impression
          ou l’enregistrement au format PDF.
        </p>
      </div>

      <article className="contract-document mx-auto bg-white text-slate-950">
        <header className="mb-8 flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold uppercase leading-7">
              Contrat de remplacement entre un infirmier libéral et un
              infirmier titulaire d’une autorisation de remplacement
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Contrat rédigé à partir du modèle publié par le Conseil national
              de l’Ordre des infirmiers, mis à jour le 15 novembre 2023.
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              La génération du document ne vaut pas validation individuelle par
              le conseil de l’Ordre compétent.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Document généré le {generatedAt}
            </p>
          </div>

          <Image
            src="/logo-cidoi-37-41.png"
            alt="Conseil interdépartemental de l’Ordre des infirmiers d’Indre-et-Loire et de Loir-et-Cher"
            width={180}
            height={180}
            className="h-auto w-[160px] shrink-0 object-contain"
            priority
          />
        </header>

        <div className="contract-text whitespace-pre-wrap font-serif text-[11.5pt] leading-7">
          {buildContractText(data)}
        </div>

        <section className="contract-summary mt-8 break-inside-avoid rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Synthèse préalable à la signature
          </p>

          <div className="mt-4 grid gap-x-8 gap-y-3 text-sm leading-6 text-slate-700 md:grid-cols-2">
            <p>
              <span className="font-semibold text-slate-900">
                {labels.roleRemplace.charAt(0).toUpperCase()}
                {labels.roleRemplace.slice(1)} :
              </span>{" "}
              {parties.remplace}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                {labels.roleRemplacant.charAt(0).toUpperCase()}
                {labels.roleRemplacant.slice(1)} :
              </span>{" "}
              {parties.remplacant}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Numéro ordinal du remplacé :
              </span>{" "}
              {data.remplaceNumeroOrdinal || "à compléter"}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Numéro ordinal du remplaçant :
              </span>{" "}
              {data.remplacantNumeroOrdinal || "à compléter"}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                RPPS du remplacé :
              </span>{" "}
              {data.remplaceNumeroRpps || "à compléter"}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                RPPS du remplaçant :
              </span>{" "}
              {data.remplacantNumeroRpps || "à compléter"}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Motif :
              </span>{" "}
              {data.motif ? motifLabel(data) : "à compléter"}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Période :
              </span>{" "}
              {formatDate(data.dateDebut)} au {formatDate(data.dateFin)}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Autorisation :
              </span>{" "}
              {data.numeroAutorisation || "à compléter"}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Validité de l’autorisation :
              </span>{" "}
              {formatDate(data.dateAutorisation)} au{" "}
              {formatDate(data.dateFinValiditeAutorisation)}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Facturation :
              </span>{" "}
              {data.modeFacturation
                ? modeFacturationLabel(data.modeFacturation)
                : "à compléter"}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Rétrocession :
              </span>{" "}
              {retrocessionLabel(data)}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Redevance :
              </span>{" "}
              {redevanceLabel(data)}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Indemnités kilométriques :
              </span>{" "}
              {fraisKilometriquesLabel(data)}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Patients informés :
              </span>{" "}
              {data.patientsInformes
  ? "Oui"
  : "À confirmer avant signature"}
            </p>

            {showAssociesLine && (
              <p>
                <span className="font-semibold text-slate-900">
                  Associés ou cocontractants informés :
                </span>{" "}
                {yesNoLabel(data.associesInformes, "À confirmer")}
              </p>
            )}

            <p>
              <span className="font-semibold text-slate-900">
                Non-réinstallation :
              </span>{" "}
              {nonReinstallationLabel(data)}
            </p>

            <p>
              <span className="font-semibold text-slate-900">
                Nombre d’exemplaires :
              </span>{" "}
              {data.nombreExemplaires || 3}
            </p>

            <p className="md:col-span-2">
              <span className="font-semibold text-slate-900">
                Annexes :
              </span>{" "}
              {annexes.length > 0
                ? annexes.join(", ")
                : "Aucune annexe sélectionnée"}
            </p>
          </div>
        </section>

        <section className="signature-section mt-10 break-inside-avoid">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="min-h-44 border-t border-slate-300 pt-4">
              <p className="mb-3 text-sm font-semibold text-slate-900">
                {labels.signatureRemplace}
              </p>

              {signatureRemplace ? (
                // Les signatures sont des images générées localement sous forme de data URL.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={signatureRemplace}
                  alt={labels.signatureRemplace}
                  className="h-28 max-w-full object-contain"
                />
              ) : (
                <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
                  Signature non renseignée
                </div>
              )}
            </div>

            <div className="min-h-44 border-t border-slate-300 pt-4">
              <p className="mb-3 text-sm font-semibold text-slate-900">
                {labels.signatureRemplacant}
              </p>

              {signatureRemplacant ? (
                // Les signatures sont des images générées localement sous forme de data URL.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={signatureRemplacant}
                  alt={labels.signatureRemplacant}
                  className="h-28 max-w-full object-contain"
                />
              ) : (
                <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
                  Signature non renseignée
                </div>
              )}
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}