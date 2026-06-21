import { motion } from "framer-motion";

export function SectionTitle({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      {eyebrow ? (
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</span>
      ) : null}
      <h2
        className="font-display text-4xl md:text-5xl mt-3 text-balance"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className={`h-px w-16 bg-gold/40 mt-6 ${align === "center" ? "mx-auto" : ""}`} />
    </motion.div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
