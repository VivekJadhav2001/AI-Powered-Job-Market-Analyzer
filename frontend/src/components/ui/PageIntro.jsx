import { motion } from "framer-motion";

export default function PageIntro({ eyebrow, title, description, action }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"
    >
      <div>
        <p className="mb-2 text-xs font-semibold tracking-[.2em] text-violet-300 uppercase">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">{description}</p>
      </div>
      {action}
    </motion.header>
  );
}
