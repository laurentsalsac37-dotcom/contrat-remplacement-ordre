import { ContractData } from "./schema"

export type AuditLevel = "ok" | "warning" | "blocking"

export type AuditItem = {
  level: AuditLevel
  title: string
  message: string
}

function isEmpty(value: unknown) {
  return value === undefined || value === null || value === ""
}

function isConfirmed(value: unknown) {
  return value === true || value === "oui"
}


function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
}

function isValidDate(value: unknown) {
  if (!hasText(value)) {
    return false
  }

  const date = new Date(`${String(value)}T12:00:00`)
  return !Number.isNaN(date.getTime())
}

function dateTimestamp(value: unknown) {
  if (!isValidDate(value)) {
    return null
  }

  return new Date(`${String(value)}T12:00:00`).getTime()
}

function datesInChronologicalOrder(start: unknown, end: unknown) {
  const startTimestamp = dateTimestamp(start)
  const endTimestamp = dateTimestamp(end)

  if (startTimestamp === null || endTimestamp === null) {
    return false
  }

  return startTimestamp <= endTimestamp
}

function authorizationCoversReplacement(data: Partial<ContractData>) {
  const authorizationStart = dateTimestamp(data.dateAutorisation)
  const authorizationEnd = dateTimestamp(data.dateFinValiditeAutorisation)
  const replacementStart = dateTimestamp(data.dateDebut)
  const replacementEnd = dateTimestamp(data.dateFin)

  if (
    authorizationStart === null ||
    authorizationEnd === null ||
    replacementStart === null ||
    replacementEnd === null
  ) {
    return false
  }

  return (
    authorizationStart <= replacementStart &&
    authorizationEnd >= replacementEnd
  )
}

