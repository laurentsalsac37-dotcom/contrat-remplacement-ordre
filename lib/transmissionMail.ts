import { ContractData } from "./schema"
import { motifLabel } from "./contract"

function value(input: unknown) {
  if (input === undefined || input === null || input === "") {
    return "..."
  }

  return String(input)
}

function grammarForCivilite(civilite?: string) {
  if (civilite === "Mme") {
    return {
      profession: "infirmière diplômée d’État",
      remplace: "remplacée",
      remplacant: "remplaçante",
      inscrit: "inscrite",
    }
  }

  return {
    profession: "infirmier diplômé d’État",
    remplace: "remplacé",
    remplacant: "remplaçant",
    inscrit: "inscrit",
  }
}

export function buildTransmissionMail(data: Partial<ContractData>) {
  const remplace = `${value(data.remplaceCivilite)} ${value(data.remplacePrenom)} ${value(data.remplaceNom)}`
  const remplacant = `${value(data.remplacantCivilite)} ${value(data.remplacantPrenom)} ${value(data.remplacantNom)}`
  const remplaceGrammar = grammarForCivilite(data.remplaceCivilite)
  const remplacantGrammar = grammarForCivilite(data.remplacantCivilite)

  return `Objet : Transmission d’un contrat de remplacement infirmier

Madame, Monsieur,

Veuillez trouver ci-joint le contrat de remplacement conclu entre :

${remplace}, ${remplaceGrammar.profession} ${remplaceGrammar.remplace}, ${remplaceGrammar.inscrit} au tableau de l’Ordre sous le numéro ${value(data.remplaceNumeroOrdinal)}, numéro RPPS ${value(data.remplaceNumeroRpps)},

et

${remplacant}, ${remplacantGrammar.profession} ${remplacantGrammar.remplacant}, ${remplacantGrammar.inscrit} au tableau de l’Ordre sous le numéro ${value(data.remplacantNumeroOrdinal)}, numéro RPPS ${value(data.remplacantNumeroRpps)}.

Le remplacement est prévu du ${value(data.dateDebut)} au ${value(data.dateFin)}.

Motif du remplacement : ${motifLabel(data)}.

Le présent contrat vous est transmis dans le délai d’un mois suivant sa signature.

Le contrat est transmis conformément aux obligations applicables aux contrats ayant pour objet l’exercice de la profession infirmière.

Je vous remercie par avance pour l’enregistrement de cette transmission et reste à disposition pour toute précision utile.

Bien cordialement,

${remplace}`
}