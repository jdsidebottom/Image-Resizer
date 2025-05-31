import { motion } from 'framer-motion';

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  index: number;
}

const TestimonialCard = ({ content, author, role, index }: TestimonialCardProps) => {
  return (
    <motion.div 
      className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center gap-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
          {author.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">{author}</h3>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">{content}</p>
    </motion.div>
  );
};

export default TestimonialCard;
