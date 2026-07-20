import { ContractData } from "@/lib/schema"
import { buildLegalAudit, countAudit } from "@/lib/audit"

type Props = {
  data: Partial<ContractData>
}

const levelStyles = {
  ok: {
    badge: "bg-emerald-100 text-emerald-800",
    border: "border-emerald-200",
    title: "text-emerald-900",
    label: "Renseigné",
  },
  warning: {
    badge: "bg-amber-100 text-amber-800",
    border: "border-amber-200",
    title: "text-amber-900",
    label: "Vérification recommandée",
  },
  blocking: {
    badge: "bg-red-100 text-red-800",
    border: "border-red-200",
    title: "text-red-900",
    label: "Information obligatoire",
  },
}

export function LegalAudit({ data }: Props) {
  const items = buildLegalAudit(data)
  const counts = countAudit(items)

  return (
    <section className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
          Vérifications de cohérence contractuelle
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-950 md:text-xl">
          Points de vérification avant signature
        </h2>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-xl font-bold text-emerald-800">{counts.ok}</p>
          <p className="text-xs text-emerald-900">Renseignés</p>
        </div>

        <div className="rounded-xl bg-amber-50 p-3">
          <p className="text-xl font-bold text-amber-800">{counts.warning}</p>
          <p className="text-xs text-amber-900">Recommandés</p>
        </div>

        <div className="rounded-xl bg-red-50 p-3">
          <p className="text-xl font-bold text-red-800">{counts.blocking}</p>
          <p className="text-xs text-red-900">Obligatoires</p>
        </div>
      </div>

      <div className="max-h-[520px] space-y-3 overflow-auto pr-1">
        {items.map((item, index) => {
          const style = levelStyles[item.level]

          return (
            <div
              key={`${item.title}-${index}`}
              className={`rounded-xl border ${style.border} bg-white p-3`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className={`text-sm font-semibold ${style.title}`}>
                  {item.title}
                </h3>
                <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${style.badge}`}>
                  {style.label}
                </span>
              </div>

              <p className="text-sm leading-6 text-slate-700">{item.message}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}