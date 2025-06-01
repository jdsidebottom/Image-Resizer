import { motion } from 'framer-motion';

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
}

const AnimatedGradientText = ({ text, className = '' }: AnimatedGradientTextProps) => {
  return (
    <motion.h2 
      className={`font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      {text}
    </motion.h2>
  );
};

export default AnimatedGradientText;
