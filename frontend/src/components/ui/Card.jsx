import { motion } from "framer-motion";

export default function Card({ children, className = "", hover = false }) {
  return (
    <motion.section
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`glass rounded-3xl ${className}`}
    >
      {children}
    </motion.section>
  );
}
