import { ContractData } from "./schema";

function value(input: unknown) {
  if (input === undefined || input === null || input === "") {
    return "................................";
  }

  return String(input);
}

function yesNo(input: unknown) {
  if (input === "oui") return "Oui";
  if (input === "non") return "Non";
  return value(input);
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

function statutRemplacantLabel(statut?: string) {
  const labels: Record<string, string> = {
    non_installe: "infirmier sans résidence professionnelle titulaire d’une autorisation de remplacement",
  };

  return labels[statut || ""] || value(statut);
}

function lieuRemplacementLabel(lieu?: string) {
  const labels: Record<string, string> = {
    cabinet_remplace: "cabinet de l’infirmier remplacé",
  };

  return labels[lieu || ""] || value(lieu);
}

function modeFacturationLabel(mode?: string) {
  const labels: Record<string, string> = {
    cps_remplacant: "utilisation par le remplaçant de sa propre CPS ou e-CPS avec identification personnelle",
    feuilles_soins: "utilisation de feuilles de soins papier pré-identifiées au nom du remplacé avec identification personnelle du remplaçant",
  };

  return labels[mode || ""] || value(mode);
}

function assietteRedevance(data: Partial<ContractData>) {
  const elements: string[] = [];

  if (data.assietteSoins) elements.push("soins");
  if (data.assietteMajorationsNuit) elements.push("majorations de nuit");
  if (data.assietteDimancheFeries) elements.push("majorations dimanche et jours fériés");
  if (data.assietteFraisKilometriques) elements.push("frais kilométriques");
  if (data.assietteAutres) elements.push(`autres : ${data.assietteAutres}`);

  return elements.length > 0 ? elements.join(", ") : "................................";
}

export function buildContractText(data: Partial<ContractData>) {
  const nonConcurrenceApplicable =
    data.remplacementSuperieurTroisMois === "oui";

  const remplaçantNonInstalle = data.statutRemplacant === "non_installe";

  const redevanceAlerte =
    data.redevancePrevue === "oui" && Number(data.tauxRedevance || 0) > 10
      ? "\nAlerte contractuelle : le taux de redevance dépasse l’usage généralement observé de 5 à 10 %. Les parties déclarent avoir vérifié que ce taux correspond aux frais réels de fonctionnement du cabinet."
      : "";

  const redevanceText =
    data.redevancePrevue === "oui"
      ? `Le taux de redevance est fixé à ${value(data.tauxRedevance)} % et la somme du pourcentage reversé au remplaçant et de la redevance est égale à 100 %.`
      : "En l’absence de redevance, le remplaçant reçoit 100 % des honoraires.";

  const indemnitesKilometriquesText =
    data.fraisKilometriquesExclus === "oui"
      ? "Les indemnités kilométriques sont reversées intégralement au remplaçant et sont exclues de l’assiette de la redevance."
      : "Les parties conviennent expressément d’inclure les indemnités kilométriques dans l’assiette de la redevance.";

  return `
CONTRAT DE REMPLACEMENT ENTRE UN INFIRMIER LIBÉRAL ET UN INFIRMIER REMPLAÇANT

Entre les soussignés :

${value(data.remplaceCivilite)} ${value(data.remplacePrenom)} ${value(data.remplaceNom)}, infirmier diplômé d’État, inscrit au tableau de l’Ordre sous le numéro ${value(data.remplaceNumeroOrdinal)}, numéro RPPS ${value(data.remplaceNumeroRpps)}, exerçant au cabinet professionnel situé ${value(data.remplaceAdresseCabinet)}, ${value(data.remplaceCodePostal)} ${value(data.remplaceVille)}, téléphone ${value(data.remplaceTelephone)}, courriel ${value(data.remplaceEmail)}, rattaché à la CPAM de ${value(data.remplaceCpam)}.

Ci-après désigné « l’infirmier remplacé »,

Et

${value(data.remplacantCivilite)} ${value(data.remplacantPrenom)} ${value(data.remplacantNom)}, infirmier diplômé d’État, inscrit au tableau de l’Ordre sous le numéro ${value(data.remplacantNumeroOrdinal)}, numéro RPPS ${value(data.remplacantNumeroRpps)}, domicilié ${value(data.remplacantAdresse)}, ${value(data.remplacantCodePostal)} ${value(data.remplacantVille)}, téléphone ${value(data.remplacantTelephone)}, courriel ${value(data.remplacantEmail)}, ayant le statut suivant : ${statutRemplacantLabel(data.statutRemplacant)}.

${
  remplaçantNonInstalle
    ? `Le remplaçant est titulaire d’une autorisation de remplacement n° ${value(data.numeroAutorisation)}, délivrée le ${value(data.dateAutorisation)} par ${value(data.conseilAutorisation)}. Il déclare disposer du justificatif d’activité professionnelle de dix-huit mois, soit 2 400 heures, dans les six années précédant sa demande : ${value(data.justificatif2400h)}.`
    : `Le remplaçant déclare disposer d’une installation professionnelle libérale.`
}

Ci-après désigné « l’infirmier remplaçant »,

Il a été convenu ce qui suit.

ARTICLE 1 - OBJET DU CONTRAT

Le présent contrat organise le remplacement personnel, temporaire et ponctuel de l’infirmier remplacé par l’infirmier remplaçant.

Le motif du remplacement est le suivant : ${motifLabel(data)}.

L’infirmier remplacé déclare suspendre personnellement son activité professionnelle pendant les périodes couvertes par le présent contrat.

L’infirmier remplacé ne doit pas exercer simultanément avec son remplaçant sur l’activité objet du remplacement.

Le présent contrat ne constitue ni un contrat de travail, ni un contrat de collaboration. Le remplaçant conserve son indépendance professionnelle et exerce sous sa responsabilité propre.

ARTICLE 2 - DURÉE DU REMPLACEMENT

Le remplacement débutera le ${value(data.dateDebut)} et prendra fin le ${value(data.dateFin)}.

Le remplacement est organisé selon la modalité suivante : ${typeRemplacementLabel(data.typeRemplacement)}.

Remplacement supérieur à 24 heures : ${yesNo(data.remplacementPlus24h)}.
Remplacement répété : ${yesNo(data.remplacementRepete)}.

Jours précis, si applicable :
${value(data.joursPrecis)}

Précisions relatives au planning annexé, si applicable :
${value(data.planningAnnexePrecision)}

La durée du remplacement correspond à l’indisponibilité de l’infirmier remplacé. Toute modification du planning ou prolongation du remplacement devra faire l’objet d’un avenant daté et signé par les deux parties.

ARTICLE 3 - CONDITIONS PRÉALABLES AU REMPLACEMENT

Les parties déclarent ne pas faire l’objet d’une interdiction d’exercice disciplinaire ou pénale incompatible avec le remplacement.

Les parties déclarent ne pas faire l’objet d’une mesure de liquidation judiciaire incompatible avec l’exercice ou le remplacement.

L’infirmier remplacé déclare ne faire l’objet d’aucune mesure de déconventionnement faisant obstacle à son remplacement.

L’infirmier remplaçant déclare ne faire l’objet d’aucune mesure de déconventionnement faisant obstacle au remplacement.

L’infirmier remplaçant atteste ne pas assurer plus de deux remplacements simultanément.

L’infirmier remplaçant atteste disposer d’une assurance responsabilité civile professionnelle valide pour toute la durée du remplacement. L’attestation est annexée au présent contrat.

Les parties déclarent avoir informé les caisses primaires d’assurance maladie concernées du nom du remplaçant, de la durée, des dates du remplacement et des modalités de facturation retenues.

L’autorisation de remplacement doit rester valide pendant toute la durée du remplacement.

ARTICLE 4 - EXERCICE EN GROUPE, INFORMATION ET AGRÉMENT

L’infirmier remplacé exerce-t-il en groupe : ${yesNo(data.exerciceEnGroupe)}.

Type d’exercice en groupe, le cas échéant :
${value(data.typeGroupe)}

Clause d’agrément prévue par les statuts ou contrats du groupe :
${value(data.clauseAgrement)}

Agrément du remplaçant obtenu, le cas échéant :
${value(data.agrementObtenu)}

Information des confrères ou associés d’exercice :
${value(data.confreresInformes)}

Lorsque l’exercice en groupe impose un agrément, l’infirmier remplacé s’engage à obtenir cet agrément avant le début du remplacement. Même en l’absence d’agrément obligatoire, les parties rappellent l’importance de l’information préalable des confrères au titre de la bonne confraternité.

ARTICLE 5 - LIEU D’EXERCICE ET MOYENS MIS À DISPOSITION

Le remplacement s’effectuera au lieu suivant :
${value(data.adresseExercice)}

Modalité de lieu retenue :
${lieuRemplacementLabel(data.lieuRemplacement)}

Lorsque le remplaçant est sans résidence professionnelle, le remplacement est réalisé au lieu d’exercice professionnel de l’infirmier remplacé.

L’infirmier remplacé met à disposition du remplaçant les locaux, installations, équipements et matériels nécessaires à la continuité des soins.

Matériel mis à disposition :
${value(data.materielMisADisposition)}

Logiciel professionnel utilisé, le cas échéant :
${value(data.logicielProfessionnel)}

Secrétariat ou organisation administrative, le cas échéant :
${value(data.secretariat)}

Cette mise à disposition n’a pas la nature d’un bail, d’une sous-location, ni d’une mise à disposition donnant lieu à indemnité d’occupation distincte.

ARTICLE 6 - ÉTAT DES LIEUX, INVENTAIRE ET RESTITUTION

État des lieux contradictoire au début du remplacement :
${yesNo(data.etatLieuxDebut)}

État des lieux contradictoire à la fin du remplacement :
${yesNo(data.etatLieuxFin)}

Inventaire du matériel annexé :
${yesNo(data.inventaireMateriel)}

Le remplaçant utilise les locaux, installations et matériels avec prudence, diligence et exclusivement à des fins professionnelles.

Le remplaçant s’interdit toute modification des lieux, de leur destination ou des équipements sans accord écrit du remplacé.

Au terme du contrat, le remplaçant restitue les locaux, le matériel et le mobilier dans l’état où ils se trouvaient au début du remplacement, sous réserve de l’usure normale liée à l’usage professionnel.

ARTICLE 7 - CONDITIONS D’EXERCICE DU REMPLAÇANT

L’infirmier remplaçant exerce sous sa responsabilité personnelle.

Il s’engage à respecter les règles professionnelles, les règles déontologiques, le secret professionnel, les règles de sécurité des soins, la continuité des soins et les obligations liées à son statut.

Il s’engage à agir dans l’intérêt des patients, à entretenir des rapports de bonne confraternité avec les autres infirmiers du cabinet et à vérifier la conformité des actes réalisés et des cotations appliquées.

ARTICLE 8 - CPS, FEUILLES DE SOINS ET FACTURATION

Le mode de facturation retenu est le suivant :
${modeFacturationLabel(data.modeFacturation)}

L’infirmier remplaçant est personnellement identifié pour les actes réalisés pendant le remplacement.

L’infirmier remplaçant utilise sa propre CPS ou e-CPS lorsque ce mode de facturation est retenu.

Lorsque des feuilles de soins papier pré-identifiées au nom de l’infirmier remplacé sont utilisées, le remplaçant doit y faire apparaître visiblement son nom, son prénom, sa qualité d’infirmier remplaçant, ses numéros ordinal et RPPS, ainsi que sa signature.

La CPS personnelle de l’infirmier remplacé ne doit jamais être utilisée directement par le remplaçant.

Les parties reconnaissent que les modalités de facturation doivent être cohérentes avec le statut du remplaçant, l’information des CPAM concernées et l’identification personnelle du professionnel ayant réalisé les actes.

ARTICLE 9 - HONORAIRES, RÉTROCESSION, REDEVANCE ET ASSIETTE

L’infirmier remplaçant remettra les recettes ou les éléments nécessaires au calcul de la rétrocession à l’infirmier remplacé au plus tard le ${value(data.dateRemiseRecettes)}.

Le remplaçant percevra ${value(data.pourcentageReverse)} % des honoraires encaissés correspondant aux soins réalisés pendant la période de remplacement.

Le reversement interviendra dans un délai de ${value(data.delaiReversement)} mois.

Pour les honoraires perçus en tiers payant, le remplaçant percevra ${value(data.pourcentageTiersPayant)} % des sommes correspondant aux soins réalisés pendant la période de remplacement.

Le reversement des sommes issues du tiers payant interviendra dans un délai de ${value(data.delaiReversementTiersPayant)} mois.

Modalité de paiement retenue :
${value(data.modalitePaiement)}

Redevance prévue :
${yesNo(data.redevancePrevue)}

Taux de redevance :
${value(data.tauxRedevance)} %

Assiette de la redevance :
${assietteRedevance(data)}

Frais kilométriques exclus de l’assiette de la redevance :
${yesNo(data.fraisKilometriquesExclus)}
${redevanceText}
${indemnitesKilometriquesText}
${redevanceAlerte}

L’infirmier remplacé s’engage à fournir au remplaçant les documents permettant de vérifier la concordance entre les actes facturés et la rémunération due.

En cas de décision définitive de répétition d’un indu par un organisme d’assurance maladie portant sur des actes effectués par le remplaçant et qui lui sont imputables, le remplaçant rembourse au remplacé les sommes concernées sur présentation des justificatifs correspondants.

ARTICLE 10 - OBLIGATIONS FISCALES ET SOCIALES

Chaque partie procède de manière indépendante à ses déclarations fiscales et sociales et supporte personnellement les charges fiscales et sociales afférentes à son activité dans le cadre du présent remplacement.

ARTICLE 11 - CARACTÈRE PERSONNEL ET INCESSIBILITÉ

Le présent contrat est conclu en considération de la personne de chacun des cocontractants. Il ne peut être cédé, transféré ou confié à un tiers.

ARTICLE 12 - OBLIGATIONS DE L’INFIRMIER REMPLACÉ

L’infirmier remplacé s’engage à suspendre son activité professionnelle pendant les périodes de remplacement.

Il s’engage à transmettre au remplaçant les informations nécessaires à la continuité des soins, dans le respect du secret professionnel.

Il s’engage à porter à la connaissance du remplaçant les dispositions de la Convention nationale des infirmiers et les obligations qui s’imposent dans ce cadre.

Il s’engage à informer les organismes d’assurance maladie dans les conditions applicables.

Il s’engage à fournir les documents nécessaires à la vérification des actes facturés, des honoraires encaissés et des sommes dues au remplaçant.

ARTICLE 13 - RÉSILIATION

Le présent contrat prendra fin automatiquement au terme fixé à l’article 2.

Il sera résilié d’un commun accord entre les parties, sous réserve d’un préavis de ${value(data.preavisCommunAccord)} jour(s).

En cas de manquement par l’une des parties à ses obligations contractuelles ou déontologiques, l’autre partie lui adresse une notification écrite par lettre recommandée avec accusé de réception.

Cette notification précise la nature du manquement constaté, les mesures attendues afin d’y remédier et le délai de préavis de ${value(data.preavisManquement)} jours.

Si la partie destinataire remédie au manquement selon les modalités et dans le délai indiqués dans la notification, la résiliation ne prend pas effet.

À défaut de régularisation dans ce délai, la résiliation prend effet au terme du préavis indiqué.

Le contrat est résilié de plein droit, sans préavis :

- en cas de retrait ou d’expiration de l’autorisation de remplacement
- en cas de sanction disciplinaire comportant une interdiction d’exercice égale ou supérieure à trois mois prononcée à l’encontre de l’une des parties
- lorsque l’indisponibilité temporaire de l’infirmier remplacé devient définitive
- lorsqu’un événement rend juridiquement impossible la poursuite du remplacement

Au terme du présent contrat, l’infirmier remplaçant cesse l’ensemble de ses activités de remplacement auprès des patients de l’infirmier remplacé et lui transmet, dans le respect du secret professionnel, l’ensemble des informations nécessaires à la continuité des soins.

ARTICLE 14 - RENOUVELLEMENT

Toute prolongation du remplacement nécessitera un avenant écrit, daté et signé par les deux parties.

Cet avenant précisera la nouvelle période concernée, le motif de prolongation et les adaptations nécessaires aux modalités d’organisation du remplacement.

ARTICLE 15 - LOYAUTÉ, ABSENCE DE CONCURRENCE DÉLOYALE ET NON-CONCURRENCE

${
  nonConcurrenceApplicable
    ? `Le remplacement étant supérieur à trois mois, consécutifs ou non, les parties examinent les conséquences prévues à l’article R. 4312-87 du Code de la santé publique.

Périmètre retenu :
${value(data.clauseNonConcurrence)}

Rayon kilométrique, si retenu :
${value(data.rayonKm)} km

Communes concernées, si retenues :
${value(data.communesConcernees)}

Durée retenue :
${value(data.dureeNonConcurrence)}

Accord entre les parties notifié au Conseil de l’Ordre :
${value(data.accordOrdreNonConcurrence)}

Cette clause doit rester limitée dans le temps, dans l’espace et proportionnée à l’objet du contrat.`
    : `Les parties déclarent que le remplacement n’excède pas trois mois, consécutifs ou non. Aucune clause de non-réinstallation spécifique n’est retenue dans le présent contrat.`
}

Lorsque le remplaçant dispose déjà d’une installation professionnelle, les parties privilégient une obligation de loyauté et d’absence de concurrence déloyale. Le remplaçant s’interdit tout démarchage de la patientèle du remplacé, toute utilisation irrégulière de fichiers ou toute manœuvre contraire à la confraternité.

À l’issue de sa mission, le remplaçant abandonne l’ensemble de ses activités de remplacement auprès de la patientèle de l’infirmier remplacé.

ARTICLE 16 - RÈGLEMENT DES DIFFÉRENDS

En cas de difficulté relative à la validité, à l’interprétation, à l’exécution, à la résiliation ou à la résolution du présent contrat, les parties s’engagent, préalablement à toute action contentieuse, à soumettre leur différend à une tentative de conciliation.

Cette conciliation sera confiée, au besoin, au conseil départemental ou interdépartemental de l’Ordre des infirmiers compétent, conformément à l’article R. 4312-25 du Code de la santé publique.

ARTICLE 17 - ABSENCE DE CONTRE-LETTRE

Les parties déclarent qu’aucune contre-lettre ni aucun accord distinct ne modifie les stipulations du présent contrat. Tout avenant devra être établi par écrit, daté et signé par les deux parties, puis transmis au conseil de l’Ordre compétent.

ARTICLE 18 - TRANSMISSION AU CONSEIL DE L’ORDRE

Chacune des parties communique le présent contrat au conseil départemental ou interdépartemental de l’Ordre des infirmiers dont elle relève dans un délai d’un mois à compter de sa signature. Les avenants et tout document modifiant le contrat sont transmis dans les mêmes conditions.

ARTICLE 19 - RAPPEL DES ARTICLES R. 4312-83 À R. 4312-87 DU CODE DE LA SANTÉ PUBLIQUE

Les parties déclarent avoir pris connaissance des principales dispositions réglementaires relatives au remplacement infirmier, notamment les articles R. 4312-83 à R. 4312-87 du Code de la santé publique.

Elles rappellent en particulier que le remplacement est temporaire, que le remplaçant ne remplace pas plus de deux infirmiers simultanément, que le remplacé s’abstient de toute activité infirmière pendant la période de remplacement, que la durée du remplacement correspond à l’indisponibilité, et qu’un contrat écrit est établi au-delà de vingt-quatre heures ou en cas de remplacement répété.

ARTICLE 20 - SIGNATURES

Fait à ${value(data.faitA)}, le ${value(data.faitLe)}.

Trois exemplaires au minimum sont requis.

Le présent contrat est établi en ${value(data.nombreExemplaires)} exemplaires, au minimum trois.

Les signatures des parties figurent ci-après.

Signature de l’infirmier remplacé :

Signature de l’infirmier remplaçant :
`;
}