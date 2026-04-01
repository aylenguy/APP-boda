"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Heart,
  Gift,
  Camera,
  Sparkles,
  Gem,
} from "lucide-react";

import localFont from "next/font/local";
const miFuente = localFont({
  src: "../public/fonts/fuente.ttf", // ajustá el nombre
  variable: "--font-boda",
});

const RSVP_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxhyHprcMiRIy0CgszXqrjO3uZmyjz7s6GLwTAfPwZekQdaPeNQPB4UZBHDDnoSGzORJw/exec";

export default function Home() {
  const weddingDate = new Date("2027-08-28T18:00:00");

  

  const [open, setOpen] = useState(false);
  const [openCBU, setOpenCBU] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(weddingDate));

  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);

  const [nombre, setNombre] = useState("");
  const [asistencia, setAsistencia] = useState<"Si" | "No">("Si");
  const [menu, setMenu] = useState("");
  const [tieneAlergia, setTieneAlergia] = useState<"" | "No" | "Si">("No");
  const [alergiaDetalle, setAlergiaDetalle] = useState("");
  const [sending, setSending] = useState(false);
  const [sendingText, setSendingText] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpError, setRsvpError] = useState("");

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(weddingDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  useEffect(() => {
    const fetchGuests = async () => {
      if (!RSVP_SCRIPT_URL || RSVP_SCRIPT_URL.includes("PEGÁ_ACÁ")) return;

      try {
        setLoadingGuests(true);
        const res = await fetch(`${RSVP_SCRIPT_URL}?action=list`, {
          method: "GET",
        });
        const data = await res.json();

        if (data.ok && Array.isArray(data.names)) {
          setGuestNames(data.names);
        } else {
          console.error("No se pudieron cargar los invitados", data);
        }
      } catch (error) {
        console.error("Error cargando invitados", error);
      } finally {
        setLoadingGuests(false);
      }
    };

    fetchGuests();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const countdownItems = [
    { key: "days", label: "días" },
    { key: "hours", label: "hs" },
    { key: "minutes", label: "min" },
    { key: "seconds", label: "seg" },
  ] as const;

  const normalizedGuestNames = useMemo(
    () => guestNames.map((n) => normalizeText(n)),
    [guestNames]
  );

  const exactGuestName = useMemo(() => {
    const normalizedInput = normalizeText(nombre);

    if (!normalizedInput) return "";

    const index = normalizedGuestNames.findIndex(
      (guest) => guest === normalizedInput
    );

    return index >= 0 ? guestNames[index] : "";
  }, [nombre, guestNames, normalizedGuestNames]);

  const filteredGuests = useMemo(() => {
    const normalizedInput = normalizeText(nombre);

    if (!normalizedInput) return guestNames.slice(0, 8);

    return guestNames
      .filter((guest) => normalizeText(guest).includes(normalizedInput))
      .slice(0, 8);
  }, [guestNames, nombre]);

  const handleCopyAlias = async () => {
    try {
      await navigator.clipboard.writeText("jimena.perezguzman");
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (error) {
      console.error("No se pudo copiar el alias", error);
    }
  };

  const resetRsvpForm = () => {
    setNombre("");
    setAsistencia("Si");
    setMenu("");
    setTieneAlergia("No");
    setAlergiaDetalle("");
    setRsvpMessage("");
    setRsvpError("");
    setShowSuggestions(false);
    setSendingText("");
  };

  const handleCloseRsvp = () => {
    setOpen(false);
    setRsvpMessage("");
    setRsvpError("");
    setShowSuggestions(false);
    setSendingText("");
  };

  const handleSelectGuest = (guest: string) => {
    setNombre(guest);
    setShowSuggestions(false);
    setRsvpError("");
  };

  const handleSubmitRsvp = async () => {
    setRsvpMessage("");
    setRsvpError("");

    const trimmedName = nombre.trim();

    if (!trimmedName) {
      setRsvpError("Ingresá tu nombre y apellido.");
      return;
    }

    const normalizedInput = normalizeText(trimmedName);
    const matchedIndex = normalizedGuestNames.findIndex(
      (guest) => guest === normalizedInput
    );

    if (matchedIndex === -1) {
      setRsvpError("Ese nombre no figura en la lista de invitados.");
      return;
    }

    const matchedGuestName = guestNames[matchedIndex];

    if (asistencia === "Si" && !menu) {
      setRsvpError("Seleccioná una opción de menú.");
      return;
    }

    if (asistencia === "Si" && tieneAlergia === "Si" && !alergiaDetalle.trim()) {
      setRsvpError("Indicá a qué alimento sos alérgico o qué restricción tenés.");
      return;
    }

    if (!RSVP_SCRIPT_URL || RSVP_SCRIPT_URL.includes("PEGÁ_ACÁ")) {
      setRsvpError("Falta configurar la URL del Apps Script.");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 12000);

    try {
      setSending(true);
      setSendingText("Enviando confirmación...");

      const res = await fetch(RSVP_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          nombre: matchedGuestName,
          asistencia,
          menu: asistencia === "No" ? "" : menu,
          tieneAlergia: asistencia === "No" ? "" : tieneAlergia,
          alergiaDetalle:
            asistencia === "No" || tieneAlergia === "No"
              ? ""
              : alergiaDetalle.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setSendingText("Procesando respuesta...");

      const data = await res.json();

      if (data.ok) {
        setRsvpMessage("¡Gracias! Tu confirmación fue enviada correctamente.");
        setRsvpError("");
        setSendingText("");

        setTimeout(() => {
          resetRsvpForm();
          setOpen(false);
        }, 1200);
      } else {
        setRsvpError(data.message || "No se pudo enviar la confirmación.");
        setSendingText("");
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        setRsvpError(
          "La confirmación está demorando demasiado. Probá nuevamente en unos segundos."
        );
      } else {
        setRsvpError("Ocurrió un error al enviar la confirmación.");
      }

      setSendingText("");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#1a1a1a]">
      {/* HERO */}
      <section className="relative h-[90vh] min-h-[520px] w-full overflow-hidden bg-black md:h-[88vh] xl:h-[82vh]">
  <motion.img
    src="/images/hero-boda.jpeg?v=2"
    alt="Jime y Joel"
    initial={{ scale: 1.04, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.9, ease: "easeOut" }}
    className="absolute inset-0 h-full w-full object-cover object-[75%_center] md:object-center"
  />

  <div className="absolute inset-0 bg-white/30 md:bg-white/45" />

  <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-[680px]"
    >
      <p className="text-[12px] uppercase tracking-[0.35em] text-[#8a847d] md:text-[15px]">
        ¡Nos casamos!
      </p>

      <h1 className="mt-4 md:mt-6">
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5 }}
          className={`${miFuente.className} block text-5xl leading-tight font-light tracking-[0.05em] md:text-6xl xl:text-[5.2rem]`}
        >
          Jime
        </motion.span>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.35 }}
          className="block text-lg text-[#8a847d] md:text-xl"
        >
          &
        </motion.span>

        <motion.span
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`${miFuente.className} block text-5xl leading-tight font-light tracking-[0.05em] md:text-6xl xl:text-[5.2rem]`}
        >
          Joel
        </motion.span>
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
        className="mt-8 md:mt-14"
      >
        <span className="inline-block border border-[#d6d0c8] bg-white/80 px-6 py-3 text-sm tracking-[0.22em] md:px-8 md:py-4 md:text-sm">
          28 · 08 · 2027
        </span>
      </motion.div>
    </motion.div>
  </div>
</section>

      {/* COUNTDOWN */}
      <section className="bg-[#f6f3ee] px-3 py-14 text-center md:px-6">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#8a847d] md:text-[11px] md:tracking-[0.5em]">
          Falta para el gran día
        </p>

        <div className="mx-auto mt-8 flex max-w-4xl flex-nowrap items-center justify-center gap-2 md:mt-10 md:gap-4">
          {countdownItems.map((item) => (
            <div
              key={item.key}
              className="min-w-0 flex-1 rounded-xl border border-[#ddd6cf] bg-white px-2 py-4 text-center shadow-sm md:rounded-2xl md:px-3 md:py-6 md:shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
            >
              <p className="text-lg font-light leading-none md:text-3xl">
                {timeLeft ? timeLeft[item.key] : "0"}
              </p>

              <p className="mt-2 text-[8px] uppercase tracking-[0.16em] text-[#8a847d] md:text-[11px] md:tracking-[0.3em]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

   
   {/* ITINERARIO */}
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  viewport={{ once: true }}
  className="bg-white px-4 py-16 text-center md:px-6 md:py-24"
>
  <p className="text-[10px] uppercase tracking-[0.4em] text-[#8a847d] md:text-[11px] md:tracking-[0.5em]">
    Itinerario
  </p>

  <h2 className="mt-4 text-[1.9rem] font-light tracking-[0.05em] md:text-[2.6rem]">
    Nuestro gran día
  </h2>

  <div className="relative mx-auto mt-12 max-w-3xl md:mt-20">
    <div className="absolute left-3 top-0 h-full w-[1px] bg-[#d6d0c8] md:left-1/2 md:-translate-x-1/2" />

    {/* CEREMONIA */}
    <div className="relative mb-12 flex flex-col items-start justify-between md:mb-16 md:flex-row md:items-center">
      <div className="absolute left-3 h-3 w-3 -translate-x-1/2 rounded-full border border-white bg-[#cfc8c0] shadow md:left-1/2 md:h-4 md:w-4" />

      <div className="ml-8 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-[#ddd6cf] bg-white p-4 text-left shadow-sm md:ml-0 md:w-[45%] md:max-w-none md:p-8 md:text-right">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#8a847d] md:text-[11px]">
          Ceremonia
        </p>

        <h3 className="mt-2 text-xl font-light md:mt-3 md:text-2xl">
          18:00 hs
        </h3>

        <p className="mt-3">Ubicación a confirmar</p>

        {/*
        <p className="mt-3">Primera Iglesia Bautista</p>
        <p className="text-sm text-[#6b6b6b]">San Martín 1558</p>

        <a
          href="https://maps.app.goo.gl/BhSp2rAiA9vdSAFP9"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block border-b border-[#2c2c2c] text-xs uppercase tracking-[0.2em] text-[#2c2c2c] hover:opacity-70 md:mt-6 md:text-sm"
        >
          Ver ubicación
        </a>
        */}
      </div>

      <div className="hidden md:block md:w-[45%]" />
    </div>

    {/* CELEBRACIÓN */}
    <div className="relative flex flex-col items-start justify-between md:flex-row md:items-center">
      <div className="absolute left-3 h-3 w-3 -translate-x-1/2 rounded-full border border-white bg-[#cfc8c0] shadow md:left-1/2 md:h-4 md:w-4" />

      <div className="hidden md:block md:w-[45%]" />

      <div className="ml-8 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-[#ddd6cf] bg-white p-4 text-left shadow-sm md:ml-0 md:w-[45%] md:max-w-none md:p-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#8a847d] md:text-[11px]">
          Celebración
        </p>

        <h3 className="mt-2 text-xl font-light md:mt-3 md:text-2xl">
          21:00 hs — 04:00 hs
        </h3>

        <p className="mt-3">Nebraska</p>
        <p className="text-sm text-[#6b6b6b]">Mendoza 5130</p>

        <a
          href="https://www.google.com/maps?q=Mendoza+5130"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block border-b border-[#2c2c2c] text-xs uppercase tracking-[0.2em] text-[#2c2c2c] hover:opacity-70 md:mt-6 md:text-sm"
        >
          Ver ubicación
        </a>
      </div>
    </div>
  </div>
</motion.section>



{/* FRASE */}
<section className="bg-[#f6f3ee] px-6 py-20 text-center md:py-24">
  <div className="mb-6 flex justify-center">
    <Heart className="text-[#8a847d]" size={28} strokeWidth={1.5} />
  </div>

  <h2 className="text-2xl font-light tracking-[0.1em] md:text-3xl">
    “En esta vida todo tiene su momento;
    <span className="mt-2 block text-[#8a847d]">
      hay un tiempo para todo:”
    </span>
  </h2>

  <p className="mt-4 text-sm text-[#8a847d] tracking-wider">
    Eclesiastés 3:1
  </p>

  <div className="mt-8 flex justify-center">
    <div className="h-[1px] w-16 bg-[#d6d0c8]" />
  </div>
</section>

      {/* RSVP + CALENDARIO */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="bg-white px-4 py-16 text-center md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] text-[#8a847d]">
            Acompañanos
          </p>

          <h2 className="mt-4 text-[1.9rem] font-light tracking-[0.05em] md:text-[2.6rem]">
            Confirmación & Agenda
          </h2>

          <div className="mx-auto mt-6 h-[1px] w-16 bg-[#d6d0c8]" />

          <div className="mt-16 grid gap-8 md:grid-cols-2 md:gap-10">
            <div className="relative rounded-[30px] border border-[#ddd6cf] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] md:p-12">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border border-[#ddd6cf] bg-[#f6f3ee] p-4 shadow-sm">
                <Sparkles className="text-[#8a847d]" size={26} />
              </div>

              <h3 className="mt-6 text-2xl font-light">Confirmar asistencia</h3>

              <p className="mx-auto mt-4 max-w-sm text-[#6b6b6b]">
                Queremos compartir este momento con vos. Confirmá tu presencia
                para acompañarnos.
              </p>

              <button
                onClick={() => setOpen(true)}
                className="mt-8 rounded-full bg-[#2c2c2c] px-10 py-3 text-sm uppercase tracking-[0.15em] text-white transition hover:bg-[#3a3a3a]"
              >
                Confirmar
              </button>
            </div>

            <div className="relative rounded-[30px] border border-[#ddd6cf] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] md:p-12">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border border-[#ddd6cf] bg-[#f6f3ee] p-4 shadow-sm">
                <CalendarDays className="text-[#8a847d]" size={26} />
              </div>

              <h3 className="mt-6 text-2xl font-light">Guardar la fecha</h3>

              <p className="mx-auto mt-4 max-w-sm text-[#6b6b6b]">
                Agendá este día tan especial para no perderte ningún momento.
              </p>

              <button
                onClick={handleAddToCalendar}
                className="mt-8 rounded-full border border-[#cfc8c0] px-10 py-3 text-sm uppercase tracking-[0.15em] transition hover:bg-[#2c2c2c] hover:text-white"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      </motion.section>

     <section className="relative flex items-center justify-center overflow-hidden px-6 py-20 md:py-28">
  <div className="absolute inset-0 bg-[#f6f3ee]" />

  <div className="relative w-full max-w-sm rounded-3xl border border-[#e5e0d8] bg-white/50 px-6 py-10 text-center shadow-xl backdrop-blur-md md:px-8 md:py-12">
    <h2 className="mb-6 text-xl font-light uppercase tracking-[0.25em] text-[#2c2c2c] md:mb-8 md:text-2xl">
      Información de la tarjeta
    </h2>

    {(() => {
      const phone = "5493416435372";
      const message =
        "Hola! cuál es el valor actualizado de la tarjeta?";

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`;

      return (
        <>
          <div className="space-y-4 text-sm leading-relaxed text-[#4a4a4a] md:text-base">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#5f6b75]">
                Valor actual
              </p>
              <p>
                El valor de la tarjeta es de{" "}
                <span className="text-base font-medium text-[#2c2c2c]">
                  $135.000 (valor estimado según cotización del dólar)
                </span>
              </p>
            </div>

            <div className="mx-auto h-px w-12 bg-[#d6d0c8]" />

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#5f6b75]">
                Actualización
              </p>
              <p>
                El importe se ajusta mensualmente un 4%, según el IPC del país
              </p>
            </div>

            <div className="mx-auto h-px w-12 bg-[#d6d0c8]" />

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#5f6b75]">
                Importante
              </p>
              <p>
                Antes de abonar, consultar el valor actualizado con los novios
              </p>
            </div>

            <div className="mx-auto h-px w-12 bg-[#d6d0c8]" />
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-[#2c2c2c] px-8 py-3 text-xs uppercase tracking-[0.25em] text-white shadow-md transition hover:bg-[#3a3a3a]"
          >
            CONSULTAR POR WHATSAPP
          </a>
        </>
      );
    })()}

    <p className="mt-6 text-sm italic text-[#8a847d] md:mt-8">
      Nos encantaría contar con tu presencia en este día tan especial.
    </p>
  </div>
</section>


{/* REGALOS */}
{/* REGALOS */}
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  viewport={{ once: true }}
  className="relative bg-white px-6 py-20 text-center md:py-28"
>
  <div className="mx-auto max-w-2xl">
    
    {/* ICONO */}
    <div className="mb-6 flex justify-center">
      <div className="rounded-full border border-[#d6d0c8] p-4">
        <Gift className="text-[#8a847d]" size={26} strokeWidth={1.5} />
      </div>
    </div>

    {/* TÍTULO */}
    <h2 className="text-2xl font-light uppercase tracking-[0.35em] text-[#2c2c2c] md:text-3xl">
      Regalos
    </h2>

    {/* TEXTO */}
    <p className="mx-auto mt-6 max-w-[620px] text-sm leading-7 text-[#4a4a4a] md:text-base">
      Nuestro mejor regalo es que puedas acompañarnos en este día tan especial.
      Pero si deseás hacernos un obsequio, podés colaborar con nuestra luna de miel.
    </p>

    {/* BOTÓN */}
    <button
      onClick={() => setOpenCBU(true)}
      className="mt-10 inline-block rounded-full bg-[#2c2c2c] px-10 py-4 text-sm uppercase tracking-[0.25em] text-white shadow-md transition hover:bg-[#3a3a3a]"
    >
      HACER UN REGALO
    </button>

    {/* DIVIDER */}
    <div className="mx-auto mt-10 h-px w-20 bg-[#d6d0c8]" />

    {/* TEXTO FINAL */}
    <p className="mt-6 text-sm leading-7 text-[#4a4a4a] md:text-base">
      Gracias por ser parte de este momento tan importante para nosotros.
    </p>
  </div>
</motion.section>

      {/* DRESS CODE */}
      <section className="relative flex items-center justify-center overflow-hidden px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[#f6f3ee]" />

        <div className="relative w-full max-w-2xl rounded-3xl border border-[#e5e0d8] bg-white/60 px-8 py-12 text-center shadow-xl backdrop-blur-md md:px-12 md:py-16">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full border border-[#d6d0c8] p-5">
              <Gem className="text-[#8a847d]" size={30} strokeWidth={1.2} />
            </div>
          </div>

          <h2 className="text-2xl font-light uppercase tracking-[0.4em] text-[#2c2c2c] md:text-3xl">
            Dress Code
          </h2>

          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-[#8a847d]">
            Formal
          </p>

          <div className="mx-auto mt-8 h-px w-24 bg-[#d6d0c8]" />
        </div>
      </section>

      {/* FOTOS */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative bg-white px-4 py-16 text-center md:px-6 md:py-24"
      >
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full border border-[#d6d0c8] p-4">
              <Camera className="text-[#8a847d]" size={26} strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="text-2xl font-light uppercase tracking-[0.35em] text-[#2c2c2c] md:text-3xl">
            Queremos ver tus fotos
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#4a4a4a] md:text-base">
            Podés subir todas las fotos del gran día a nuestro álbum compartido
            para revivir juntos cada momento especial.
          </p>

          <a
            href="https://drive.google.com/drive/folders/1a6xSUMs7mD3iguaQkZimiUzp92IbdeRr?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block rounded-full bg-[#2c2c2c] px-10 py-4 text-sm uppercase tracking-[0.25em] text-white shadow-md transition hover:bg-[#3a3a3a]"
          >
            Ir al álbum
          </a>
        </div>
      </motion.section>

      {/* CIERRE */}
      <section className="bg-[#ece7e1] py-16 text-center">
        <p className="text-lg font-light">
          ¡Gracias por acompañarnos en este momento tan importante!
        </p>
      </section>

      {/* MODAL RSVP */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 text-center shadow-2xl md:p-8">
            <button
              onClick={handleCloseRsvp}
              className="absolute right-5 top-4 text-xl text-gray-400 hover:text-black"
            >
              ×
            </button>

            <h2 className="text-xl font-medium uppercase tracking-[0.2em]">
              Confirmá tu asistencia
            </h2>

            <p className="mt-2 text-sm text-[#6b6b6b]">
              Seleccioná tu nombre y elegí el menú.
            </p>

            <div className="mt-8 space-y-6 text-sm">
              <div className="text-center" ref={suggestionsRef}>
                <label className="block text-xs uppercase text-[#8a847d]">
                  Nombre y apellido
                </label>

                <div className="relative mt-3">
                  <input
                    type="text"
                    placeholder={
                      loadingGuests
                        ? "Cargando invitados..."
                        : "Ingresá tu nombre"
                    }
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      setShowSuggestions(true);
                      setRsvpError("");
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full rounded-full border border-[#ddd6cf] px-4 py-3 text-center outline-none focus:border-[#2c2c2c]"
                    disabled={loadingGuests || sending}
                    autoComplete="off"
                    autoCapitalize="words"
                    autoCorrect="off"
                    spellCheck={false}
                  />

                  {showSuggestions && filteredGuests.length > 0 && (
                    <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-[#ddd6cf] bg-white text-left shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
                      <div className="max-h-56 overflow-y-auto py-1">
                        {filteredGuests.map((guest, index) => (
                          <button
                            key={`${guest}-${index}`}
                            type="button"
                            onClick={() => handleSelectGuest(guest)}
                            className="block w-full px-4 py-3 text-left text-sm text-[#2c2c2c] transition hover:bg-[#f6f3ee]"
                          >
                            {guest}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!loadingGuests && nombre.trim() && exactGuestName && (
                  <p className="mt-3 text-xs text-green-700">
                    Invitado encontrado:{" "}
                    <span className="font-medium">{exactGuestName}</span>
                  </p>
                )}

                {!loadingGuests &&
                  nombre.trim() &&
                  !exactGuestName &&
                  filteredGuests.length === 0 && (
                    <p className="mt-3 text-xs text-[#8a847d]">
                      No encontramos coincidencias.
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-xs uppercase text-[#8a847d]">
                  Asistencia
                </label>

                <div className="mt-3 flex flex-col items-center gap-3">
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="asistencia"
      checked={asistencia === "Si"}
      onChange={() => setAsistencia("Si")}
      disabled={sending}
    />
    Voy a asistir
  </label>

  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="asistencia"
      checked={asistencia === "No"}
     onChange={() => {
  setAsistencia("No");
  setMenu("");
  setTieneAlergia(""); // ← vacío
  setAlergiaDetalle("");
}}
      disabled={sending}
    />
    No podré asistir
  </label>

  {asistencia === "No" && (
    <div className="w-full text-center">
      <p className="text-xs leading-relaxed text-[#8a847d]">
        Si no asistís, solo presioná{" "}
        <span className="font-medium">Confirmar</span>.
      </p>
    </div>
  )}
</div>
              </div>

              <div>
                <label className="block text-xs uppercase text-[#8a847d]">
                  Menú
                </label>

                <select
                  value={menu}
                  onChange={(e) => setMenu(e.target.value)}
                  disabled={asistencia === "No" || sending}
                  className="mt-3 w-full rounded-full border border-[#ddd6cf] px-4 py-3 text-center outline-none disabled:cursor-not-allowed disabled:bg-[#f3f1ed]"
                >
                  <option value="">Seleccioná una opción</option>
                  <option value="Menú común">Menú común</option>
                  <option value="Menú vegetariano">Menú vegetariano</option>
                  <option value="Menú vegano">Menú vegano</option>
                  <option value="Menú celíaco">Menú celíaco</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-[#8a847d]">
                  ¿Tenés alguna alergia o restricción alimentaria?
                </label>

                <div className="mt-3 flex flex-col items-center space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="alergia"
                      checked={tieneAlergia === "No"}
                      onChange={() => {
                        setTieneAlergia("No");
                        setAlergiaDetalle("");
                      }}
                      disabled={asistencia === "No" || sending}
                    />
                    No
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="alergia"
                      checked={tieneAlergia === "Si"}
                      onChange={() => setTieneAlergia("Si")}
                      disabled={asistencia === "No" || sending}
                    />
                    Sí
                  </label>
                </div>
              </div>

              {asistencia === "Si" && tieneAlergia === "Si" && (
                <div>
                  <label className="block text-xs uppercase text-[#8a847d]">
                    ¿A qué sos alérgico/a?
                  </label>

                  <input
                    type="text"
                    value={alergiaDetalle}
                    onChange={(e) => setAlergiaDetalle(e.target.value)}
                    placeholder="Ej: frutos secos, lactosa, mariscos"
                    disabled={sending}
                    className="mt-3 w-full rounded-full border border-[#ddd6cf] px-4 py-3 text-center outline-none focus:border-[#2c2c2c]"
                  />
                </div>
              )}

              {sending && sendingText && (
                <p className="text-xs text-[#8a847d]">{sendingText}</p>
              )}

              {rsvpError && <p className="text-sm text-red-600">{rsvpError}</p>}

              {rsvpMessage && (
                <p className="text-sm text-green-700">{rsvpMessage}</p>
              )}

              <button
                onClick={handleSubmitRsvp}
                disabled={sending || loadingGuests}
                className="mt-4 w-full rounded-full bg-[#2c2c2c] py-3 uppercase tracking-[0.2em] text-white transition hover:bg-[#3a3a3a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CBU */}
      {openCBU && (
        <div
          onClick={() => setOpenCBU(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl md:p-8"
          >
            <button
              onClick={() => setOpenCBU(false)}
              className="absolute right-5 top-4 text-xl text-gray-400 hover:text-black"
            >
              ×
            </button>

            <h2 className="text-lg font-medium uppercase tracking-[0.25em]">
              Datos bancarios
            </h2>

            <p className="mt-2 text-sm text-[#6b6b6b]">
              Podés realizar la transferencia a la siguiente cuenta:
            </p>

            <div className="mt-6 space-y-4 text-sm text-[#4a4a4a]">
              <div>
                <p className="text-xs uppercase text-[#8a847d]">Titular</p>
                <p className="font-medium text-[#2c2c2c]">
                  Pérez Guzmán Jimena
                </p>
              </div>

               <div>
                <p className="text-xs uppercase text-[#8a847d]">CUIT/CUIL</p>
                <p className="font-medium text-[#2c2c2c]">
                  27427038489
                </p>
              </div>

               <div>
                <p className="text-xs uppercase text-[#8a847d]">Entidad</p>
                <p className="font-medium text-[#2c2c2c]">
                  Nuevo Banco de Santa Fe
                </p>
              </div>

              

              <div>
                <p className="text-xs uppercase text-[#8a847d]">Alias</p>
                <p className="font-medium">jimena.perezguzman</p>
              </div>
            </div>

            <button
              onClick={handleCopyAlias}
              className="mt-6 rounded-full bg-[#2c2c2c] px-8 py-3 text-xs uppercase tracking-[0.2em] text-white"
            >
              {copiado ? "Copiado ✔" : "Copiar alias"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function handleAddToCalendar() {
  const url = new URL("https://calendar.google.com/calendar/render");

  url.searchParams.append("action", "TEMPLATE");
  url.searchParams.append("text", "Casamiento de Jime y Joel");
  url.searchParams.append("dates", "20270828T180000/20270829T040000");
  url.searchParams.append(
    "details",
    "Ceremonia 18:00 hs - Primera Iglesia Bautista, San Martín 1558. Celebración desde las 21 hs en Nebraska."
  );
  url.searchParams.append("location", "Mendoza 5130, Rosario, Argentina");

  window.open(url.toString(), "_blank");
}

function calculateTimeLeft(weddingDate: Date) {
  const difference = weddingDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}