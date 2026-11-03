"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { bookedDates, EVENT_TYPES, isEmail, isoDay, isPhone, KOSHER, quoteMessage, SERVICES, SOURCES, VENUES, waLink, type EventType, type Kosher, type Quote, type Service, type Source, type Venue } from "@/lib/quote";

type Errors = Partial<Record<"name" | "phone" | "email", string>>;

function Field({ label, hint, error, children, id }: { label: ReactNode; hint?: string; error?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-[0.8125rem] leading-relaxed text-cinnamon-ink">{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="mt-2 text-[0.8125rem] text-[#9b3b2a]">
          {error}
        </p>
      )}
    </div>
  );
}

function Choices<T extends string>({ name, label, options, labels, value, onChange, cols = false }: { name: string; label: string; options: readonly T[]; labels: Record<T, string>; value: T | ""; onChange: (v: T) => void; cols?: boolean }) {
  const id = useId();
  return (
    <div>
      <p className="label" id={id}>
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={id} className={`mt-3 ${cols ? "grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" : "flex flex-wrap gap-2"}`}>
        {options.map((o) => (
          <label key={o} className="chip justify-center">
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {labels[o]}
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * Demande de devis : reprend exactement les questions de leur message d'accueil WhatsApp
 * (type d'événement, invités, date estimée, lieu, casher, comment ils nous ont connus) et les complète.
 * Envoi : WhatsApp avec le récapitulatif, plus e-mails de notification et de confirmation si Resend est configuré.
 */
export function QuoteForm() {
  const { lang, d } = useLocale();
  const f = d.quote.fields;
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [eventType, setEventType] = useState<EventType>("wedding");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState<Venue | "">("");
  const [venueName, setVenueName] = useState("");
  const [kosher, setKosher] = useState<Kosher | "">("");
  const [source, setSource] = useState<Source | "">("");
  const [service, setService] = useState<Service>("both");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [today, setToday] = useState("");

  // Date du jour lue côté client seulement (le HTML est généré à l'avance)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- valeur lue une fois au montage
  useEffect(() => setToday(isoDay(new Date())), []);

  const booked = date !== "" && bookedDates.has(date);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e.name = d.quote.required;
    if (!phone.trim()) e.phone = d.quote.required;
    else if (!isPhone(phone)) e.phone = d.quote.invalidPhone;
    if (email.trim() && !isEmail(email)) e.email = d.quote.invalidEmail;
    return e;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = (["name", "phone", "email"] as const).find((k) => e[k]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    const quote: Quote = {
      eventType,
      guests: guests.replace(/\D/g, ""),
      date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "",
      venue,
      venueName: venue === "search" ? "" : venueName.trim(),
      kosher,
      source,
      service,
      budget,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message: message.trim(),
    };
    const ref = `MC-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    const url = waLink(quoteMessage(quote, lang, d, ref));
    // Ouvert pendant le clic, pour ne pas être bloqué comme fenêtre surgissante
    window.open(url, "_blank", "noopener");
    fetch("/api/quote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ quote, lang, ref }), keepalive: true }).catch(() => {});
    setSent(url);
  };

  const reset = () => {
    setSent(null);
    setGuests("");
    setDate("");
    setVenue("");
    setVenueName("");
    setKosher("");
    setSource("");
    setBudget("");
    setMessage("");
  };

  const err = (k: keyof Errors) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-err` } : {});
  const optional = <span className="normal-case tracking-normal">({f.optional})</span>;

  return (
    <>
      {sent ? (
        <div key="sent" className="fade-in border border-line bg-cream p-8 text-center md:p-14" role="status">
          <p className="accent text-[2.4rem] leading-none text-cinnamon-ink">{d.quote.success.thanks}</p>
          <h3 className="display mt-5 text-[1.3rem] rtl:text-[2rem]">{d.quote.success.title}</h3>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{d.quote.success.text}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={sent} target="_blank" rel="noopener noreferrer" className="btn-solid">
              <WhatsAppIcon className="h-4 w-4" />
              {d.quote.success.again}
            </a>
            <button type="button" onClick={reset} className="link-line nav-link">
              {d.quote.success.reset}
            </button>
          </div>
        </div>
      ) : (
        <form key="form" onSubmit={onSubmit} noValidate className="space-y-14">
          {/* 1 — L'événement */}
          <fieldset className="space-y-8">
            <legend className="mb-8 flex items-baseline gap-4">
              <span className="num text-[0.8125rem] text-cinnamon-ink">01</span>
              <span className="display text-[1.1rem] rtl:text-[1.75rem]">{d.quote.steps.event}</span>
            </legend>
            <Choices name="eventType" label={f.eventType} options={EVENT_TYPES} labels={f.eventTypes} value={eventType} onChange={setEventType} />
            <div className="grid gap-8 sm:grid-cols-2">
              <Field id={id("guests")} label={f.guests}>
                <input id={id("guests")} name="guests" type="number" inputMode="numeric" min={1} max={5000} value={guests} onChange={(e) => setGuests(e.target.value)} className="field num" />
              </Field>
              <Field id={id("date")} label={f.date} hint={booked ? f.dateBooked : undefined}>
                <input id={id("date")} name="date" type="date" min={today || undefined} value={date} onChange={(e) => setDate(e.target.value)} className="field" />
              </Field>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <Choices name="venue" label={f.venue} options={VENUES} labels={f.venues} value={venue} onChange={setVenue} />
              {venue !== "search" && (
                <Field id={id("venueName")} label={f.venueName}>
                  <input id={id("venueName")} name="venueName" type="text" autoComplete="off" placeholder={f.venuePlaceholder} value={venueName} onChange={(e) => setVenueName(e.target.value)} className="field" maxLength={160} />
                </Field>
              )}
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <Choices name="kosher" label={f.kosher} options={KOSHER} labels={f.kosherOptions} value={kosher} onChange={setKosher} />
              <Field id={id("source")} label={f.source}>
                <select id={id("source")} name="source" value={source} onChange={(e) => setSource((SOURCES as readonly string[]).includes(e.target.value) ? (e.target.value as Source) : "")} className="field">
                  <option value="">{f.sourceNone}</option>
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {f.sources[s]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </fieldset>

          {/* 2 — Les prestations */}
          <fieldset className="space-y-8">
            <legend className="mb-8 flex items-baseline gap-4">
              <span className="num text-[0.8125rem] text-cinnamon-ink">02</span>
              <span className="display text-[1.1rem] rtl:text-[1.75rem]">{d.quote.steps.service}</span>
            </legend>
            <Choices name="service" label={f.services} options={SERVICES} labels={f.serviceOptions} value={service} onChange={setService} cols />
            <Field id={id("budget")} label={<>{f.budget} {optional}</>}>
              <select id={id("budget")} name="budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="field">
                <option value="">{f.budgetNone}</option>
                {f.budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
          </fieldset>

          {/* 3 — Les coordonnées */}
          <fieldset className="space-y-8">
            <legend className="mb-8 flex items-baseline gap-4">
              <span className="num text-[0.8125rem] text-cinnamon-ink">03</span>
              <span className="display text-[1.1rem] rtl:text-[1.75rem]">{d.quote.steps.contact}</span>
            </legend>
            <div className="grid gap-8 sm:grid-cols-2">
              <Field id={id("name")} label={`${f.name} *`} error={errors.name}>
                <input id={id("name")} name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="field" maxLength={120} {...err("name")} />
              </Field>
              <Field id={id("phone")} label={`${f.phone} *`} error={errors.phone}>
                <input id={id("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="field rtl:text-end" maxLength={30} {...err("phone")} />
              </Field>
              <Field id={id("email")} label={<>{f.email} {optional}</>} error={errors.email}>
                <input id={id("email")} name="email" type="email" autoComplete="email" spellCheck={false} dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="field rtl:text-end" maxLength={160} {...err("email")} />
              </Field>
            </div>
            <Field id={id("message")} label={f.message}>
              <textarea id={id("message")} name="message" rows={4} placeholder={f.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" maxLength={1500} />
            </Field>
          </fieldset>

          <div>
            <button type="submit" className="btn-solid w-full sm:w-auto">
              <WhatsAppIcon className="h-4 w-4" />
              {d.quote.submit}
            </button>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">{d.quote.hint}</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{d.quote.consent}</p>
          </div>
        </form>
      )}
    </>
  );
}
