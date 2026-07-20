import { ContractData } from "./schema";

function value(input: unknown) {
  if (input === undefined || input === null || input === "") {
    return "................................";
  }

  return String(input);
}

function isEmpty(input: unknown) {
  return input === undefined || input === null || input === "";
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

export function yesNoLabel(input: unknown, emptyLabel = "Non concerné") {
  if (input === "oui" || input === true) {
    return "Oui";
  }

  if (input === "non" || input === false) {
    return "Non";
  }

  if (isEmpty(input)) {
    return emptyLabel;
  }

  return String(input);
}

function yesNo(input: unknown) {
  return yesNoLabel(input);
}

export function formatDurationLabel(duration: number) {
  if (!Number.isFinite(duration)) {
    return "durée à compléter";
  }

  const safeDuration = Math.max(0, Math.trunc(duration));

  return `${safeDuration} ${safeDuration === 1 ? "jour" : "jours"}`;
}

function durationValue(duration: unknown) {
  if (isEmpty(duration)) {
    return value(duration);
  }

  const parsed = Number(duration);

  if (!Number.isFinite(parsed)) {
    return value(duration);
  }

  return formatDurationLabel(parsed);
}

export function motifLabel(data: Partial<ContractData>) {
  const labels: Record<string, string> = {
    conge_annuel: "Congé annuel",
    conge_personnel: "Congé personnel",
    conge_maladie: "Congé maladie",
    conge_maternite: "Congé maternité",
    conge_paternite: "Congé paternité",
    formation_professionnelle: "Formation professionnelle",
    formation: "Formation professionnelle",
    mandat_ordinal: "Mandat ordinal",
    mandat_syndical: "Mandat syndical",
    motif_familial: "Motif familial",
    autre: value(data.motifAutre),
  };

  return labels[data.motif || ""] || value(data.motif);
}

function typeRemplacementLabel(type?: string) {
  const labels: Record<string, string> = {
    continu: "remplacement continu",
    jours_precis: "remplacement sur des jours précis",
    planning_annexe: "remplacement selon un planning annexé au présent contrat",
  };

  return labels[type || ""] || value(type);
}

function statutRemplacantLabel(
  statut: string | undefined,
  grammar: PersonGrammar
) {
  const labels: Record<string, string> = {
    non_installe: `${grammar.professionCourte} sans résidence professionnelle titulaire d’une autorisation de remplacement`,
  };

  return labels[statut || ""] || value(statut);
}

function lieuRemplacementLabel(
  lieu: string | undefined,
  remplaceGrammar: PersonGrammar
) {
  const labels: Record<string, string> = {
    cabinet_remplace: `cabinet de l’${remplaceGrammar.roleRemplace}`,
  };

  return labels[lieu || ""] || value(lieu);
}

export function modeFacturationLabel(mode?: string) {
  const labels: Record<string, string> = {
    cps_remplacant: "CPS ou e-CPS personnelle du remplaçant",
    feuille_soins:
      "Feuilles de soins papier avec identification personnelle du remplaçant",
    feuilles_soins:
      "Feuilles de soins papier avec identification personnelle du remplaçant",
  };

  return labels[mode || ""] || value(mode);
}

function assietteRedevance(data: Partial<ContractData>) {
  const elements: string[] = [];

  if (data.assietteSoins) {
    elements.push("soins");
  }

  if (data.assietteMajorationsNuit) {
    elements.push("majorations de nuit");
  }

  if (data.assietteDimancheFeries) {
    elements.push("majorations des dimanches et jours fériés");
  }

  if (data.assietteFraisKilometriques) {
    elements.push("indemnités kilométriques");
  }

  if (data.assietteAutres) {
    elements.push(`autres éléments : ${data.assietteAutres}`);
  }

  return elements.length > 0
    ? elements.join(", ")
    : "................................";
}

function typeGroupeLabel(type?: string) {
  const labels: Record<string, string> = {
    societe: "Société",
    cabinet_groupe: "Cabinet de groupe",
    exercice_commun: "Exercice commun",
    cocontractants: "Cocontractants",
    autre: "Autre",
  };

  if (!type) {
    return "Non concerné";
  }

  return labels[type] || value(type);
}

function clauseAgrementLabel(input?: string) {
  const labels: Record<string, string> = {
    oui: "Oui",
    non: "Non",
    ne_sait_pas: "Ne sait pas",
  };

  if (!input) {
    return "Non concerné";
  }

  return labels[input] || value(input);
}

type PersonGrammar = {
  profession: string;
  professionCourte: string;
  inscrit: string;
  domicilie: string;
  remplace: string;
  remplacant: string;
  designe: string;
  roleRemplace: string;
  roleRemplacant: string;
  articleRoleRemplace: string;
  articleRoleRemplacant: string;
  pronomSujet: string;
  possessif: string;
  identifie: string;
};

function grammarForCivilite(civilite?: string): PersonGrammar {
  if (normalizeCivilite(civilite) === "Mme") {
    return {
      profession: "infirmière diplômée d’État",
      professionCourte: "infirmière",
      inscrit: "inscrite",
      domicilie: "domiciliée",
      remplace: "remplacée",
      remplacant: "remplaçante",
      designe: "désignée",
      roleRemplace: "infirmière remplacée",
      roleRemplacant: "infirmière remplaçante",
      articleRoleRemplace: "l’infirmière remplacée",
      articleRoleRemplacant: "l’infirmière remplaçante",
      pronomSujet: "Elle",
      possessif: "sa",
      identifie: "identifiée",
    };
  }

  return {
    profession: "infirmier diplômé d’État",
    professionCourte: "infirmier",
    inscrit: "inscrit",
    domicilie: "domicilié",
    remplace: "remplacé",
    remplacant: "remplaçant",
    designe: "désigné",
    roleRemplace: "infirmier remplacé",
    roleRemplacant: "infirmier remplaçant",
    articleRoleRemplace: "l’infirmier remplacé",
    articleRoleRemplacant: "l’infirmier remplaçant",
    pronomSujet: "Il",
    possessif: "son",
    identifie: "identifié",
  };
}

function buildSelectedAnnexes(data: Partial<ContractData>) {
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
    const precision = data.annexeAutreDocumentPrecision
      ? ` : ${data.annexeAutreDocumentPrecision}`
      : "";

    annexes.push(`Autre document${precision}`);
  }

  return annexes;
}

