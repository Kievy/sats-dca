"use client";

import { FormEvent, useMemo, useState } from "react";
import { Calendar, Pencil, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import {
  createPurchase,
  deletePurchase,
  updatePurchase,
} from "@/backend/services/purchases";
import { PageTitle } from "@/frontend/components/page-title";
import { Panel } from "@/frontend/components/panel";
import type { DcaPoint } from "@/frontend/data/bitcoin";
import { brl, sats, shortDate, usd } from "@/frontend/lib/format";
import { usePurchases } from "@/frontend/hooks/use-purchases";

type PurchaseForm = {
  date: string;
  sats: string;
  btcPriceUsd: string;
  investedBrl: string;
  platform: string;
  notes: string;
};

const emptyForm: PurchaseForm = {
  date: "",
  sats: "",
  btcPriceUsd: "",
  investedBrl: "",
  platform: "",
  notes: "",
};

export default function ComprasPage() {
  const {
    purchases,
    error,
    loading,
    reload,
    prependPurchase,
    removePurchase,
    replacePurchase,
  } = usePurchases();
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<DcaPoint | null>(null);
  const [formValues, setFormValues] = useState<PurchaseForm>(emptyForm);

  const rows = useMemo(
    () => [...purchases].sort((a, b) => b.date.localeCompare(a.date)),
    [purchases],
  );

  const platforms = useMemo(
    () => Array.from(new Set(rows.map((row) => row.platform))).sort(),
    [rows],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!formValues.date) {
      setMessage("Informe a data do aporte.");
      return;
    }

    const next: DcaPoint = {
      id: editing?.id ?? rows.length + 1,
      dbId: editing?.dbId,
      date: formValues.date,
      sats: Number(formValues.sats),
      btcPriceUsd: Number(formValues.btcPriceUsd),
      investedBrl: Number(formValues.investedBrl),
      platform: formValues.platform,
      goal: "Geral",
      notes: formValues.notes || null,
    };

    const payload = {
      date: next.date,
      sats: next.sats,
      btc_price_usd: next.btcPriceUsd,
      invested_brl: next.investedBrl,
      platform: next.platform,
      goal: "Geral",
      notes: next.notes,
    };

    const result =
      editing?.dbId
        ? await updatePurchase({ id: editing.dbId, ...payload })
        : await createPurchase(payload);

    if (result.error) {
      setMessage(`Banco nao salvou: ${result.error}`);
      return;
    }

    if (result.data) {
      if (editing?.dbId) {
        replacePurchase(result.data);
      } else {
        prependPurchase(result.data);
      }
    }

    await reload();
    setMessage(editing ? "Aporte atualizado com sucesso." : "Aporte salvo com sucesso.");
    resetForm();
  }

  async function handleDelete(row: DcaPoint) {
    if (!row.dbId) {
      return;
    }

    setMessage("");
    const result = await deletePurchase(row.dbId);

    if (result.error) {
      setMessage(`Nao foi possivel excluir: ${result.error}`);
      return;
    }

    removePurchase(row.dbId);
    setMessage("Aporte excluido com sucesso.");
  }

  function startEdit(row: DcaPoint) {
    setEditing(row);
    setFormValues({
      date: row.date,
      sats: String(row.sats),
      btcPriceUsd: String(row.btcPriceUsd),
      investedBrl: String(row.investedBrl),
      platform: row.platform,
      notes: row.notes ?? "",
    });
    setMessage("");
  }

  function resetForm() {
    setEditing(null);
    setFormValues(emptyForm);
  }

  function updateField(field: keyof PurchaseForm, value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <>
      <PageTitle icon={ShoppingCart} title="Compras" />

      {error ? (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </div>
      ) : null}

      <Panel
        title={editing ? "Editar aporte" : "Cadastrar aporte"}
        icon={editing ? <Pencil size={20} className="text-bitcoin" /> : <Plus size={20} className="text-bitcoin" />}
      >
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Field label="Data">
            <input
              required
              value={formValues.date}
              onChange={(event) => updateField("date", event.target.value)}
              type="date"
              className="input"
            />
          </Field>
          <Field label="BTC (sats)">
            <input
              required
              value={formValues.sats}
              onChange={(event) => updateField("sats", event.target.value)}
              type="number"
              min="1"
              placeholder="25000"
              className="input"
            />
          </Field>
          <Field label="Preco BTC (USD)">
            <input
              required
              value={formValues.btcPriceUsd}
              onChange={(event) => updateField("btcPriceUsd", event.target.value)}
              type="number"
              min="1"
              step="0.01"
              placeholder="74000"
              className="input"
            />
          </Field>
          <Field label="Investido (R$)">
            <input
              required
              value={formValues.investedBrl}
              onChange={(event) => updateField("investedBrl", event.target.value)}
              type="number"
              min="1"
              step="0.01"
              placeholder="100"
              className="input"
            />
          </Field>
          <Field label="Plataforma">
            <input
              required
              value={formValues.platform}
              onChange={(event) => updateField("platform", event.target.value)}
              placeholder="P2PME"
              className="input"
            />
          </Field>
          <Field label="Notas">
            <input
              value={formValues.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Opcional"
              className="input"
            />
          </Field>
          <div className="flex gap-3 md:col-span-3 xl:col-span-6">
            <button className="h-12 flex-1 rounded-2xl bg-ink px-5 font-bold text-white transition hover:bg-bitcoin">
              {editing ? "Salvar alteracoes" : "Adicionar aporte"}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={resetForm}
                className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-white text-muted transition hover:text-ink"
                title="Cancelar edicao"
              >
                <X size={20} />
              </button>
            ) : null}
          </div>
        </form>
        {message ? <p className="mt-4 text-sm font-semibold text-muted">{message}</p> : null}
      </Panel>

      <Panel title="Historico de compras" icon={<Calendar size={20} className="text-bitcoin" />} className="mt-5">
        {loading ? <p className="mb-4 text-sm font-semibold text-muted">Carregando compras...</p> : null}

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <input className="input" type="date" aria-label="Periodo de" />
          <input className="input" type="date" aria-label="Periodo ate" />
          <select className="input" aria-label="Plataforma">
            <option>Todas as plataformas</option>
            {platforms.map((platform) => (
              <option key={platform}>{platform}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="text-xs uppercase text-muted">
              <tr className="border-b border-line">
                <th className="py-4">#</th>
                <th>Data</th>
                <th>BTC (sats)</th>
                <th>Preco BTC (USD)</th>
                <th>Investido</th>
                <th>Plataforma</th>
                <th className="text-right">Acoes</th>
              </tr>
            </thead>
            <tbody className="font-bold">
              {rows.map((row, index) => (
                <tr key={row.dbId ?? `${row.id}-${row.date}`} className="border-b border-[#ededeb] transition hover:bg-[#f6f6f4]">
                  <td className="py-4 text-bitcoin">{rows.length - index}</td>
                  <td>{shortDate(row.date)}</td>
                  <td>{sats(row.sats)}</td>
                  <td>{usd(row.btcPriceUsd)}</td>
                  <td>{brl(row.investedBrl)}</td>
                  <td>
                    <span className="rounded-lg bg-[#eef4ff] px-2 py-1 text-xs text-blue-700">{row.platform}</span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="grid size-9 place-items-center rounded-xl border border-line bg-white text-muted transition hover:text-ink"
                        title="Editar aporte"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(row)}
                        className="grid size-9 place-items-center rounded-xl border border-line bg-white text-muted transition hover:border-red-200 hover:text-danger"
                        title="Excluir aporte"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}
