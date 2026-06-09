import { ContractData } from "./schema"

function value(input: unknown) {
  if (input === undefined || input === null || input === "") {
    return "..."
  }

  return String(input)
}

export function buildTransmissionMail(data: Partial<ContractData>) {
  const remplace = `${value(data.remplaceCivilite)} ${value(data.remplacePrenom)} ${value(data.remplaceNom)}`
  const remplacant = `${value(data.remplacantCivilite)} ${value(data.remplacantPrenom)} ${value(data.remplacantNom)}`

  return `Objet : Transmission d’un contrat de remplacement infirmier

Madame, Monsieur,

Veuillez trouver ci-joint le contrat de remplacement conclu entre :

${remplace}, infirmier remplacé, inscrit au tableau de l’Ordre sous le numéro ${value(data.remplaceNumeroOrdinal)}, numéro RPPS ${value(data.remplaceNumeroRpps)},

et

${remplacant}, infirmier remplaçant, inscrit au tableau de l’Ordre sous le numéro ${value(data.remplacantNumeroOrdinal)}, numéro RPPS ${value(data.remplacantNumeroRpps)}.

Le remplacement est prévu du ${value(data.dateDebut)} au ${value(data.dateFin)}.

Motif du remplacement : ${value(data.motif)}.

Le contrat est transmis conformément aux obligations applicables aux contrats ayant pour objet l’exercice de la profession infirmière.

Je vous remercie par avance pour l’enregistrement de cette transmission et reste à disposition pour toute précision utile.

Bien cordialement,

${remplace}`
}