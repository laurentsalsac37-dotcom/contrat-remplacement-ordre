import { ContractData } from "./schema";

function value(input: unknown) {
  if (input === undefined || input === null || input === "") {
    return "................................";
  }

  return String(input);
}

function motifLabel(data: Partial<ContractData>) {
  const labels: Record<string, string> = {
    conge_annuel: "congé annuel",
    conge_personnel: "congé personnel",
    conge_maladie: "congé maladie",
    conge_maternite: "congé maternité",
    conge_paternite: "congé paternité",
    formation: "formation professionnelle",
    mandat_ordinal: "mandat ordinal",
    mandat_syndical: "mandat syndical",
    motif_familial: "motif familial",
    autre: value(data.motifAutre),
  };

  return labels[data.motif || ""] || value(data.motif);
}

function typeRemplacementLabel(type?: string) {
  const labels: Record<string, string> = {
    continu: "remplacement continu",
    jours_precis: "remplacement sur jours précis",
    planning_annexe: "remplacement selon planning annexé au présent contrat",
  };

  return labels[type || ""] || value(type);
}

function modeFacturationLabel(mode?: string) {
  const labels: Record<string, string> = {
    cps_remplacant: "utilisation par le remplaçant de sa propre CPS ou e-CPS",
    feuilles_soins: "utilisation de feuilles de soins papier pré-identifiées au nom du remplacé, avec identification personnelle du remplaçant",
  };

  return labels[mode || ""] || value(mode);
}