function authorizationDatesCompatible(data: Partial<ContractData>) {
  if (
    isEmpty(data.dateAutorisation) ||
    isEmpty(data.dateDebut) ||
    isEmpty(data.dateFin) ||
    isEmpty(data.dateFinValiditeAutorisation)
  ) {
    return false;
  }

  const dateAutorisation = String(data.dateAutorisation);
  const dateDebut = String(data.dateDebut);
  const dateFin = String(data.dateFin);
  const dateFinValidite = String(data.dateFinValiditeAutorisation);

  return dateAutorisation <= dateDebut && dateFin <= dateFinValidite;
}

function buildExemplairesText(input: unknown) {
  const parsed = Number(input);
  const nombre = Number.isFinite(parsed) && parsed >= 3 ? Math.trunc(parsed) : 3;

  if (nombre === 3) {
    return "Le présent contrat est établi en trois exemplaires originaux, dont un pour chacune des parties et un destiné au conseil départemental ou interdépartemental de l’Ordre compétent.";
  }

  return `Le présent contrat est établi en ${nombre} exemplaires originaux. Un exemplaire est remis à chacune des parties et un exemplaire est destiné au conseil départemental ou interdépartemental de l’Ordre compétent.`;
}

function buildNonConcurrenceText(
  data: Partial<ContractData>,
  remplacantGrammar: PersonGrammar,
  remplaceGrammar: PersonGrammar
) {
  const nonConcurrenceApplicable =
    data.remplacementSuperieurTroisMois === "oui";

 if (!nonConcurrenceApplicable) {
  return `La durée totale du remplacement n’excède pas trois mois, consécutifs ou non. Aucune restriction spécifique de réinstallation n’est stipulée au titre de l’article R. 4312-87 du Code de la santé publique.

Les obligations de loyauté, de confraternité et d’absence de détournement de patientèle demeurent applicables à ${remplacantGrammar.articleRoleRemplacant}.`;
}

  const perimetreElements: string[] = [];

  if (!isEmpty(data.rayonKm)) {
    perimetreElements.push(
      `un rayon de ${value(data.rayonKm)} kilomètres autour du cabinet de ${remplaceGrammar.articleRoleRemplace}`
    );
  }

  if (!isEmpty(data.communesConcernees)) {
    perimetreElements.push(
      `les communes suivantes : ${value(data.communesConcernees)}`
    );
  }

  if (!isEmpty(data.clauseNonConcurrence)) {
    perimetreElements.push(value(data.clauseNonConcurrence));
  }

  const perimetre =
    perimetreElements.length > 0
      ? perimetreElements.join(" et ")
      : "le périmètre à compléter par les parties";

  const accordNotifie =
  data.accordOrdreNonConcurrence === "oui";

  const accordText = accordNotifie
    ? "Les parties déclarent qu’un accord dérogatoire a été conclu et notifié au conseil de l’Ordre compétent."
    : "Aucun accord dérogatoire notifié au conseil de l’Ordre compétent n’est déclaré.";

  return `La durée totale du remplacement excède trois mois, consécutifs ou non.

Conformément à l’article R. 4312-87 du Code de la santé publique, ${remplacantGrammar.articleRoleRemplacant} ne devra pas, pendant une durée de deux ans, s’installer dans un cabinet où cette dernière ou ce dernier entrerait en concurrence directe ${remplaceGrammar.articleRoleRemplace}, sauf accord entre les parties notifié au conseil de l’Ordre compétent.

Le périmètre retenu est le suivant : ${perimetre}.

${accordText}`;
}

