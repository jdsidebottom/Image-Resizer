import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  tier: string;
  price: string;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  ctaText: string;
  ctaLink: string;
  index: number;
}

const PricingCard = ({
  tier,
  price,
  description,
  features,
  isPopular = false,
  ctaText,
  ctaLink,
  index
}: PricingCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + (i * 0.1),
        duration: 0.3
      }
    })
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  };

  return (
    <motion.div
      className={`rounded-xl shadow-lg overflow-hidden ${
        isPopular
          ? 'border-2 border-indigo-500 dark:border-indigo-400'
          : 'border border-gray-200 dark:border-gray-700'
      } bg-white dark:bg-gray-800`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
    >
      {isPopular && (
        <div className="bg-indigo-500 text-white text-center py-1 text-sm font-medium">
          MOST POPULAR
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tier}</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 h-12">{description}</p>
        <p className="mt-6">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{price}</span>
          {price !== 'Free' && <span className="text-base font-medium text-gray-500 dark:text-gray-400">/month</span>}
        </p>
        
        <motion.div className="mt-6" whileHover={pulseAnimation}>
          <Link
            to={ctaLink}
            className={`block w-full text-center px-4 py-2 rounded-md text-sm font-medium ${
              isPopular
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
      
      <div className="px-6 pt-4 pb-8 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          What's included
        </h4>
        <ul className="mt-4 space-y-3">
          {features.map((feature, i) => (
            <motion.li
              key={i}
              className="flex items-start"
              custom={i}
              variants={featureVariants}
            >
              <div className="flex-shrink-0">
                <FaCheck className={`h-5 w-5 ${
                  feature.included 
                    ? isPopular 
                      ? 'text-indigo-500 dark:text-indigo-400' 
                      : 'text-green-500'
                    : 'text-gray-300 dark:text-gray-600'
                }`} />
              </div>
              <p className={`ml-3 text-sm ${
                feature.included
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-400 dark:text-gray-500 line-through'
              }`}>
                {feature.text}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default PricingCard;