export function buildContractText(data: Partial<ContractData>) {
  const nonConcurrenceApplicable =
    data.remplacementSuperieurTroisMois === "oui";

  return `
CONTRAT DE REMPLACEMENT ENTRE UN INFIRMIER LIBÉRAL ET UN INFIRMIER TITULAIRE D’UNE AUTORISATION DE REMPLACEMENT

Entre les soussignés :

${value(data.remplaceCivilite)} ${value(data.remplacePrenom)} ${value(data.remplaceNom)}, infirmier diplômé d’État, inscrit au tableau de l’Ordre sous le numéro ${value(data.remplaceNumeroOrdinal)}, numéro RPPS ${value(data.remplaceNumeroRpps)}, exerçant au cabinet professionnel situé ${value(data.remplaceAdresseCabinet)}, ${value(data.remplaceCodePostal)} ${value(data.remplaceVille)}, téléphone ${value(data.remplaceTelephone)}, courriel ${value(data.remplaceEmail)}, rattaché à la CPAM de ${value(data.remplaceCpam)}.

Ci-après désigné « l’infirmier remplacé »,

Et

${value(data.remplacantCivilite)} ${value(data.remplacantPrenom)} ${value(data.remplacantNom)}, infirmier diplômé d’État, inscrit au tableau de l’Ordre sous le numéro ${value(data.remplacantNumeroOrdinal)}, numéro RPPS ${value(data.remplacantNumeroRpps)}, domicilié ${value(data.remplacantAdresse)}, ${value(data.remplacantCodePostal)} ${value(data.remplacantVille)}, téléphone ${value(data.remplacantTelephone)}, courriel ${value(data.remplacantEmail)}, titulaire d’une autorisation de remplacement n° ${value(data.numeroAutorisation)}, délivrée le ${value(data.dateAutorisation)} par ${value(data.conseilAutorisation)}, avec autorisation d’exercice auprès de la CPAM de ${value(data.cpamAutorisation)}.

Ci-après désigné « l’infirmier remplaçant »,

Il a été convenu ce qui suit.

ARTICLE 1 - OBJET DU CONTRAT

Le présent contrat a pour objet d’organiser le remplacement personnel, temporaire et ponctuel de l’infirmier remplacé par l’infirmier remplaçant.

Le motif du remplacement est le suivant : ${motifLabel(data)}.

L’infirmier remplacé déclare suspendre personnellement son activité professionnelle pendant les périodes couvertes par le présent contrat.

L’infirmier remplacé ne doit pas exercer simultanément avec son remplaçant sur l’activité objet du remplacement.

ARTICLE 2 - DURÉE DU REMPLACEMENT

Le remplacement débutera le ${value(data.dateDebut)} et prendra fin le ${value(data.dateFin)}.

Le remplacement est organisé selon la modalité suivante : ${typeRemplacementLabel(data.typeRemplacement)}.

Jours précis, si applicable :
${value(data.joursPrecis)}

Précisions relatives au planning annexé, si applicable :
${value(data.planningAnnexePrecision)}

Toute prolongation du remplacement devra faire l’objet d’un avenant daté et signé par les deux parties avant le terme du présent contrat.

ARTICLE 3 - LIEU D’EXERCICE ET MOYENS MIS À DISPOSITION

Le remplacement s’effectuera au lieu suivant :
${value(data.adresseExercice)}

L’infirmier remplacé met à disposition de l’infirmier remplaçant les locaux, installations, équipements et matériels nécessaires à la continuité des soins.

Matériel mis à disposition :
${value(data.materielMisADisposition)}

Logiciel professionnel utilisé, le cas échéant :
${value(data.logicielProfessionnel)}

Secrétariat ou organisation administrative, le cas échéant :
${value(data.secretariat)}

Cette mise à disposition n’a pas la nature d’un bail, d’une sous-location, ni d’une mise à disposition donnant lieu à indemnité d’occupation distincte.

ARTICLE 4 - CONDITIONS D’EXERCICE DU REMPLAÇANT

L’infirmier remplaçant exerce sous sa responsabilité personnelle.

Il s’engage à respecter les règles professionnelles, les règles déontologiques, le secret professionnel, les règles de sécurité des soins, la continuité des soins et les obligations liées à son autorisation de remplacement.

L’infirmier remplaçant atteste disposer d’une assurance responsabilité civile professionnelle valide pour toute la durée du remplacement.

L’infirmier remplaçant atteste ne pas assurer plus de deux remplacements simultanément.

L’infirmier remplaçant s’engage à vérifier la conformité des actes réalisés et des cotations appliquées.

ARTICLE 5 - CPS, FEUILLES DE SOINS ET FACTURATION

Le mode de facturation retenu est le suivant :
${modeFacturationLabel(data.modeFacturation)}

L’infirmier remplaçant utilise sa propre CPS ou e-CPS lorsqu’il facture les actes réalisés pendant le remplacement.

Lorsque des feuilles de soins papier pré-identifiées au nom de l’infirmier remplacé sont utilisées, l’infirmier remplaçant doit y faire apparaître son identification personnelle.

La CPS personnelle de l’infirmier remplacé ne doit jamais être utilisée par le remplaçant.

Les parties reconnaissent que le présent contrat ne constitue ni un exercice conjoint, ni une collaboration, ni une mise à disposition de facturation.

ARTICLE 6 - HONORAIRES ET RÉTROCESSION

L’infirmier remplaçant remettra les recettes ou les éléments nécessaires au calcul de la rétrocession à l’infirmier remplacé au plus tard le ${value(data.dateRemiseRecettes)}.

Le remplaçant percevra ${value(data.pourcentageReverse)} % des honoraires encaissés correspondant aux soins réalisés pendant la période de remplacement.

Le reversement interviendra dans un délai de ${value(data.delaiReversement)} mois.

Pour les honoraires perçus en tiers payant, le remplaçant percevra ${value(data.pourcentageTiersPayant)} % des sommes correspondant aux soins réalisés pendant la période de remplacement.

Le reversement des sommes issues du tiers payant interviendra dans un délai de ${value(data.delaiReversementTiersPayant)} mois.

Modalité de paiement retenue :
${value(data.modalitePaiement)}

ARTICLE 7 - OBLIGATIONS DE L’INFIRMIER REMPLACÉ

L’infirmier remplacé s’engage à suspendre son activité professionnelle pendant les périodes de remplacement.

Il s’engage à transmettre au remplaçant les informations nécessaires à la continuité des soins, dans le respect du secret professionnel.

Il s’engage à informer les organismes d’assurance maladie dans les conditions applicables.

Il s’engage à fournir les documents nécessaires à la vérification des actes facturés, des honoraires encaissés et des sommes dues au remplaçant.

ARTICLE 8 - RÉSILIATION

Le présent contrat prendra fin automatiquement au terme fixé à l’article 2.

Il pourra être résilié d’un commun accord entre les parties, sous réserve d’un préavis de ${value(data.preavisCommunAccord)} jour(s).

En cas de manquement par l’une des parties à ses obligations contractuelles, l’autre partie pourra notifier la résiliation par écrit, avec un préavis de ${value(data.preavisManquement)} jour(s), sauf situation justifiant une cessation immédiate.

Le contrat prendra également fin en cas de retrait de l’autorisation de remplacement, d’interdiction d’exercice, d’indisponibilité devenue définitive ou de tout événement rendant impossible la poursuite du remplacement.

ARTICLE 9 - RENOUVELLEMENT

Toute prolongation du remplacement nécessitera un avenant écrit, daté et signé par les deux parties.

Cet avenant devra préciser la nouvelle période concernée, le motif de prolongation et, le cas échéant, les adaptations nécessaires aux modalités d’organisation du remplacement.

ARTICLE 10 - NON-CONCURRENCE

${
  nonConcurrenceApplicable
    ? `Le remplacement étant supérieur à trois mois, consécutifs ou non, les parties conviennent d’une clause de non-concurrence.

Périmètre retenu :
${value(data.clauseNonConcurrence)}

Rayon kilométrique, si retenu :
${value(data.rayonKm)} km

Communes concernées, si retenues :
${value(data.communesConcernees)}

Durée retenue :
${value(data.dureeNonConcurrence)}

Cette clause doit rester limitée dans le temps, dans l’espace et proportionnée aux intérêts légitimes à protéger.`
    : `Les parties déclarent que le remplacement n’excède pas trois mois, consécutifs ou non. Aucune clause de non-concurrence spécifique n’est retenue dans le présent contrat.`
}

ARTICLE 11 - ABSENCE DE CONTRE-LETTRE

Les parties déclarent qu’aucune contre-lettre ne modifie les stipulations du présent contrat.

ARTICLE 12 - TRANSMISSION AU CONSEIL DE L’ORDRE

Les parties s’engagent à transmettre le présent contrat au Conseil de l’Ordre compétent dans le délai applicable à compter de sa signature.

ARTICLE 13 - SIGNATURES

Fait à ${value(data.faitA)}, le ${value(data.faitLe)}.

Nombre d’exemplaires : ${value(data.nombreExemplaires)}.

Signature de l’infirmier remplacé :




Signature de l’infirmier remplaçant :
`;
}