export function buildContractText(data: Partial<ContractData>) {
  const remplacantNonInstalle = data.statutRemplacant === "non_installe";
  const remplaceGrammar = grammarForCivilite(data.remplaceCivilite);
  const remplacantGrammar = grammarForCivilite(data.remplacantCivilite);
  const exerciceEnGroupe = data.exerciceEnGroupe === "oui";
  const annexes = buildSelectedAnnexes(data);
  const autorisationCompatible = authorizationDatesCompatible(data);

  const redevanceAlerte =
    data.redevancePrevue === "oui" && Number(data.tauxRedevance || 0) > 10
      ? "\nAlerte contractuelle : le taux de redevance dépasse 10 %. Les parties déclarent avoir vérifié que ce taux correspond aux frais et services effectivement mis à disposition dans le cadre du remplacement."
      : "";

  const redevanceText =
    data.redevancePrevue === "oui"
      ? `Le taux de redevance est fixé à ${value(data.tauxRedevance)} %. Le pourcentage reversé au remplaçant et le taux de redevance représentent ensemble 100 % des honoraires concernés.`
      : "Aucune redevance n’est prévue. Le remplaçant reçoit 100 % des honoraires correspondant aux soins qu’il a réalisés.";

  const indemnitesKilometriquesText =
    data.fraisKilometriquesExclus === "oui"
      ? "Les indemnités kilométriques sont reversées intégralement au remplaçant et sont exclues de l’assiette de la redevance."
      : "Les parties conviennent expressément d’inclure les indemnités kilométriques dans l’assiette de la redevance.";

  const rcpAnnexeText = data.annexeAttestationRcProf
    ? " Une copie de l’attestation est annexée au présent contrat."
    : "";

  const autorisationCoverageText = autorisationCompatible
    ? " Cette autorisation couvre l’intégralité de la période prévue au présent contrat."
    : "";

  const justificatifAnnexeText = data.annexeJustificatif2400h
    ? " Une copie du justificatif est annexée au présent contrat."
    : "";

const patientsInformationText = data.patientsInformes
  ? `Les parties confirment que les patients seront informés dès que possible de la présence, de l’identité et de la qualité de ${remplacantGrammar.articleRoleRemplacant}.`
  : `L’information des patients sur la présence, l’identité et la qualité de ${remplacantGrammar.articleRoleRemplacant} devra être confirmée avant la signature du contrat.`;
  
    const groupeText = exerciceEnGroupe
    ? `
Type d’exercice en groupe :
${typeGroupeLabel(data.typeGroupe)}

Clause d’agrément prévue par les statuts, contrats ou conventions :
${clauseAgrementLabel(data.clauseAgrement)}

Agrément du remplaçant obtenu, le cas échéant :
${yesNoLabel(data.agrementObtenu)}

Information des confrères, associés ou cocontractants :
${yesNoLabel(data.confreresInformes)}

Lorsque les statuts, contrats ou conventions organisant l’exercice en groupe l’exigent, ${remplaceGrammar.articleRoleRemplace} confirme avoir informé ses associés ou cocontractants et leur avoir communiqué une copie du présent contrat : ${yesNoLabel(data.associesInformes)}.

Lorsque l’exercice en groupe impose un agrément, cet agrément doit être obtenu avant le début du remplacement.`
    : "L’exercice en groupe n’est pas concerné par le présent contrat.";

  const nonConcurrenceText = buildNonConcurrenceText(
    data,
    remplacantGrammar,
    remplaceGrammar
  );

  const exemplairesText = buildExemplairesText(data.nombreExemplaires);

  const signatureRemplace = `Signature de ${remplaceGrammar.articleRoleRemplace} :`;
  const signatureRemplacant = `Signature de ${remplacantGrammar.articleRoleRemplacant} :`;

  return `
CONTRAT DE REMPLACEMENT ENTRE UN INFIRMIER LIBÉRAL ET UN INFIRMIER TITULAIRE D’UNE AUTORISATION DE REMPLACEMENT

Contrat rédigé à partir du modèle publié par le Conseil national de l’Ordre des infirmiers, mis à jour le 15 novembre 2023.

La génération du présent document ne vaut pas validation individuelle par le conseil de l’Ordre compétent.

Entre les soussignés :

${value(data.remplaceCivilite)} ${value(data.remplacePrenom)} ${value(data.remplaceNom)}, ${remplaceGrammar.profession}, ${remplaceGrammar.inscrit} au tableau de l’Ordre sous le numéro ${value(data.remplaceNumeroOrdinal)}, numéro RPPS ${value(data.remplaceNumeroRpps)}, exerçant au cabinet professionnel situé ${value(data.remplaceAdresseCabinet)}, ${value(data.remplaceCodePostal)} ${value(data.remplaceVille)}, téléphone ${value(data.remplaceTelephone)}, courriel ${value(data.remplaceEmail)}, rattaché à la CPAM de ${value(data.remplaceCpam)}.

Ci-après ${remplaceGrammar.designe} « ${remplaceGrammar.articleRoleRemplace} »,

Et

${value(data.remplacantCivilite)} ${value(data.remplacantPrenom)} ${value(data.remplacantNom)}, ${remplacantGrammar.profession}, ${remplacantGrammar.inscrit} au tableau de l’Ordre sous le numéro ${value(data.remplacantNumeroOrdinal)}, numéro RPPS ${value(data.remplacantNumeroRpps)}, ${remplacantGrammar.domicilie} ${value(data.remplacantAdresse)}, ${value(data.remplacantCodePostal)} ${value(data.remplacantVille)}, téléphone ${value(data.remplacantTelephone)}, courriel ${value(data.remplacantEmail)}, ayant le statut suivant : ${statutRemplacantLabel(data.statutRemplacant, remplacantGrammar)}.

${
  remplacantNonInstalle
    ? `L’autorisation de remplacement n° ${value(data.numeroAutorisation)} a été délivrée le ${value(data.dateAutorisation)} par ${value(data.conseilAutorisation)} et demeure valable jusqu’au ${value(data.dateFinValiditeAutorisation)}.${autorisationCoverageText} ${remplacantGrammar.pronomSujet} déclare disposer du justificatif d’activité professionnelle de dix-huit mois, soit 2 400 heures, dans les six années précédant ${remplacantGrammar.possessif} demande : ${value(data.justificatif2400h)}.${justificatifAnnexeText}`
    : "Le statut renseigné ne correspond pas au modèle de contrat destiné à un infirmier titulaire d’une autorisation de remplacement sans résidence professionnelle."
}

Ci-après ${remplacantGrammar.designe} « ${remplacantGrammar.articleRoleRemplacant} »,

Il a été convenu ce qui suit.

ARTICLE 1 - OBJET DU CONTRAT

Le présent contrat organise le remplacement personnel, temporaire et ponctuel de ${remplaceGrammar.articleRoleRemplace} par ${remplacantGrammar.articleRoleRemplacant}.

Le motif du remplacement est le suivant : ${motifLabel(data)}.

Pendant les périodes couvertes par le présent contrat, ${remplaceGrammar.articleRoleRemplace} s’abstient de toute activité infirmière objet du remplacement. Cette obligation ne fait pas obstacle au suivi d’une formation professionnelle, à l’assistance à une personne en péril ni à la participation à un dispositif de secours dans les conditions prévues par les textes applicables.

${remplaceGrammar.articleRoleRemplace.charAt(0).toUpperCase()}${remplaceGrammar.articleRoleRemplace.slice(1)} ne doit pas exercer simultanément avec ${remplacantGrammar.articleRoleRemplacant} sur l’activité objet du remplacement.

Le présent contrat ne constitue ni un contrat de travail ni un contrat de collaboration. ${remplacantGrammar.articleRoleRemplacant.charAt(0).toUpperCase()}${remplacantGrammar.articleRoleRemplacant.slice(1)} conserve son indépendance professionnelle et exerce sous sa responsabilité propre.

${patientsInformationText}

ARTICLE 2 - DURÉE DU REMPLACEMENT

Le remplacement débutera le ${value(data.dateDebut)} et prendra fin le ${value(data.dateFin)}.

Le remplacement est organisé selon la modalité suivante : ${typeRemplacementLabel(data.typeRemplacement)}.

Remplacement supérieur à vingt-quatre heures : ${yesNo(data.remplacementPlus24h)}.

Remplacement répété : ${yesNo(data.remplacementRepete)}.

Jours précis, le cas échéant :
${data.typeRemplacement === "jours_precis" ? value(data.joursPrecis) : "Non concerné"}

Précisions relatives au planning annexé, le cas échéant :
${data.typeRemplacement === "planning_annexe" ? value(data.planningAnnexePrecision) : "Non concerné"}

La durée du remplacement correspond à l’indisponibilité de ${remplaceGrammar.articleRoleRemplace}. Toute modification du planning ou toute prolongation du remplacement devra faire l’objet d’un avenant écrit, daté et signé par les deux parties.

ARTICLE 3 - CONDITIONS PRÉALABLES AU REMPLACEMENT

Les parties déclarent ne pas faire l’objet d’une interdiction d’exercice disciplinaire ou pénale incompatible avec le remplacement.

Les parties déclarent ne pas faire l’objet d’une mesure de liquidation judiciaire incompatible avec l’exercice ou le remplacement.

${remplaceGrammar.articleRoleRemplace.charAt(0).toUpperCase()}${remplaceGrammar.articleRoleRemplace.slice(1)} déclare ne faire l’objet d’aucune mesure de déconventionnement faisant obstacle à son remplacement.

${remplacantGrammar.articleRoleRemplacant.charAt(0).toUpperCase()}${remplacantGrammar.articleRoleRemplacant.slice(1)} déclare ne faire l’objet d’aucune mesure de déconventionnement faisant obstacle au remplacement.

${remplacantGrammar.articleRoleRemplacant.charAt(0).toUpperCase()}${remplacantGrammar.articleRoleRemplacant.slice(1)} atteste ne pas assurer plus de deux remplacements simultanément.

${remplacantGrammar.articleRoleRemplacant.charAt(0).toUpperCase()}${remplacantGrammar.articleRoleRemplacant.slice(1)} atteste disposer d’une assurance de responsabilité civile professionnelle valide pendant toute la durée du remplacement.${rcpAnnexeText}

Les parties déclarent avoir informé les caisses primaires d’assurance maladie concernées du nom du remplaçant, de la durée et des dates du remplacement, ainsi que des modalités de facturation retenues.

L’autorisation de remplacement doit rester valide pendant toute la durée du remplacement.

ARTICLE 4 - EXERCICE EN GROUPE, INFORMATION ET AGRÉMENT

${groupeText}

ARTICLE 5 - LIEU D’EXERCICE ET MOYENS MIS À DISPOSITION

Le remplacement s’effectuera à l’adresse suivante :
${value(data.adresseExercice)}

Modalité de lieu retenue :
${lieuRemplacementLabel(data.lieuRemplacement, remplaceGrammar)}

Le remplacement est réalisé au lieu d’exercice professionnel de ${remplaceGrammar.articleRoleRemplace}.

${remplaceGrammar.articleRoleRemplace.charAt(0).toUpperCase()}${remplaceGrammar.articleRoleRemplace.slice(1)} met à disposition de ${remplacantGrammar.articleRoleRemplacant} les locaux, installations, équipements et matériels nécessaires à la continuité des soins.

Matériel mis à disposition :
${value(data.materielMisADisposition)}

Logiciel professionnel utilisé, le cas échéant :
${value(data.logicielProfessionnel)}

Secrétariat ou organisation administrative, le cas échéant :
${value(data.secretariat)}

Cette mise à disposition ne constitue ni un bail, ni une sous-location, ni une convention donnant lieu à une indemnité d’occupation distincte.

ARTICLE 6 - ÉTAT DES LIEUX, INVENTAIRE ET RESTITUTION

État des lieux contradictoire au début du remplacement :
${yesNo(data.etatLieuxDebut)}

État des lieux contradictoire à la fin du remplacement :
${yesNo(data.etatLieuxFin)}

Inventaire du matériel annexé :
${yesNo(data.inventaireMateriel)}

${remplacantGrammar.articleRoleRemplacant.charAt(0).toUpperCase()}${remplacantGrammar.articleRoleRemplacant.slice(1)} utilise les locaux, installations et matériels avec prudence, diligence et exclusivement à des fins professionnelles.

${remplacantGrammar.pronomSujet} s’interdit toute modification des lieux, de leur destination ou des équipements sans accord écrit de ${remplaceGrammar.articleRoleRemplace}.

Au terme du contrat, ${remplacantGrammar.articleRoleRemplacant} restitue les locaux, le matériel et le mobilier dans l’état où ils se trouvaient au début du remplacement, sous réserve de l’usure normale liée à leur usage professionnel.

ARTICLE 7 - CONDITIONS D’EXERCICE DU REMPLAÇANT

${remplacantGrammar.articleRoleRemplacant.charAt(0).toUpperCase()}${remplacantGrammar.articleRoleRemplacant.slice(1)} exerce sous sa responsabilité personnelle.

${remplacantGrammar.pronomSujet} s’engage à respecter les règles professionnelles et déontologiques, le secret professionnel, la sécurité des soins, la continuité des soins et les obligations liées à son statut.

${remplacantGrammar.pronomSujet} s’engage à agir dans l’intérêt des patients, à entretenir des rapports de bonne confraternité avec les autres infirmiers du cabinet et à vérifier la conformité des actes réalisés et des cotations appliquées.

ARTICLE 8 - CPS, FEUILLES DE SOINS ET FACTURATION

Le mode de facturation retenu est le suivant :
${modeFacturationLabel(data.modeFacturation)}

${remplacantGrammar.articleRoleRemplacant.charAt(0).toUpperCase()}${remplacantGrammar.articleRoleRemplacant.slice(1)} est personnellement ${remplacantGrammar.identifie} pour les actes réalisés pendant le remplacement.

${remplacantGrammar.pronomSujet} utilise sa propre CPS ou e-CPS lorsque ce mode de facturation est retenu.

Lorsque des feuilles de soins papier pré-identifiées au nom de ${remplaceGrammar.articleRoleRemplace} sont utilisées, ${remplacantGrammar.articleRoleRemplacant} doit y faire apparaître visiblement son nom, son prénom, sa qualité d'${remplacantGrammar.roleRemplacant}, ses numéros ordinal et RPPS, ainsi que sa signature.

La CPS personnelle de ${remplaceGrammar.articleRoleRemplace} ne doit jamais être utilisée directement par ${remplacantGrammar.articleRoleRemplacant}.

Les parties reconnaissent que les modalités de facturation doivent rester cohérentes avec le statut du remplaçant, l’information des CPAM concernées et l’identification personnelle du professionnel ayant réalisé les actes.

ARTICLE 9 - HONORAIRES, RÉTROCESSION, REDEVANCE ET ASSIETTE

${remplacantGrammar.articleRoleRemplacant.charAt(0).toUpperCase()}${remplacantGrammar.articleRoleRemplacant.slice(1)} remettra les recettes ou les éléments nécessaires au calcul de la rétrocession à ${remplaceGrammar.articleRoleRemplace} au plus tard le ${value(data.dateRemiseRecettes)}.

${remplacantGrammar.pronomSujet} percevra ${value(data.pourcentageReverse)} % des honoraires encaissés correspondant aux soins réalisés pendant la période de remplacement.

Le reversement interviendra dans un délai de ${durationValue(data.delaiReversement)}.

Pour les honoraires perçus en tiers payant, ${remplacantGrammar.articleRoleRemplacant} percevra ${value(data.pourcentageTiersPayant)} % des sommes correspondant aux soins réalisés pendant la période de remplacement.

Le reversement des sommes issues du tiers payant interviendra dans un délai de ${durationValue(data.delaiReversementTiersPayant)}.

Modalité de paiement retenue :
${value(data.modalitePaiement)}

Redevance prévue :
${yesNoLabel(data.redevancePrevue)}

${
  data.redevancePrevue === "oui"
    ? `Taux de redevance :
${value(data.tauxRedevance)} %

Assiette de la redevance :
${assietteRedevance(data)}

Frais kilométriques exclus de l’assiette de la redevance :
${yesNoLabel(data.fraisKilometriquesExclus)}`
    : "Taux et assiette de la redevance : non concernés."
}

${redevanceText}

${data.redevancePrevue === "oui" ? indemnitesKilometriquesText : ""}

${redevanceAlerte}

${remplaceGrammar.articleRoleRemplace.charAt(0).toUpperCase()}${remplaceGrammar.articleRoleRemplace.slice(1)} s’engage à fournir à ${remplacantGrammar.articleRoleRemplacant} les documents permettant de vérifier la concordance entre les actes facturés et la rémunération due.

En cas de décision définitive de répétition d’un indu par un organisme d’assurance maladie portant sur des actes effectués par ${remplacantGrammar.articleRoleRemplacant} et qui lui sont imputables, ${remplacantGrammar.pronomSujet} rembourse à ${remplaceGrammar.articleRoleRemplace} les sommes concernées sur présentation des justificatifs correspondants.
ARTICLE 10 - OBLIGATIONS FISCALES ET SOCIALES

Chaque partie procède de manière indépendante à ses déclarations fiscales et sociales et supporte personnellement les charges fiscales et sociales afférentes à son activité dans le cadre du présent remplacement.

ARTICLE 11 - CARACTÈRE PERSONNEL ET INCESSIBILITÉ

Le présent contrat est conclu en considération de la personne de chacun des cocontractants. Il ne saurait être cédé, transféré ou confié à un tiers.

ARTICLE 12 - OBLIGATIONS DE L’INFIRMIER REMPLACÉ

Pendant les périodes couvertes par le présent contrat, ${remplaceGrammar.articleRoleRemplace} s’abstient de toute activité infirmière objet du remplacement. Cette obligation ne fait pas obstacle au suivi d’une formation professionnelle, à l’assistance à une personne en péril ni à la participation à un dispositif de secours dans les conditions prévues par les textes applicables.

${remplaceGrammar.pronomSujet} s’engage à transmettre à ${remplacantGrammar.articleRoleRemplacant} les informations nécessaires à la continuité des soins, dans le respect du secret professionnel.

${remplaceGrammar.pronomSujet} s’engage à porter à la connaissance de ${remplacantGrammar.articleRoleRemplacant} les dispositions de la Convention nationale des infirmiers et les obligations applicables.

${remplaceGrammar.pronomSujet} s’engage à informer les organismes d’assurance maladie dans les conditions applicables.

${remplaceGrammar.pronomSujet} s’engage à fournir les documents nécessaires à la vérification des actes facturés, des honoraires encaissés et des sommes dues à ${remplacantGrammar.articleRoleRemplacant}.

ARTICLE 13 - RÉSILIATION

Le présent contrat prendra fin automatiquement au terme fixé à l’article 2.

Il pourra être résilié d’un commun accord entre les parties, sous réserve d’un préavis de ${durationValue(data.preavisCommunAccord)}. Cet accord fera l’objet d’un écrit daté et signé par les deux parties.

En cas de manquement par l’une des parties à ses obligations contractuelles ou déontologiques, l’autre partie lui adresse une notification écrite par lettre recommandée avec accusé de réception.

Cette notification précise la nature du manquement constaté, les mesures attendues afin d’y remédier et le délai de préavis de ${durationValue(data.preavisManquement)}.

Si la partie destinataire remédie au manquement selon les modalités et dans le délai indiqués dans la notification, la résiliation ne prend pas effet.

À défaut de régularisation dans ce délai, la résiliation prend effet au terme du préavis indiqué.

Le contrat est résilié de plein droit, sans préavis :

- en cas de retrait, de suspension ou d’expiration de l’autorisation de remplacement
- en cas d’interdiction d’exercice empêchant juridiquement l’une des parties d’exécuter le contrat
- lorsque l’indisponibilité temporaire de ${remplaceGrammar.articleRoleRemplace} devient définitive
- lorsqu’un événement rend juridiquement impossible la poursuite du remplacement

Au terme du présent contrat, ${remplacantGrammar.articleRoleRemplacant} cesse l’ensemble de ses activités de remplacement auprès des patients de ${remplaceGrammar.articleRoleRemplace} et lui transmet, dans le respect du secret professionnel, l’ensemble des informations nécessaires à la continuité des soins.

ARTICLE 14 - RENOUVELLEMENT

Toute prolongation du remplacement nécessite un avenant écrit, daté et signé par les deux parties.

Cet avenant précise la nouvelle période concernée, le motif de la prolongation et les adaptations apportées aux modalités d’organisation du remplacement.

ARTICLE 15 - LOYAUTÉ, ABSENCE DE CONCURRENCE DÉLOYALE ET NON-RÉINSTALLATION

${nonConcurrenceText}

${remplacantGrammar.articleRoleRemplacant.charAt(0).toUpperCase()}${remplacantGrammar.articleRoleRemplacant.slice(1)} s’interdit tout démarchage de la patientèle de ${remplaceGrammar.articleRoleRemplace}, toute utilisation irrégulière des fichiers du cabinet et toute manœuvre contraire aux obligations de loyauté et de confraternité.

ARTICLE 16 - RÈGLEMENT DES DIFFÉRENDS

En cas de difficulté relative à la validité, à l’interprétation, à l’exécution, à la résiliation ou à la résolution du présent contrat, les parties s’engagent, avant toute action contentieuse, à soumettre leur différend à une tentative de conciliation.

Cette conciliation sera confiée, au besoin, au conseil départemental ou interdépartemental de l’Ordre des infirmiers compétent, conformément à l’article R. 4312-25 du Code de la santé publique.

ARTICLE 17 - ABSENCE DE CONTRE-LETTRE

Les parties déclarent qu’aucune contre-lettre ni aucun accord distinct ne modifie les stipulations du présent contrat.

Tout avenant devra être établi par écrit, daté et signé par les deux parties, puis transmis au conseil de l’Ordre compétent.

ARTICLE 18 - TRANSMISSION AU CONSEIL DE L’ORDRE

Chacune des parties communique le présent contrat au conseil départemental ou interdépartemental de l’Ordre des infirmiers dont elle relève dans un délai d’un mois à compter de sa signature.

Les avenants et tout document modifiant le contrat sont transmis dans les mêmes conditions.

ARTICLE 19 - RAPPEL DES ARTICLES R. 4312-83 À R. 4312-87 DU CODE DE LA SANTÉ PUBLIQUE

Les parties déclarent avoir pris connaissance des principales dispositions réglementaires relatives au remplacement infirmier, notamment les articles R. 4312-83 à R. 4312-87 du Code de la santé publique.

Elles rappellent en particulier que le remplacement est temporaire, que le remplaçant ne remplace pas plus de deux infirmiers simultanément, que le remplacé s’abstient de toute activité infirmière objet du remplacement sous réserve des exceptions prévues par les textes, que la durée du remplacement correspond à l’indisponibilité et qu’un contrat écrit est établi au-delà de vingt-quatre heures ou en cas de remplacement répété.

ARTICLE 20 - SIGNATURES

Fait à ${value(data.faitA)}, le ${value(data.faitLe)}.

${exemplairesText}

ANNEXES

${
  annexes.length > 0
    ? annexes.map((annexe) => `- ${annexe}`).join("\n")
    : "Aucune annexe n’a été sélectionnée."
}

Les signatures des parties figurent ci-après.

${signatureRemplace}

${signatureRemplacant}
`;
}