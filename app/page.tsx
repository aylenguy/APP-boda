"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Heart,
  Gift,
  Camera,
  Sparkles,
  Gem,
} from "lucide-react";

const RSVP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynxNkLJtDvFrMC1WbsJ-NnAZTLmXqmYGueA6LOMfcL9YawARDzsLIvCBgi9_JcMCrE0A/exec";

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
  const [sending, setSending] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpError, setRsvpError] = useState("");

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
    setRsvpMessage("");
    setRsvpError("");
  };

  const handleCloseRsvp = () => {
    setOpen(false);
    setRsvpMessage("");
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

    const nameExists = normalizedGuestNames.includes(normalizeText(trimmedName));

    if (!nameExists) {
      setRsvpError("Ese nombre no figura en la lista de invitados.");
      return;
    }

    if (asistencia === "Si" && !menu) {
      setRsvpError("Seleccioná una opción de menú.");
      return;
    }

    if (!RSVP_SCRIPT_URL || RSVP_SCRIPT_URL.includes("PEGÁ_ACÁ")) {
      setRsvpError("Falta configurar la URL del Apps Script.");
      return;
    }

    try {
      setSending(true);

      const res = await fetch(RSVP_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          nombre: trimmedName,
          asistencia,
          menu: asistencia === "No" ? "" : menu,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setRsvpMessage("¡Gracias! Tu confirmación fue enviada correctamente.");
        setRsvpError("");
        setTimeout(() => {
          resetRsvpForm();
          setOpen(false);
        }, 1800);
      } else {
        setRsvpError(data.message || "No se pudo enviar la confirmación.");
      }
    } catch (error) {
      console.error(error);
      setRsvpError("Ocurrió un error al enviar la confirmación.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#1a1a1a]">
      {/* HERO */}
      <section className="relative h-[82vh] min-h-[620px] w-full overflow-hidden bg-black md:h-[88vh] xl:h-[82vh]">
        <motion.img
          src="/images/hero-boda.jpeg?v=2"
          alt="Jime y Joel"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover object-[80%_center] md:object-center"
        />

        <div className="absolute inset-0 bg-white/25 md:bg-white/45" />

        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-[680px]"
          >
            <p className="text-[13px] uppercase tracking-[0.35em] text-[#8a847d] md:text-[15px]">
              ¡Nos casamos!
            </p>

            <h1 className="mt-6">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="block text-4xl font-light tracking-[0.05em] md:text-6xl xl:text-[5.2rem]"
              >
                Jime
              </motion.span>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="block text-base text-[#8a847d] md:text-xl"
              >
                &
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="block text-4xl font-light tracking-[0.05em] md:text-6xl xl:text-[5.2rem]"
              >
                Joel
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-10 md:mt-14"
            >
              <span className="inline-block border border-[#d6d0c8] bg-white/80 px-5 py-3 text-xs tracking-[0.22em] md:px-8 md:py-4 md:text-sm">
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
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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

          <div className="relative mb-12 flex flex-col items-start justify-between md:mb-16 md:flex-row md:items-center">
            <div className="absolute left-3 h-3 w-3 -translate-x-1/2 rounded-full border border-white bg-[#cfc8c0] shadow md:left-1/2 md:h-4 md:w-4" />

            <div className="ml-8 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-[#ddd6cf] bg-white p-4 text-left shadow-sm md:ml-0 md:w-[45%] md:max-w-none md:p-8 md:text-right">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#8a847d] md:text-[11px]">
                Ceremonia
              </p>

              <h3 className="mt-2 text-xl font-light md:mt-3 md:text-2xl">
                18:00 hs
              </h3>

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
            </div>

            <div className="hidden md:block md:w-[45%]" />
          </div>

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
          Sean parte de nuestra
          <span className="mt-2 block text-[#8a847d]">historia de amor</span>
        </h2>

        <div className="mt-8 flex justify-center">
          <div className="h-[1px] w-16 bg-[#d6d0c8]" />
        </div>
      </section>

      {/* RSVP + CALENDARIO */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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

      {/* TARJETA */}
      <section className="relative flex items-center justify-center overflow-hidden px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[#f6f3ee]" />

        <div className="relative w-full max-w-md rounded-3xl border border-[#e5e0d8] bg-white/50 px-8 py-12 text-center shadow-xl backdrop-blur-md md:px-10 md:py-14">
          <h2 className="mb-8 text-2xl font-light uppercase tracking-[0.25em] text-[#2c2c2c] md:mb-10 md:text-3xl">
            Información de la tarjeta
          </h2>

          <div className="space-y-5 text-sm leading-relaxed text-[#4a4a4a] md:text-base">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#5f6b75]">
                Valor actual
              </p>
              <p>
                El valor de la tarjeta es de{" "}
                <span className="text-base font-medium text-[#2c2c2c]">
                  $95 dólares (dólar oficial, cotización del día)
                </span>
              </p>
            </div>

            <div className="mx-auto h-px w-16 bg-[#d6d0c8]" />

            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#5f6b75]">
                Actualización
              </p>
              <p>Aumenta según el IPC del país</p>
            </div>

            <div className="mx-auto h-px w-16 bg-[#d6d0c8]" />
          </div>

          <button
            onClick={() => setOpenCBU(true)}
            className="mt-5 inline-block rounded-full bg-[#2c2c2c] px-10 py-4 text-sm uppercase tracking-[0.25em] text-white shadow-md transition hover:bg-[#3a3a3a]"
          >
            Abonar tarjeta
          </button>

          <p className="mt-8 text-sm italic text-[#8a847d] md:mt-10">
            Nos encantaría contar con tu presencia en este día tan especial.
          </p>
        </div>
      </section>

      {/* REGALOS */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative bg-white px-4 py-16 text-center md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-2xl">
          <div className="my-6 flex justify-center">
            <div className="rounded-full border border-[#d6d0c8] p-4">
              <Gift className="text-[#8a847d]" size={26} strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="text-2xl font-light uppercase tracking-[0.35em] text-[#2c2c2c] md:text-3xl">
            Regalos
          </h2>

          <p className="mx-auto mt-6 max-w-[620px] text-sm leading-7 text-[#4a4a4a] md:text-base">
            Nuestro mejor regalo es que puedas acompañarnos en este día tan
            especial. Pero si deseás hacernos un obsequio, podés colaborar con
            nuestra luna de miel.
          </p>

          <button
            onClick={() => setOpenCBU(true)}
            className="mt-10 inline-block rounded-full bg-[#2c2c2c] px-10 py-4 text-sm uppercase tracking-[0.25em] text-white shadow-md transition hover:bg-[#3a3a3a]"
          >
            Hacer un regalo
          </button>

          <div className="mx-auto mt-10 h-px w-20 bg-[#d6d0c8]" />

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
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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
            href="#"
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
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl md:p-8">
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
              <div className="text-center">
                <label className="block text-xs uppercase text-[#8a847d]">
                  Nombre y apellido
                </label>

                <input
                  list="guest-list"
                  type="text"
                  placeholder={
                    loadingGuests
                      ? "Cargando invitados..."
                      : "Ingresá tu nombre"
                  }
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-3 w-full rounded-full border border-[#ddd6cf] px-4 py-3 text-center outline-none focus:border-[#2c2c2c]"
                  disabled={loadingGuests || sending}
                />

                <datalist id="guest-list">
                  {guestNames.map((guest, index) => (
                    <option key={`${guest}-${index}`} value={guest} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs uppercase text-[#8a847d]">
                  Asistencia
                </label>

                <div className="mt-3 flex flex-col items-center space-y-3">
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
                      }}
                      disabled={sending}
                    />
                    No podré asistir
                  </label>
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
                  <option value="Carne">Carne</option>
                  <option value="Vegetariano">Vegetariano</option>
                  <option value="Vegano">Vegano</option>
                </select>
              </div>

              {rsvpError && (
                <p className="text-sm text-red-600">{rsvpError}</p>
              )}

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
  url.searchParams.append(
    "dates",
    "20270828T180000/20270829T040000"
  );
  url.searchParams.append(
    "details",
    "Ceremonia 18:00 hs - Primera Iglesia Bautista, San Martín 1558. Celebración desde las 21 hs en Nebraska."
  );
  url.searchParams.append(
    "location",
    "Mendoza 5130, Rosario, Argentina"
  );

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