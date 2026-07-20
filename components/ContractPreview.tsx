import Image from "next/image";
import { ContractData } from "@/lib/schema";
import { buildContractText } from "@/lib/contract";

type Props = {
  data: Partial<ContractData>;
  signatureRemplace?: string;
  signatureRemplacant?: string;
};

export function ContractPreview({
  data,
  signatureRemplace,
  signatureRemplacant,
}: Props) {
  return (
    <div className="contract-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-slate-200 pb-4 no-print">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
          Prévisualisation
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">
          Contrat rempli automatiquement
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          La version PDF imprime le contrat en pleine page A4.
        </p>
      </div>

      <article className="contract-document mx-auto bg-white text-slate-950">
        <div className="mb-8 flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-xl font-bold uppercase leading-7">
              Contrat de remplacement entre un infirmier libéral et un infirmier
              remplaçant
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Contrat établi à partir des informations déclarées par les parties.
            </p>
          </div>

          <Image
            src="/logo-cidoi-37-41.png"
            alt="Logo de l’Ordre national des infirmiers"
            width={150}
            height={150}
            className="h-auto w-[150px] object-contain"
            priority
          />
        </div>

        <div className="contract-text whitespace-pre-wrap font-serif text-[11.5pt] leading-7">
          {buildContractText(data)}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Synthèse préalable à la signature
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            <li>• Motif : {data.motif ? String(data.motif) : "à compléter"}</li>
            <li>• Période : {data.dateDebut || "à compléter"} → {data.dateFin || "à compléter"}</li>
            <li>• Facturation : {data.modeFacturation || "à compléter"}</li>
            <li>• Autorisation de remplacement : {data.numeroAutorisation || "à compléter"}</li>
            <li>• Déclarations patients / associés : {data.patientsInformes ? "patients informés" : "patients à informer"}; {data.associesInformes ? "associés/cocontractants informés" : "associés/cocontractants à informer"}</li>
          </ul>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="min-h-40 border-t border-slate-300 pt-4">
            <p className="mb-3 text-sm font-semibold text-slate-900">
              Signature de l’infirmier remplacé
            </p>

            {signatureRemplace ? (
              <img
                src={signatureRemplace}
                alt="Signature de l’infirmier remplacé"
                className="h-28 max-w-full object-contain"
              />
            ) : (
              <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
                Signature non renseignée
              </div>
            )}
          </div>

          <div className="min-h-40 border-t border-slate-300 pt-4">
            <p className="mb-3 text-sm font-semibold text-slate-900">
              Signature de l’infirmier remplaçant
            </p>

            {signatureRemplacant ? (
              <img
                src={signatureRemplacant}
                alt="Signature de l’infirmier remplaçant"
                className="h-28 max-w-full object-contain"
              />
            ) : (
              <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
                Signature non renseignée
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}