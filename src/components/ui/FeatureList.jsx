import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

interface Feature {
  text: string;
}

interface FeatureListProps {
  features: Feature[];
  iconColor?: string;
}

const FeatureList = ({ features, iconColor = 'text-green-500' }: FeatureListProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.ul 
      className="mt-6 space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, index) => (
        <motion.li 
          key={index} 
          className="flex items-start"
          variants={itemVariants}
        >
          <div className="flex-shrink-0">
            <FaCheck className={`h-5 w-5 ${iconColor}`} />
          </div>
          <p className="ml-3 text-base text-gray-500 dark:text-gray-400">
            {feature.text}
          </p>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default FeatureList;