function isPositiveNumber(value: unknown) {
  if (isEmpty(value)) {
    return false
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0
}

function numbersAreEqual(first: number, second: number) {
  return Math.abs(first - second) < 0.001
}

function hasIdentity(
  civilite: unknown,
  firstName: unknown,
  lastName: unknown,
  ordinalNumber: unknown,
  rppsNumber: unknown
) {
  return (
    hasText(civilite) &&
    hasText(firstName) &&
    hasText(lastName) &&
    hasText(ordinalNumber) &&
    hasText(rppsNumber)
  )
}

function hasSelectedAnnex(data: Partial<ContractData>) {
  return Boolean(
    data.annexeAttestationRcProf ||
      data.annexeAutorisationRemplacement ||
      data.annexeJustificatif2400h ||
      data.annexePlanning ||
      data.annexeInventaireMateriel ||
      data.annexeEtatLieuxEntree ||
      data.annexeEtatLieuxSortie ||
      data.annexeJustificatifAgrementGroupe ||
      data.annexeAutreDocument
  )
}

function pushBooleanAudit(
  items: AuditItem[],
  confirmed: boolean,
  title: string,
  blockingMessage: string,
  okMessage: string
) {
  items.push({
    level: confirmed ? "ok" : "blocking",
    title,
    message: confirmed ? okMessage : blockingMessage,
  })
}

export function buildLegalAudit(
  data: Partial<ContractData>
): AuditItem[] {
  const items: AuditItem[] = []

  const remplaceIdentityComplete = hasIdentity(
    data.remplaceCivilite,
    data.remplacePrenom,
    data.remplaceNom,
    data.remplaceNumeroOrdinal,
    data.remplaceNumeroRpps
  )

  const remplacantIdentityComplete = hasIdentity(
    data.remplacantCivilite,
    data.remplacantPrenom,
    data.remplacantNom,
    data.remplacantNumeroOrdinal,
    data.remplacantNumeroRpps
  )

  pushBooleanAudit(
    items,
    remplaceIdentityComplete,
    "Identité de l’infirmier remplacé",
    "La civilité, le prénom, le nom, le numéro ordinal et le numéro RPPS de l’infirmier remplacé doivent être renseignés.",
    "L’identité ordinale et professionnelle de l’infirmier remplacé est renseignée."
  )

  pushBooleanAudit(
    items,
    remplacantIdentityComplete,
    "Identité de l’infirmier remplaçant",
    "La civilité, le prénom, le nom, le numéro ordinal et le numéro RPPS de l’infirmier remplaçant doivent être renseignés.",
    "L’identité ordinale et professionnelle de l’infirmier remplaçant est renseignée."
  )

  pushBooleanAudit(
    items,
    isConfirmed(data.remplaceSuspendActivite),
    "Suspension d’activité du remplacé",
    "Le remplacé doit confirmer son abstention de toute activité infirmière objet du remplacement pendant les périodes couvertes par le contrat.",
    "L’abstention d’activité infirmière objet du remplacement est confirmée."
  )

  if (
    isConfirmed(data.remplacementPlus24h) ||
    isConfirmed(data.remplacementRepete)
  ) {
    items.push({
      level: "ok",
      title: "Contrat écrit requis",
      message:
        "Le remplacement dépasse vingt-quatre heures ou présente un caractère répété. Le recours à un contrat écrit est requis.",
    })
  } else {
    items.push({
      level: "warning",
      title: "Contrat écrit recommandé",
      message:
        "Le contrat écrit reste recommandé pour sécuriser les relations entre les parties.",
    })
  }

  const replacementDatesValid =
    isValidDate(data.dateDebut) &&
    isValidDate(data.dateFin) &&
    datesInChronologicalOrder(data.dateDebut, data.dateFin)

  pushBooleanAudit(
    items,
    replacementDatesValid,
    "Période du remplacement",
    "Les dates de début et de fin doivent être renseignées et la date de fin ne doit pas précéder la date de début.",
    "La période du remplacement est cohérente."
  )

  pushBooleanAudit(
    items,
    hasText(data.motif),
    "Motif du remplacement",
    "Le motif du remplacement doit être renseigné.",
    "Le motif du remplacement est renseigné."
  )

  if (data.motif === "autre") {
    pushBooleanAudit(
      items,
      hasText(data.motifAutre),
      "Précision du motif",
      "Le motif libre doit être précisé.",
      "Le motif libre est précisé."
    )
  }

  if (data.typeRemplacement === "jours_precis") {
    pushBooleanAudit(
      items,
      hasText(data.joursPrecis),
      "Jours précis du remplacement",
      "Les jours concernés par le remplacement doivent être renseignés.",
      "Les jours précis du remplacement sont renseignés."
    )
  }

  if (data.typeRemplacement === "planning_annexe") {
    pushBooleanAudit(
      items,
      hasText(data.planningAnnexePrecision) && Boolean(data.annexePlanning),
      "Planning annexé",
      "Le planning doit être décrit et confirmé comme annexe.",
      "Le planning est renseigné et annexé."
    )
  }

  pushBooleanAudit(
    items,
    isConfirmed(data.conciliationPrealable),
    "Conciliation préalable",
    "Les parties doivent accepter une tentative préalable de conciliation en cas de différend.",
    "La clause de conciliation préalable est acceptée."
  )

  if (data.statutRemplacant !== "non_installe") {
    items.push({
      level: "blocking",
      title: "Statut du remplaçant",
      message:
        "Ce modèle concerne un infirmier sans résidence professionnelle titulaire d’une autorisation de remplacement.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Statut du remplaçant",
      message:
        "Le statut correspond au modèle destiné au titulaire d’une autorisation de remplacement.",
    })
  }

  if (data.statutRemplacant === "non_installe") {
    const authorizationComplete =
      hasText(data.numeroAutorisation) &&
      isValidDate(data.dateAutorisation) &&
      isValidDate(data.dateFinValiditeAutorisation) &&
      hasText(data.conseilAutorisation)

    pushBooleanAudit(
      items,
      authorizationComplete,
      "Autorisation ordinale du remplaçant",
      "Le numéro, la date de délivrance, la date de fin de validité et le conseil ayant délivré l’autorisation doivent être renseignés.",
      "Les informations relatives à l’autorisation ordinale sont renseignées."
    )

    pushBooleanAudit(
      items,
      authorizationCoversReplacement(data),
      "Validité de l’autorisation",
      "L’autorisation doit couvrir l’intégralité de la période du remplacement.",
      "L’autorisation couvre l’intégralité de la période du remplacement."
    )

    if (
      !hasText(data.justificatif2400h) &&
      !data.annexeJustificatif2400h
    ) {
      items.push({
        level: "warning",
        title: "Justificatif des dix-huit mois ou 2 400 heures",
        message:
          "Le justificatif d’activité devrait être décrit ou joint en annexe.",
      })
    } else {
      items.push({
        level: "ok",
        title: "Justificatif des dix-huit mois ou 2 400 heures",
        message:
          "Le justificatif d’activité est décrit ou sélectionné comme annexe.",
      })
    }
  }

  pushBooleanAudit(
    items,
    isConfirmed(data.deconventionnementRemplace) &&
      isConfirmed(data.deconventionnementRemplacant),
    "Absence de mesure de déconventionnement",
    "Les deux parties doivent déclarer ne faire l’objet d’aucune mesure de déconventionnement faisant obstacle au remplacement.",
    "Les deux parties confirment l’absence de mesure de déconventionnement incompatible."
  )

  pushBooleanAudit(
    items,
    isConfirmed(data.rcpValide),
    "Assurance de responsabilité civile professionnelle",
    "Le remplaçant doit confirmer la validité de son assurance de responsabilité civile professionnelle.",
    "La validité de l’assurance de responsabilité civile professionnelle est confirmée."
  )

  pushBooleanAudit(
    items,
    isConfirmed(data.absenceInterdictionRemplace) &&
      isConfirmed(data.absenceInterdictionRemplacant),
    "Absence d’interdiction d’exercice",
    "Les deux parties doivent confirmer l’absence d’interdiction d’exercice incompatible.",
    "Les deux parties confirment l’absence d’interdiction d’exercice incompatible."
  )

  pushBooleanAudit(
    items,
    isConfirmed(data.absenceLiquidationJudiciaire),
    "Absence de liquidation judiciaire incompatible",
    "Les parties doivent confirmer l’absence de liquidation judiciaire incompatible avec l’exercice ou le remplacement.",
    "L’absence de liquidation judiciaire incompatible est confirmée."
  )

  if (data.exerciceEnGroupe === "oui") {
    if (
      isEmpty(data.clauseAgrement) ||
      data.clauseAgrement === "ne_sait_pas"
    ) {
      items.push({
        level: "warning",
        title: "Clause d’agrément",
        message:
          "Les statuts, contrats ou conventions du groupe doivent être vérifiés afin d’identifier une éventuelle clause d’agrément.",
      })
    } else {
      items.push({
        level: "ok",
        title: "Clause d’agrément",
        message:
          "La situation relative à la clause d’agrément est renseignée.",
      })
    }

    if (
      data.clauseAgrement === "oui" &&
      !isConfirmed(data.agrementObtenu)
    ) {
      items.push({
        level: "blocking",
        title: "Agrément du remplaçant",
        message:
          "L’agrément du remplaçant doit être obtenu avant le début du remplacement.",
      })
    } else if (data.clauseAgrement === "oui") {
      items.push({
        level: "ok",
        title: "Agrément du remplaçant",
        message: "L’agrément du remplaçant est confirmé.",
      })
    }

    pushBooleanAudit(
      items,
      isConfirmed(data.confreresInformes),
      "Information des confrères",
      "Les confrères ou associés d’exercice doivent être informés du remplacement.",
      "L’information des confrères ou associés d’exercice est confirmée."
    )

    const requiresAssociesNotice = [
      "societe",
      "cabinet_groupe",
      "exercice_commun",
      "cocontractants",
    ].includes(String(data.typeGroupe || ""))

    if (requiresAssociesNotice) {
      pushBooleanAudit(
        items,
        isConfirmed(data.associesInformes),
        "Information des associés ou cocontractants",
        "L’information des associés ou cocontractants et la communication du contrat doivent être confirmées lorsque le cadre d’exercice l’exige.",
        "L’information des associés ou cocontractants est confirmée."
      )
    }
  }

  pushBooleanAudit(
    items,
    isConfirmed(data.patientsInformes),
    "Information des patients",
    "Les parties doivent confirmer l’information des patients sur la présence, l’identité et la qualité du remplaçant.",
    "L’information des patients est confirmée."
  )

  pushBooleanAudit(
    items,
    isConfirmed(data.informationCpam),
    "Information des CPAM",
    "Les CPAM concernées doivent être informées du remplacement et des modalités de facturation.",
    "L’information des CPAM est confirmée."
  )

  pushBooleanAudit(
    items,
    isConfirmed(data.remplacantIdentifiePersonnellement),
    "Identification personnelle du remplaçant",
    "Le remplaçant doit être personnellement identifié pour chaque acte réalisé.",
    "L’identification personnelle du remplaçant est confirmée."
  )

  pushBooleanAudit(
    items,
    isConfirmed(data.jamaisCpsDuRemplace),
    "Utilisation de la CPS",
    "La CPS personnelle du remplacé ne doit jamais être utilisée directement par le remplaçant.",
    "L’interdiction d’utiliser directement la CPS du remplacé est confirmée."
  )

  if (!hasText(data.modeFacturation)) {
    items.push({
      level: "blocking",
      title: "Mode de facturation",
      message: "Le mode de facturation doit être renseigné.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Mode de facturation",
      message: "Le mode de facturation est renseigné.",
    })
  }

  const percentageReversed = Number(data.pourcentageReverse)
  const feeRate =
    data.redevancePrevue === "oui"
      ? Number(data.tauxRedevance)
      : 0

  if (
    !Number.isFinite(percentageReversed) ||
    percentageReversed < 0 ||
    percentageReversed > 100
  ) {
    items.push({
      level: "blocking",
      title: "Pourcentage reversé",
      message:
        "Le pourcentage reversé au remplaçant doit être compris entre 0 et 100.",
    })
  }

  if (data.redevancePrevue === "oui") {
    if (
      !Number.isFinite(feeRate) ||
      feeRate < 0 ||
      feeRate > 100
    ) {
      items.push({
        level: "blocking",
        title: "Taux de redevance",
        message:
          "Le taux de redevance doit être compris entre 0 et 100.",
      })
    }

    if (
      Number.isFinite(percentageReversed) &&
      Number.isFinite(feeRate) &&
      numbersAreEqual(percentageReversed + feeRate, 100)
    ) {
      items.push({
        level: "ok",
        title: "Cohérence rétrocession et redevance",
        message:
          "La rétrocession et la redevance représentent ensemble 100 % des honoraires concernés.",
      })
    } else {
      items.push({
        level: "blocking",
        title: "Cohérence rétrocession et redevance",
        message:
          "La rétrocession et la redevance doivent représenter ensemble 100 % des honoraires concernés.",
      })
    }

    if (feeRate > 10) {
      items.push({
        level: "warning",
        title: "Redevance supérieure à 10 %",
        message:
          "Le taux dépasse 10 %. Les parties doivent vérifier son adéquation avec les frais et services fournis.",
      })
    }

    const hasRedevanceBase =
      Boolean(data.assietteSoins) ||
      Boolean(data.assietteMajorationsNuit) ||
      Boolean(data.assietteDimancheFeries) ||
      Boolean(data.assietteFraisKilometriques) ||
      hasText(data.assietteAutres)

    pushBooleanAudit(
      items,
      hasRedevanceBase,
      "Assiette de la redevance",
      "L’assiette de la redevance doit être définie.",
      "L’assiette de la redevance est définie."
    )

    const kilometerConflict =
      Boolean(data.assietteFraisKilometriques) &&
      data.fraisKilometriquesExclus === "oui"

    if (kilometerConflict) {
      items.push({
        level: "blocking",
        title: "Indemnités kilométriques",
        message:
          "Les indemnités kilométriques ne peuvent pas être à la fois incluses dans l’assiette et déclarées exclues.",
      })
    } else {
      items.push({
        level: "ok",
        title: "Indemnités kilométriques",
        message:
          "Le traitement des indemnités kilométriques est cohérent.",
      })
    }
  } else {
    if (
      Number.isFinite(percentageReversed) &&
      numbersAreEqual(percentageReversed, 100)
    ) {
      items.push({
        level: "ok",
        title: "Absence de redevance",
        message:
          "Aucune redevance n’est prévue et le remplaçant reçoit 100 % des honoraires concernés.",
      })
    } else {
      items.push({
        level: "blocking",
        title: "Absence de redevance",
        message:
          "En l’absence de redevance, le pourcentage reversé au remplaçant doit être fixé à 100 %.",
      })
    }
  }

  pushBooleanAudit(
    items,
    isConfirmed(data.justificatifsRemuneration),
    "Justificatifs de rémunération",
    "Le remplacé doit confirmer la remise des documents permettant de vérifier les actes facturés et la rémunération.",
    "La remise des justificatifs de rémunération est prévue."
  )

  pushBooleanAudit(
    items,
    isConfirmed(data.restitutionLocauxMateriel),
    "Restitution des locaux et du matériel",
    "Le remplaçant doit accepter la restitution des locaux et du matériel au terme du remplacement.",
    "La restitution des locaux et du matériel est prévue."
  )

  if (
    data.etatLieuxDebut === "non" ||
    data.etatLieuxFin === "non"
  ) {
    items.push({
      level: "warning",
      title: "États des lieux",
      message:
        "Un état des lieux contradictoire au début et à la fin du remplacement sécurise la restitution.",
    })
  } else if (
    data.etatLieuxDebut === "oui" &&
    data.etatLieuxFin === "oui"
  ) {
    items.push({
      level: "ok",
      title: "États des lieux",
      message:
        "Les états des lieux d’entrée et de sortie sont prévus.",
    })
  }

  if (data.remplacementSuperieurTroisMois === "oui") {
    const hasArea =
      isPositiveNumber(data.rayonKm) ||
      hasText(data.communesConcernees) ||
      hasText(data.clauseNonConcurrence)

    pushBooleanAudit(
      items,
      hasArea,
      "Périmètre de non-réinstallation",
      "Un rayon, des communes ou un périmètre précis doivent être renseignés pour un remplacement supérieur à trois mois.",
      "Le périmètre de non-réinstallation est renseigné."
    )

    if (
      !isEmpty(data.dureeNonConcurrence) &&
      Number(data.dureeNonConcurrence) !== 2
    ) {
      items.push({
        level: "blocking",
        title: "Durée de non-réinstallation",
        message:
          "La durée applicable doit être fixée à deux ans pour le régime prévu par l’article R. 4312-87.",
      })
    } else {
      items.push({
        level: "ok",
        title: "Durée de non-réinstallation",
        message:
          "La durée de deux ans est appliquée au régime de non-réinstallation.",
      })
    }

    if (
      data.accordOrdreNonConcurrence === "non" ||
      isEmpty(data.accordOrdreNonConcurrence)
    ) {
      items.push({
        level: "warning",
        title: "Accord dérogatoire",
        message:
          "En présence d’un accord dérogatoire entre les parties, sa notification au conseil de l’Ordre doit être organisée.",
      })
    }
  } else {
    items.push({
      level: "ok",
      title: "Non-réinstallation",
      message:
        "La durée déclarée n’excède pas trois mois. Les obligations de loyauté et d’absence de détournement de patientèle demeurent applicables.",
    })
  }

  pushBooleanAudit(
    items,
    isConfirmed(data.transmissionOrdre),
    "Transmission au conseil de l’Ordre",
    "Les parties doivent accepter la transmission du contrat et de ses avenants au conseil compétent dans un délai d’un mois.",
    "La transmission au conseil de l’Ordre dans le délai d’un mois est prévue."
  )

  pushBooleanAudit(
    items,
    isConfirmed(data.transmissionInformationsContinuiteSoins),
    "Continuité des soins",
    "Le remplaçant doit confirmer la transmission des informations nécessaires à la continuité des soins.",
    "La transmission des informations nécessaires à la continuité des soins est prévue."
  )

  pushBooleanAudit(
    items,
    isConfirmed(data.aucuneContreLettre),
    "Absence de contre-lettre",
    "Les parties doivent déclarer qu’aucune contre-lettre ni aucun accord distinct ne modifie le contrat.",
    "L’absence de contre-lettre est confirmée."
  )

  const copies = Number(data.nombreExemplaires)

  pushBooleanAudit(
    items,
    Number.isFinite(copies) && copies >= 3,
    "Nombre d’exemplaires",
    "Le contrat doit être établi en trois exemplaires originaux au minimum.",
    "Le nombre minimal de trois exemplaires originaux est respecté."
  )

  if (!hasSelectedAnnex(data)) {
    items.push({
      level: "warning",
      title: "Annexes",
      message:
        "Aucune annexe n’est sélectionnée. Vérifiez notamment la RCP, l’autorisation et le planning.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Annexes",
      message: "Une ou plusieurs annexes sont sélectionnées.",
    })
  }

  if (
    data.annexeAutreDocument &&
    !hasText(data.annexeAutreDocumentPrecision)
  ) {
    items.push({
      level: "blocking",
      title: "Autre annexe",
      message:
        "Le document sélectionné comme autre annexe doit être précisé.",
    })
  }

  pushBooleanAudit(
    items,
    isConfirmed(data.syntheseRelue),
    "Synthèse avant signature",
    "Les parties doivent confirmer avoir vérifié la synthèse avant signature.",
    "La vérification de la synthèse avant signature est confirmée."
  )

  pushBooleanAudit(
    items,
    hasText(data.faitA) && isValidDate(data.faitLe),
    "Lieu et date de signature",
    "Le lieu et la date de signature doivent être renseignés.",
    "Le lieu et la date de signature sont renseignés."
  )

  items.push({
    level: "ok",
    title: "Obligations fiscales et sociales",
    message:
      "Le contrat comporte une clause relative aux obligations fiscales et sociales des parties.",
  })

  items.push({
    level: "ok",
    title: "Caractère personnel et incessibilité",
    message:
      "Le contrat comporte une clause relative à son caractère personnel et à son incessibilité.",
  })

  return items
}

export function countAudit(items: AuditItem[]) {
  return {
    ok: items.filter((item) => item.level === "ok").length,
    warning: items.filter((item) => item.level === "warning").length,
    blocking: items.filter((item) => item.level === "blocking").length,
  }
}