import { ContractData } from "./schema";
import {
  modeFacturationLabel,
  motifLabel,
} from "./contract";

function value(input: unknown) {
  if (input === undefined || input === null || input === "") {
    return "...";
  }

  return String(input);
}

function normalizeCivilite(civilite?: string) {
  const normalized = civilite?.trim().toLowerCase();

  if (
    normalized === "mme" ||
    normalized === "madame" ||
    normalized === "femme"
  ) {
    return "Mme";
  }

  if (
    normalized === "m" ||
    normalized === "m." ||
    normalized === "monsieur" ||
    normalized === "homme"
  ) {
    return "M.";
  }

  return civilite || "";
}

type PersonGrammar = {
  profession: string;
  remplace: string;
  remplacant: string;
  inscrit: string;
  titulaire: string;
  pronom: string;
};

function grammarForCivilite(civilite?: string): PersonGrammar {
  if (normalizeCivilite(civilite) === "Mme") {
    return {
      profession: "infirmière diplômée d’État",
      remplace: "remplacée",
      remplacant: "remplaçante",
      inscrit: "inscrite",
      titulaire: "titulaire",
      pronom: "elle",
    };
  }

  return {
    profession: "infirmier diplômé d’État",
    remplace: "remplacé",
    remplacant: "remplaçant",
    inscrit: "inscrit",
    titulaire: "titulaire",
    pronom: "il",
  };
}

function formatDate(date?: string) {
  if (!date) {
    return "...";
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

function buildSelectedAnnexes(data: Partial<ContractData>) {
  const annexes: string[] = [];

  if (data.annexeAttestationRcProf) {
    annexes.push("attestation de responsabilité civile professionnelle");
  }

  if (data.annexeAutorisationRemplacement) {
    annexes.push("copie de l’autorisation de remplacement");
  }

  if (data.annexeJustificatif2400h) {
    annexes.push("justificatif des dix-huit mois ou 2 400 heures");
  }

  if (data.annexePlanning) {
    annexes.push("planning du remplacement");
  }

  if (data.annexeInventaireMateriel) {
    annexes.push("inventaire du matériel");
  }

  if (data.annexeEtatLieuxEntree) {
    annexes.push("état des lieux d’entrée");
  }

  if (data.annexeEtatLieuxSortie) {
    annexes.push("état des lieux de sortie");
  }

  if (data.annexeJustificatifAgrementGroupe) {
    annexes.push("justificatif d’information ou d’agrément du groupe");
  }

  if (data.annexeAutreDocument) {
    annexes.push(
      data.annexeAutreDocumentPrecision
        ? `autre document : ${data.annexeAutreDocumentPrecision}`
        : "autre document"
    );
  }

  return annexes;
}

function annexesText(data: Partial<ContractData>) {
  const annexes = buildSelectedAnnexes(data);

  if (annexes.length === 0) {
    return "Aucune annexe complémentaire n’est mentionnée dans le formulaire.";
  }

  return `Les annexes suivantes accompagnent le contrat :

${annexes.map((annexe) => `- ${annexe}`).join("\n")}`;
}

function transmissionCouncil(data: Partial<ContractData>) {
  if (data.conseilAutorisation) {
    return data.conseilAutorisation;
  }

  return "le conseil départemental ou interdépartemental de l’Ordre compétent";
}

export function buildTransmissionMail(data: Partial<ContractData>) {
  const remplaceGrammar = grammarForCivilite(data.remplaceCivilite);
  const remplacantGrammar = grammarForCivilite(data.remplacantCivilite);

  const remplace = [
    value(data.remplaceCivilite),
    value(data.remplacePrenom),
    value(data.remplaceNom),
  ].join(" ");

  const remplacant = [
    value(data.remplacantCivilite),
    value(data.remplacantPrenom),
    value(data.remplacantNom),
  ].join(" ");

  const objet = `Transmission du contrat de remplacement de ${value(
    data.remplaceNom
  )} par ${value(data.remplacantNom)}`;

  return `Objet : ${objet}

Madame, Monsieur,

Veuillez trouver ci-joint le contrat de remplacement conclu entre :

${remplace}, ${remplaceGrammar.profession} ${remplaceGrammar.remplace}, ${remplaceGrammar.inscrit} au tableau de l’Ordre sous le numéro ${value(data.remplaceNumeroOrdinal)}, numéro RPPS ${value(data.remplaceNumeroRpps)},

et

${remplacant}, ${remplacantGrammar.profession} ${remplacantGrammar.remplacant}, ${remplacantGrammar.inscrit} au tableau de l’Ordre sous le numéro ${value(data.remplacantNumeroOrdinal)}, numéro RPPS ${value(data.remplacantNumeroRpps)}.

Le remplacement est prévu du ${formatDate(data.dateDebut)} au ${formatDate(data.dateFin)}.

Motif du remplacement : ${motifLabel(data)}.

Mode de facturation retenu : ${modeFacturationLabel(data.modeFacturation)}.

L’autorisation de remplacement n° ${value(data.numeroAutorisation)} a été délivrée le ${formatDate(data.dateAutorisation)} par ${transmissionCouncil(data)} et demeure valable jusqu’au ${formatDate(data.dateFinValiditeAutorisation)}.

${annexesText(data)}

Le présent contrat vous est transmis dans le délai d’un mois suivant sa signature, conformément aux dispositions applicables aux contrats ayant pour objet l’exercice de la profession infirmière.

Je vous remercie de bien vouloir prendre acte de cette transmission.

Bien cordialement,

${remplace}
${remplaceGrammar.profession}
Numéro ordinal : ${value(data.remplaceNumeroOrdinal)}
Numéro RPPS : ${value(data.remplaceNumeroRpps)}
Courriel : ${value(data.remplaceEmail)}
Téléphone : ${value(data.remplaceTelephone)}`;
}