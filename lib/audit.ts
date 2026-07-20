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

export function buildLegalAudit(data: Partial<ContractData>): AuditItem[] {
  const items: AuditItem[] = []

  if (!data.remplaceSuspendActivite) {
    items.push({
      level: "blocking",
      title: "Suspension d’activité du remplacé",
      message:
        "Le remplacé doit confirmer la suspension de son activité infirmière pendant la période de remplacement.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Suspension d’activité du remplacé",
      message: "La suspension d’activité du remplacé est confirmée.",
    })
  }

  if (data.remplacementPlus24h === "oui" || data.remplacementRepete === "oui") {
    items.push({
      level: "ok",
      title: "Contrat écrit requis",
      message:
        "Le remplacement dépasse 24 heures ou il est répété. Le contrat écrit est bien adapté.",
    })
  } else {
    items.push({
      level: "warning",
      title: "Contrat écrit recommandé",
      message:
        "Le contrat écrit reste recommandé, même lorsque le remplacement ne dépasse pas 24 heures et n’est pas répété.",
    })
  }

  if (!data.conciliationPrealable) {
    items.push({
      level: "blocking",
      title: "Conciliation préalable",
      message:
        "Les parties doivent s’engager à recourir à une tentative préalable de conciliation en cas de différend.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Conciliation préalable",
      message: "La clause de conciliation préalable est renseignée.",
    })
  }

  if (data.statutRemplacant === "non_installe") {
    if (
      isEmpty(data.numeroAutorisation) ||
      isEmpty(data.dateAutorisation) ||
      isEmpty(data.conseilAutorisation)
    ) {
      items.push({
        level: "blocking",
        title: "Autorisation ordinale du remplaçant",
        message:
          "Le remplaçant sans résidence professionnelle doit renseigner son autorisation ordinale de remplacement.",
      })
    } else {
      items.push({
        level: "ok",
        title: "Autorisation ordinale du remplaçant",
        message:
          "L’autorisation ordinale du remplaçant non installé est renseignée.",
      })
    }

    if (isEmpty(data.justificatif2400h)) {
      items.push({
        level: "warning",
        title: "Justificatif 18 mois ou 2 400 heures",
        message:
          "Le justificatif d’activité du remplaçant non installé devrait être renseigné ou annexé.",
      })
    }
  }

  if (!data.deconventionnementRemplace || !data.deconventionnementRemplacant) {
    items.push({
      level: "blocking",
      title: "Absence de mesure de déconventionnement",
      message:
        "Les deux parties doivent déclarer ne faire l’objet d’aucune mesure de déconventionnement faisant obstacle au remplacement.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Absence de mesure de déconventionnement",
      message: "Les deux parties attestent ne faire l’objet d’aucune mesure de déconventionnement.",
    })
  }

  if (!data.rcpValide) {
    items.push({
      level: "blocking",
      title: "Assurance RCP",
      message:
        "Le remplaçant doit attester disposer d’une assurance responsabilité civile professionnelle valide.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Assurance RCP",
      message: "La RCP du remplaçant est confirmée.",
    })
  }

  if (!data.absenceInterdictionRemplace || !data.absenceInterdictionRemplacant) {
    items.push({
      level: "blocking",
      title: "Absence d’interdiction d’exercice",
      message:
        "Les deux parties doivent attester ne pas faire l’objet d’une interdiction d’exercice.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Absence d’interdiction d’exercice",
      message:
        "Les deux parties attestent ne pas faire l’objet d’une interdiction d’exercice.",
    })
  }

  if (!data.absenceLiquidationJudiciaire) {
    items.push({
      level: "blocking",
      title: "Liquidation judiciaire",
      message:
        "Les parties doivent attester ne pas faire l’objet d’une liquidation judiciaire incompatible avec l’exercice ou le remplacement.",
    })
  }

  if (data.exerciceEnGroupe === "oui") {
    if (isEmpty(data.clauseAgrement) || data.clauseAgrement === "ne_sait_pas") {
      items.push({
        level: "warning",
        title: "Exercice en groupe",
        message:
          "Le contrat ou les statuts du groupe doivent être vérifiés afin d’identifier une éventuelle clause d’agrément.",
      })
    }

    if (data.clauseAgrement === "oui" && data.agrementObtenu !== "oui") {
      items.push({
        level: "blocking",
        title: "Agrément du remplaçant",
        message:
          "Une clause d’agrément est indiquée. L’agrément du remplaçant doit être obtenu avant le remplacement.",
      })
    }

    if (data.confreresInformes !== "oui") {
      items.push({
        level: "warning",
        title: "Information des confrères",
        message:
          "L’information préalable des confrères ou associés d’exercice est recommandée.",
      })
    }
  }

  if (!data.patientsInformes) {
    items.push({
      level: "blocking",
      title: "Information des patients",
      message:
        "Les patients doivent être informés dès que possible de la présence, de l’identité et de la qualité du remplaçant.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Information des patients",
      message: "L’information des patients est confirmée.",
    })
  }

  const requiresAssociesNotice =
    data.exerciceEnGroupe === "oui" &&
    ["societe", "cabinet_groupe", "exercice_commun", "cocontractants"].includes(
      String(data.typeGroupe || "")
    );

  if (requiresAssociesNotice && !data.associesInformes) {
    items.push({
      level: "blocking",
      title: "Information des associés ou cocontractants",
      message:
        "Lorsque le remplacement intervient dans un cadre de groupe, de société ou de cocontractants, l’information des associés ou cocontractants doit être confirmée.",
    })
  }

  if (!data.informationCpam) {
    items.push({
      level: "blocking",
      title: "Information des CPAM",
      message:
        "Les CPAM concernées doivent être informées du remplacement et de l’option de facturation retenue.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Information des CPAM",
      message: "L’information des CPAM est confirmée.",
    })
  }

  if (!data.remplacantIdentifiePersonnellement) {
    items.push({
      level: "blocking",
      title: "Identification du remplaçant",
      message:
        "Le remplaçant doit être personnellement identifié pour les actes réalisés.",
    })
  }

  if (!data.jamaisCpsDuRemplace) {
    items.push({
      level: "blocking",
      title: "CPS du remplacé",
      message:
        "La CPS personnelle du remplacé ne doit jamais être utilisée directement par le remplaçant.",
    })
  }

  if (data.redevancePrevue === "oui") {
    if (Number(data.tauxRedevance || 0) > 10) {
      items.push({
        level: "warning",
        title: "Redevance supérieure à 10 %",
        message:
          "Le taux dépasse l’usage généralement observé de 5 à 10 %. Vérifier la justification par les frais réels de fonctionnement.",
      })
    }

    if (data.assietteFraisKilometriques && data.fraisKilometriquesExclus === "non") {
      items.push({
        level: "warning",
        title: "Frais kilométriques dans l’assiette",
        message:
          "L’inclusion des frais kilométriques dans l’assiette de la redevance doit être explicitement validée.",
      })
    }
  }

  if (data.redevancePrevue === "oui") {
    if (Number(data.tauxRedevance || 0) !== 100 - Number(data.pourcentageReverse || 0)) {
      items.push({
        level: "blocking",
        title: "Cohérence rétrocession et redevance",
        message:
          "La répartition entre la rétrocession au remplaçant et la redevance doit être cohérente et totaliser 100 %.",
      })
    } else {
      items.push({
        level: "ok",
        title: "Cohérence rétrocession et redevance",
        message: "La redevance et la rétrocession sont cohérentes et totalisent 100 %.",
      })
    }
  } else {
    items.push({
      level: "ok",
      title: "Cohérence rétrocession et redevance",
      message: "Aucune redevance n’est prévue, le remplaçant reçoit l’intégralité des honoraires.",
    })
  }

  if (!data.justificatifsRemuneration) {
    items.push({
      level: "blocking",
      title: "Justificatifs de rémunération",
      message:
        "Le remplacé doit s’engager à fournir les documents permettant de vérifier les actes facturés et la rémunération due.",
    })
  }

  if (!data.restitutionLocauxMateriel) {
    items.push({
      level: "blocking",
      title: "Restitution des locaux et du matériel",
      message:
        "Le remplaçant doit s’engager à restituer les locaux et le matériel à la fin du remplacement.",
    })
  }

  if (data.etatLieuxDebut === "non" || data.etatLieuxFin === "non") {
    items.push({
      level: "warning",
      title: "État des lieux",
      message:
        "Un état des lieux contradictoire au début et à la fin sécurise la restitution des locaux et du matériel.",
    })
  }

  if (data.remplacementSuperieurTroisMois === "oui") {
    if (isEmpty(data.dureeNonConcurrence) || isEmpty(data.communesConcernees)) {
      items.push({
        level: "warning",
        title: "Remplacement supérieur à trois mois",
        message:
          "La durée, la zone et les modalités relatives à la non-réinstallation doivent être précisées.",
      })
    }

    if (data.accordOrdreNonConcurrence !== "oui") {
      items.push({
        level: "warning",
        title: "Accord notifié à l’Ordre",
        message:
          "En cas d’accord relatif à l’installation après remplacement, la notification au Conseil de l’Ordre doit être prévue.",
      })
    }
  }

  if (!data.transmissionOrdre) {
    items.push({
      level: "blocking",
      title: "Transmission au Conseil de l’Ordre",
      message:
        "Les parties doivent s’engager à transmettre le contrat au Conseil de l’Ordre compétent dans un délai d’un mois à compter de la signature.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Délai d’un mois pour la transmission ordinale",
      message: "Le contrat est prévu pour être transmis dans le délai d’un mois suivant la signature.",
    })
  }

  if (!data.transmissionInformationsContinuiteSoins) {
    items.push({
      level: "blocking",
      title: "Transmission des informations nécessaires à la continuité des soins",
      message:
        "Le remplaçant doit s’engager à transmettre les informations nécessaires à la continuité des soins à la fin du remplacement.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Transmission des informations nécessaires à la continuité des soins",
      message: "La transmission des informations de continuité des soins est prévue.",
    })
  }

  if (!data.aucuneContreLettre) {
    items.push({
      level: "blocking",
      title: "Absence de contre-lettre",
      message:
        "Les parties doivent déclarer qu’aucune contre-lettre ne modifie le contrat.",
    })
  }

  if (Number(data.nombreExemplaires || 0) < 3) {
    items.push({
      level: "blocking",
      title: "Nombre minimal de trois exemplaires",
      message: "Le contrat doit prévoir au moins trois exemplaires originaux.",
    })
  } else {
    items.push({
      level: "ok",
      title: "Nombre minimal de trois exemplaires",
      message: "Le contrat prévoit bien au moins trois exemplaires originaux.",
    })
  }

  if (data.statutRemplacant === "non_installe") {
    if (isEmpty(data.dateAutorisation) || isEmpty(data.dateFin) || !data.autorisationValide) {
      items.push({
        level: "blocking",
        title: "Validité de l’autorisation pendant toute la période du remplacement",
        message:
          "L’autorisation de remplacement doit rester valide pendant toute la période du remplacement.",
      })
    } else {
      items.push({
        level: "ok",
        title: "Validité de l’autorisation pendant toute la période du remplacement",
        message: "L’autorisation de remplacement est censée rester valide pendant toute la période du remplacement.",
      })
    }
  }

  items.push({
    level: "ok",
    title: "Obligations fiscales et sociales",
    message: "Le contrat intègre les obligations fiscales et sociales applicables aux parties.",
  })

  items.push({
    level: "ok",
    title: "Caractère personnel et incessibilité",
    message: "Le contrat comporte la clause de caractère personnel et d’incessibilité.",
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