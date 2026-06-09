"use client"

import { useState } from "react"
import { ContractData } from "@/lib/schema"
import { buildTransmissionMail } from "@/lib/transmissionMail"

type Props = {
  data: Partial<ContractData>
}

export function TransmissionMail({ data }: Props) {
  const [copied, setCopied] = useState(false)
  const mail = buildTransmissionMail(data)

  async function copyMail() {
    await navigator.clipboard.writeText(mail)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <section className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
          Transmission à l’Ordre
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-950 md:text-xl">
          Mail prêt à copier
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Ce texte accompagne le contrat signé lors de sa transmission au Conseil de l’Ordre compétent.
        </p>
      </div>

      <textarea
        readOnly
        value={mail}
        className="h-64 w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm leading-6 text-slate-900"
      />

      <button
        type="button"
        onClick={copyMail}
        className="mt-3 w-full rounded-xl bg-red-700 px-4 py-3 text-sm font-semibold text-white hover:bg-red-800"
      >
        {copied ? "Mail copié" : "Copier le mail"}
      </button>
    </section>
  )
}