"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Heart,
  Gift,
  Camera,
  Sparkles,
  Diamond,
  Music,
  Gem ,
  Baby
} from "lucide-react";


export default function Home() {
  const weddingDate = new Date("2027-08-28T18:00:00");

   const [open, setOpen] = useState(false) // 👈 ACÁ
   const [openCBU, setOpenCBU] = useState(false)
   const [copiado, setCopiado] = useState(false)

  const calculateTimeLeft = () => {
    const difference = weddingDate.getTime() - new Date().getTime();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };


  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const countdownItems = [
    { key: "days", label: "días" },
    { key: "hours", label: "hs" },
    { key: "minutes", label: "min" },
    { key: "seconds", label: "seg" },
  ] as const;

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#1a1a1a]">

      {/* HERO */}
<motion.section
  initial={{ opacity: 0, scale: 1.05 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1.2, ease: "easeOut" }}
  className="relative h-[75vh] md:h-[92vh] overflow-hidden"
>

  <Image
    src="/images/hero-boda.jpeg"
    alt="boda"
    fill
    className="object-cover object-[80%_45%] md:object-center scale-110 md:scale-100"
  />

  {/* OVERLAY */}
  <div className="absolute inset-0 bg-white/40 md:bg-white/50" />

  {/* CONTENIDO */}
  <div className="relative flex h-full items-center justify-center px-4 md:px-6 text-center">
    
    <div className="max-w-xl mx-auto">

      {/* TEXTO */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-[15px] md:text-[16px] tracking-[0.4em] md:tracking-[0.5em] uppercase text-[#8a847d]"
      >
        ¡Nos casamos!
      </motion.p>

      {/* NOMBRES */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 space-y-2"
      >
        <span className="block text-4xl md:text-7xl font-light tracking-[0.05em]">
          Jimena
        </span>

        <span className="block text-lg md:text-2xl text-[#8a847d]">
          &
        </span>

        <span className="block text-4xl md:text-7xl font-light tracking-[0.05em]">
          Joel
        </span>
      </motion.h1>

      {/* FECHA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-12 md:mt-20"
      >
        <span className="border border-[#d6d0c8] px-6 md:px-8 py-3 md:py-5 text-sm md:text-base tracking-[0.25em] md:tracking-[0.3em] bg-white/80 inline-block">
          28 · 08 · 2027
        </span>
      </motion.div>

    </div>
  </div>

</motion.section>



      {/* COUNTDOWN */}
    <section className="bg-[#f6f3ee] py-16 md:py-20 px-4 md:px-6 text-center">

  {/* TITULO */}
  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#8a847d]">
    Falta para el gran día
  </p>

  {/* CONTADOR */}
  <div className="mt-8 md:mt-10 flex justify-center items-center gap-3 md:grid md:grid-cols-4 md:gap-6 max-w-4xl mx-auto">

    {countdownItems.map((item) => (
      <div
        key={item.key}
        className="bg-white border border-[#ddd6cf] rounded-xl md:rounded-2xl px-3 py-4 md:py-6 shadow-sm md:shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-center min-w-[65px] md:min-w-0"
      >
        {/* NUMERO */}
        <p className="text-xl md:text-3xl font-light">
          {timeLeft ? timeLeft[item.key] : "0"}
        </p>

        {/* LABEL */}
        <p className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#8a847d] mt-1 md:mt-2">
          {item.label}
        </p>
      </div>
    ))}

  </div>

</section>

 <motion.section
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: true }}
  className="bg-white py-16 md:py-24 px-4 md:px-6 text-center"
>

  {/* TITULO */}
  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#8a847d]">
    Itinerario
  </p>

  <h2 className="text-2xl md:text-4xl font-light mt-4 tracking-[0.05em]">
    Nuestro gran día
  </h2>

  {/* CONTENEDOR */}
  <div className="relative mt-12 md:mt-20 max-w-4xl mx-auto">

    {/* LINEA */}
    <div className="absolute left-4 md:left-1/2 top-0 h-full w-[1px] bg-[#d6d0c8] md:-translate-x-1/2" />

    {/* ===== CEREMONIA ===== */}
    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between mb-12 md:mb-16">

      {/* PUNTO */}
      <div className="absolute left-4 md:left-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#cfc8c0] border border-white shadow -translate-x-1/2" />

      {/* CARD */}
      <div className="ml-10 md:ml-0 w-full md:w-[45%] bg-white p-6 md:p-8 rounded-2xl border border-[#ddd6cf] shadow-sm text-left md:text-right">

        <p className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#8a847d]">
          Ceremonia
        </p>

        <h3 className="text-xl md:text-2xl font-light mt-2 md:mt-3">
          18:00 hs
        </h3>

        <p className="mt-3">Primera Iglesia Bautista</p>
        <p className="text-sm text-[#6b6b6b]">San Martín 1558</p>

        <a
          href="https://www.google.com/maps?q=San+Martin+1558"
          target="_blank"
          className="inline-block mt-4 md:mt-6 text-xs md:text-sm uppercase tracking-[0.2em] text-[#2c2c2c] border-b border-[#2c2c2c] hover:opacity-70"
        >
          Ver ubicación
        </a>
      </div>

      {/* espacio desktop */}
      <div className="hidden md:block md:w-[45%]" />
    </div>

    {/* ===== CELEBRACION ===== */}
    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">

      {/* PUNTO */}
      <div className="absolute left-4 md:left-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#cfc8c0] border border-white shadow -translate-x-1/2" />

      {/* espacio desktop */}
      <div className="hidden md:block md:w-[45%]" />

      {/* CARD */}
      <div className="ml-10 md:ml-0 w-full md:w-[45%] bg-white p-6 md:p-8 rounded-2xl border border-[#ddd6cf] shadow-sm text-left md:text-left">

        <p className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#8a847d]">
          Celebración
        </p>

        <h3 className="text-xl md:text-2xl font-light mt-2 md:mt-3">
          21:00 hs — 04:00 hs
        </h3>

        <p className="mt-3">Nebraska</p>
        <p className="text-sm text-[#6b6b6b]">Mendoza 5130</p>

        <a
          href="https://www.google.com/maps?q=Mendoza+5130"
          target="_blank"
          className="inline-block mt-4 md:mt-6 text-xs md:text-sm uppercase tracking-[0.2em] text-[#2c2c2c] border-b border-[#2c2c2c] hover:opacity-70"
        >
          Ver ubicación
        </a>
      </div>
    </div>

  </div>

</motion.section>
      {/* FRASE */}
      <section className="bg-[#f6f3ee] py-24 text-center px-6">
        <div className="flex justify-center mb-6">
          <Heart className="text-[#8a847d]" size={28} strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl md:text-3xl font-light tracking-[0.1em]">
          Sean parte de nuestra
          <span className="block mt-2 text-[#8a847d]">
            historia de amor
          </span>
        </h2>

        <div className="mt-8 flex justify-center">
          <div className="w-16 h-[1px] bg-[#d6d0c8]" />
        </div>
      </section>

      {/* RSVP */}
     {/* RSVP + CALENDARIO */}
<section className="bg-white py-28 px-6">

  <div className="max-w-5xl mx-auto text-center">

    {/* titulo */}
    <p className="text-[11px] uppercase tracking-[0.5em] text-[#8a847d]">
      Acompañanos
    </p>

    <h2 className="text-3xl md:text-4xl font-light mt-4 tracking-[0.05em]">
      Confirmación & Agenda
    </h2>

    {/* linea */}
    <div className="w-16 h-[1px] bg-[#d6d0c8] mx-auto mt-6" />

    {/* grid */}
    <div className="mt-16 grid md:grid-cols-2 gap-10">

      {/* CONFIRMAR */}
      <div className="relative bg-white p-12 rounded-[30px] border border-[#ddd6cf] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">

        {/* icono flotante */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#f6f3ee] border border-[#ddd6cf] p-4 rounded-full shadow-sm">
          <Sparkles className="text-[#8a847d]" size={26} />
        </div>

        <h3 className="text-2xl font-light mt-6">
          Confirmar asistencia
        </h3>

        <p className="mt-4 text-[#6b6b6b] max-w-sm mx-auto">
          Queremos compartir este momento con vos. Confirmá tu presencia para acompañarnos.
        </p>

       <button
  onClick={() => setOpen(true)}
  className="mt-8 bg-[#2c2c2c] text-white px-10 py-3 rounded-full tracking-[0.15em] uppercase text-sm hover:bg-[#3a3a3a] transition"
>
  Confirmar
</button>
{open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

    {/* CARD */}
    <div className="relative w-[90%] max-w-md bg-white rounded-3xl p-8 shadow-2xl text-center">

      {/* CERRAR */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-4 right-5 text-gray-400 hover:text-black text-xl"
      >
        ×
      </button>

      {/* TITULO */}
      <h2 className="text-xl tracking-[0.2em] uppercase font-medium">
        Confirmá tu asistencia
      </h2>

      <p className="text-sm text-[#6b6b6b] mt-2">
        Seleccioná tu nombre y elegí el menú.
      </p>

      {/* FORM */}
      <div className="mt-8 space-y-6 text-sm">

        {/* INPUT */}
        <div className="text-center">
          <label className="text-xs text-[#8a847d] uppercase block">
            Nombre y apellido
          </label>
          <input
            type="text"
            placeholder="Ingresá tu nombre"
            className="w-full mt-3 border border-[#ddd6cf] rounded-full px-4 py-3 text-center outline-none focus:border-[#2c2c2c]"
          />
        </div>

        {/* RADIO */}
        <div>
          <label className="text-xs text-[#8a847d] uppercase block">
            Asistencia
          </label>

          <div className="mt-3 space-y-3 flex flex-col items-center">
            <label className="flex items-center gap-2">
              <input type="radio" name="asistencia" defaultChecked />
              Voy a asistir
            </label>

            <label className="flex items-center gap-2">
              <input type="radio" name="asistencia" />
              No podré asistir
            </label>
          </div>
        </div>

        {/* SELECT */}
        <div>
          <label className="text-xs text-[#8a847d] uppercase block">
            Menú
          </label>

          <select className="w-full mt-3 border border-[#ddd6cf] rounded-full px-4 py-3 text-center outline-none">
            <option>Seleccioná una opción</option>
            <option>Carne</option>
            <option>Vegetariano</option>
            <option>Vegano</option>
          </select>
        </div>

        {/* BOTON */}
        <button className="w-full mt-4 bg-[#2c2c2c] text-white py-3 rounded-full tracking-[0.2em] uppercase hover:bg-[#3a3a3a] transition">
          Confirmar
        </button>

      </div>

    </div>
  </div>
)}
      </div>

      {/* CALENDARIO */}
      <div className="relative bg-white p-12 rounded-[30px] border border-[#ddd6cf] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">

        {/* icono flotante */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#f6f3ee] border border-[#ddd6cf] p-4 rounded-full shadow-sm">
          <CalendarDays className="text-[#8a847d]" size={26} />
        </div>

        <h3 className="text-2xl font-light mt-6">
          Guardar la fecha
        </h3>

        <p className="mt-4 text-[#6b6b6b] max-w-sm mx-auto">
          Agendá este día tan especial para no perderte ningún momento.
        </p>

        <button className="mt-8 border border-[#cfc8c0] px-10 py-3 rounded-full tracking-[0.15em] uppercase text-sm hover:bg-[#2c2c2c] hover:text-white transition">
          Agregar
        </button>
      </div>

    </div>

  </div>
</section>

<section className="relative py-36 px-6 flex justify-center items-center overflow-hidden">

  {/* FONDO */}
  <div className="absolute inset-0 bg-[#f6f3ee]" />

  {/* TARJETA */}
  <div className="relative w-full max-w-md bg-white/50 backdrop-blur-md rounded-3xl px-10 py-14 text-center shadow-xl border border-[#e5e0d8]">

    {/* TITULO */}
    <h2 className="text-[#2c2c2c] text-2xl md:text-3xl font-light tracking-[0.25em] uppercase mb-10">
      Información de la tarjeta
    </h2>

    {/* BLOQUE */}
    <div className="space-y-5 text-[#4a4a4a] text-sm md:text-base leading-relaxed">

      {/* ITEM */}
      <div>
        <p className="text-[#5f6b75] text-xs tracking-[0.2em] uppercase mb-3">
          Valor actual
        </p>
        <p>
          El valor de la tarjeta es de{" "}
          <span className="text-[#2c2c2c] font-medium text-base">
            $109.000
          </span>, vigente hasta el viernes 27 de marzo.
        </p>
      </div>

      <div className="w-16 h-px bg-[#d6d0c8] mx-auto" />

      {/* ITEM */}
      <div>
        <p className="text-[#5f6b75] text-xs tracking-[0.2em] uppercase mb-3">
          Actualización mensual
        </p>
        <p>
          Los valores se actualizarán mensualmente de acuerdo al índice inflacionario del país.
        </p>
      </div>

      <div className="w-16 h-px bg-[#d6d0c8] mx-auto" />

      {/* ITEM */}
      <div>
        <p className="text-[#5f6b75] text-xs tracking-[0.2em] uppercase mb-3">
          Importante
        </p>
        <p>
          Podés realizar el pago de tu tarjeta hasta el miércoles 26 de agosto.
        </p>
      </div>

    </div>

    {/* BOTÓN */}
    <button
  onClick={() => setOpenCBU(true)}
  className="mt-5 inline-block bg-[#2c2c2c] text-white px-10 py-4 rounded-full text-sm uppercase tracking-[0.25em] shadow-md hover:bg-[#3a3a3a] transition"
>
  Abonar tarjeta
</button>

    {/* TEXTO FINAL */}
    <p className="mt-10 text-[#8a847d] text-sm italic">
      Nos encantaría contar con tu presencia en este día tan especial.
    </p>

  </div>

  {openCBU && (
  <div
    onClick={() => setOpenCBU(false)}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
  >
    {/* CARD */}
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-[90%] max-w-md bg-white rounded-3xl p-8 shadow-2xl text-center"
    >

      {/* CERRAR */}
      <button
        onClick={() => setOpenCBU(false)}
        className="absolute top-4 right-5 text-gray-400 hover:text-black text-xl"
      >
        ×
      </button>

      {/* TITULO */}
      <h2 className="text-lg tracking-[0.25em] uppercase font-medium">
        Datos bancarios
      </h2>

      <p className="text-sm text-[#6b6b6b] mt-2">
        Podés realizar la transferencia a la siguiente cuenta:
      </p>

      {/* DATOS */}
      <div className="mt-6 space-y-4 text-sm text-[#4a4a4a]">

        <div>
          <p className="text-xs uppercase text-[#8a847d]">Titular</p>
          <p className="font-medium text-[#2c2c2c]">Juan Pérez</p>
        </div>

        <div>
          <p className="text-xs uppercase text-[#8a847d]">Banco</p>
          <p>Banco Nación</p>
        </div>

        <div>
          <p className="text-xs uppercase text-[#8a847d]">CBU</p>
          <p className="font-mono text-[#2c2c2c]">
            0000003100000001234567
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-[#8a847d]">Alias</p>
          <p className="font-medium">boda.jime.joel</p>
        </div>

      </div>

      {/* BOTON COPIAR */}
     <button
  onClick={() => {
    navigator.clipboard.writeText("0000003100000001234567");
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }}
  className="mt-6 bg-[#2c2c2c] text-white px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em]"
>
  {copiado ? "Copiado ✔" : "Copiar CBU"}
</button>

    </div>
  </div>
)}
</section>

<section className="relative py-32 px-6 text-center overflow-hidden">

  {/* FONDO */}
  <div className="absolute inset-0 bg-white" />

  {/* CONTENIDO */}
  <div className="relative max-w-xl mx-auto">


{/* ICONO */}
    <div className="flex justify-center my-6">
      <div className="border border-[#d6d0c8] rounded-full p-4">
        <Gift className="text-[#8a847d]" size={26} strokeWidth={1.5} />
      </div>
    </div>
    {/* TITULO */}
    <h2 className="text-[#2c2c2c] text-2xl md:text-3xl tracking-[0.35em] uppercase font-light">
      Regalos
    </h2>

    

    {/* TEXTO */}
    <p className="mt-6 text-[#4a4a4a] text-sm md:text-base leading-7">
      Nuestro mejor regalo es que puedas acompañarnos en este día tan especial.
      Pero si deseás hacernos un obsequio, podés colaborar con nuestra luna de miel.
    </p>

    {/* BOTÓN */}
    <a
      href="#"
      className="mt-10 inline-block bg-[#2c2c2c] text-white px-10 py-4 rounded-full text-sm uppercase tracking-[0.25em] shadow-md hover:bg-[#3a3a3a] transition"
    >
      Hacer un regalo
    </a>

    {/* DIVISOR */}
    <div className="w-20 h-px bg-[#d6d0c8] mx-auto mt-10" />

    {/* TEXTO FINAL */}
    <p className="mt-6 text-[#4a4a4a] text-sm md:text-base leading-7">
      Gracias por ser parte de este momento tan importante para nosotros.
    </p>

  </div>
</section>

<section className="relative py-36 px-6 flex justify-center items-center">

  {/* FONDO */}
  <div className="absolute inset-0 bg-[#f6f3ee]" />

  {/* TARJETA */}
  <div className="relative w-full max-w-2xl bg-white/60 backdrop-blur-md rounded-3xl px-12 py-16 text-center shadow-xl border border-[#e5e0d8]">

    {/* ICONO */}
    <div className="flex justify-center mb-8">
      <div className="border border-[#d6d0c8] rounded-full p-5">
        <Gem  className="text-[#8a847d]" size={30} strokeWidth={1.2} />
      </div>
    </div>

    {/* TITULO */}
    <h2 className="text-[#2c2c2c] text-2xl md:text-3xl tracking-[0.4em] uppercase font-light">
      Dress Code
    </h2>

    {/* SUBTITULO */}
    <p className="mt-4 text-[#8a847d] text-sm tracking-[0.3em] uppercase">
      Formal
    </p>

    {/* DIVISOR */}
    <div className="w-24 h-px bg-[#d6d0c8] mx-auto mt-8" />

   
  {/* COLORES */}
<div className="mt-12">

  <p className="text-xs text-[#8a847d] tracking-[0.3em] uppercase mb-8">
    Colores no permitidos
  </p>

  <div className="grid grid-cols-4 gap-4 md:flex md:justify-center md:gap-10">

    {[
      { color: "bg-white border border-[#d6d0c8]", label: "Blanco" },
      { color: "bg-[#e8dfcf]", label: "Beige" },
      { color: "bg-[#c92a2a]", label: "Rojo" },
      { color: "bg-[#2f4f6f]", label: "Azul" },
    ].map((item, i) => (
      <div key={i} className="flex flex-col items-center">

        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full ${item.color} shadow-md`} />

        <span className="mt-2 text-[10px] md:text-xs text-[#6b6b6b] tracking-wide text-center">
          {item.label}
        </span>

      </div>
    ))}

  </div>

</div>
    {/* TEXTO */}
    <div className="mt-12 space-y-4 text-base text-[#4a4a4a] leading-relaxed max-w-lg mx-auto">


    </div>

  </div>
</section>

<section className="relative py-28 px-6 text-center overflow-hidden">

  {/* FONDO */}
  <div className="absolute inset-0 bg-white" />

  {/* CONTENIDO */}
  <div className="relative max-w-2xl mx-auto">

   <div className="flex justify-center mb-6">
  <div className="border border-[#d6d0c8] rounded-full p-4">
    <Music className="text-[#8a847d]" size={26} strokeWidth={1.5} />
  </div>
</div>

    {/* TITULO */}
 <h2 className="text-[#2c2c2c] text-2xl md:text-3xl tracking-[0.35em] uppercase font-light">
      ¿Qué canciones no pueden faltar?
    </h2>

    {/* TEXTO */}
      <p className="mt-6 text-[#4a4a4a]    text-sm md:text-base leading-7 max-w-xl mx-auto">
      Ayudanos a armar la playlist de la fiesta sugiriendo esas canciones
      que te hagan bailar y disfrutar la noche.
    </p>

    {/* BOTON */}
    <a
      href="#"
      className="mt-10 inline-block bg-[#2c2c2c] text-white px-10 py-4 rounded-full text-sm uppercase tracking-[0.25em] shadow-md hover:bg-[#3a3a3a] transition"
    >
      Sugerir canción
    </a>

  </div>
</section>

<section className="relative py-28 px-6 text-center">

  {/* FONDO */}
  <div className="absolute inset-0 bg-[#f6f3ee]" />

  {/* CONTENIDO */}
  <div className="relative max-w-xl mx-auto">

   <div className="flex justify-center mb-6">
  <div className="border border-[#d6d0c8] rounded-full p-4 flex items-center justify-center">
    <Baby className="text-[#8a847d]" size={26} strokeWidth={1.5} />
  </div>
</div>
    


    {/* TITULO */}
    <h2 className="text-[#2c2c2c] text-2xl md:text-3xl tracking-[0.35em] uppercase font-light">
      Solo adultos
    </h2>

    {/* TEXTO */}
    <p className="mt-6 text-[#4a4a4a]    text-sm md:text-base leading-7 max-w-xl mx-auto">
      Amamos a sus pequeños, pero queremos que ese día puedan relajarse
      y disfrutar plenamente de la celebración.
    </p>

  </div>
</section>

{/* FOTOS - ESTILO HERO */}
<section className="relative py-32 px-6 text-center overflow-hidden">

  {/* FONDO */}
  <div className="absolute inset-0 bg-white" />

  {/* CONTENIDO */}
  <div className="relative max-w-3xl mx-auto">

    {/* ICONO */}
    <div className="flex justify-center mb-6">
      <div className="border border-[#d6d0c8] rounded-full p-4">
        <Camera className="text-[#8a847d]" size={26} strokeWidth={1.5} />
      </div>
    </div>

    {/* TITULO */}
    <h2 className="text-[#2c2c2c] text-2xl md:text-3xl tracking-[0.35em] uppercase font-light">
      Queremos ver tus fotos
    </h2>

    {/* TEXTO */}
    <p className="mt-6 text-[#4a4a4a]   text-sm md:text-base leading-7 max-w-xl mx-auto">
      Podés subir todas las fotos del gran día a nuestro álbum compartido
      para revivir juntos cada momento especial.
    </p>

    {/* BOTON */}
    <a
      href="#"
      className="mt-10 inline-block bg-[#2c2c2c] text-white px-10 py-4 rounded-full text-sm uppercase tracking-[0.25em] shadow-md hover:bg-[#3a3a3a] transition"
    >
      Ir al álbum
    </a>

  </div>
</section>


      {/* CIERRE */}
      <section className="bg-[#ece7e1] py-16 text-center">
        <p className="text-lg font-light">
          ¡Gracias por acompañarnos en este momento tan importante!
        </p>
      </section>

    </main>
  );
}