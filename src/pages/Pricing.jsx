import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaRegStar, FaCrown } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';

const Pricing = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
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
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="pt-16 sm:pt-24 lg:pt-32 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-100 dark:bg-indigo-900/20 blur-3xl opacity-70"
            animate={{ 
              x: [0, 10, 0], 
              y: [0, 15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-100 dark:bg-purple-900/20 blur-3xl opacity-70"
            animate={{ 
              x: [0, -10, 0], 
              y: [0, -15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                <HiOutlineSparkles className="mr-1.5 h-4 w-4 text-indigo-500" />
                Simple Pricing
              </span>
            </motion.div>
            <motion.h2 
              className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Choose your perfect plan
            </motion.h2>
            <motion.p 
              className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Get started with our intuitive image resizing tools and elevate your content creation process.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="mt-16 pb-16 sm:mt-20 sm:pb-20 lg:pb-28"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            
            {/* Free Tier */}
            <motion.div 
              className="rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 relative"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="p-8 sm:p-10 relative">
                <div className="absolute top-6 right-6">
                  <FaRegStar className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                  Free
                </h3>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 h-12">
                  Perfect for occasional use and small projects.
                </p>
                <div className="mt-6">
                  <p className="flex items-baseline text-gray-900 dark:text-white">
                    <span className="text-5xl font-extrabold tracking-tight">$0</span>
                    <span className="ml-1 text-xl font-medium">/month</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No credit card required</p>
                </div>
                
                <motion.div 
                  className="mt-8"
                  whileHover={pulseAnimation}
                >
                  <Link
                    to="/register"
                    className="block w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-3.5 px-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Start for free
                  </Link>
                </motion.div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-8 sm:px-10">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  {[
                    '25 images per month',
                    'Basic resize options',
                    'JPEG, PNG, WebP formats',
                    'Social media presets'
                  ].map((feature, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      variants={featureVariants}
                      custom={index}
                    >
                      <div className="flex-shrink-0">
                        <FaCheck className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-400">
                        {feature}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Pro Tier */}
            <motion.div 
              className="mt-10 lg:mt-0 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl relative"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              {/* Popular badge */}
              <div className="absolute top-0 right-6 transform -translate-y-1/2">
                <motion.span 
                  className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  POPULAR
                </motion.span>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-900 p-8 sm:p-10 relative">
                <div className="absolute top-6 right-6">
                  <FaCrown className="h-8 w-8 text-yellow-300" />
                </div>
                <h3 className="text-2xl font-semibold text-white flex items-center">
                  Pro
                </h3>
                <p className="mt-4 text-lg text-indigo-100 h-12">
                  For content creators who need more processing power.
                </p>
                <div className="mt-6">
                  <p className="flex items-baseline text-white">
                    <span className="text-5xl font-extrabold tracking-tight">$9</span>
                    <span className="ml-1 text-xl font-medium">/month</span>
                  </p>
                  <p className="mt-1 text-sm text-indigo-100">Billed monthly or $90/year</p>
                </div>
                
                <motion.div 
                  className="mt-8"
                  whileHover={pulseAnimation}
                >
                  <Link
                    to="/register"
                    className="block w-full bg-white rounded-lg py-3.5 px-4 text-center text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors duration-200 shadow-md"
                  >
                    Start 7-day free trial
                  </Link>
                </motion.div>
              </div>
              
              <div className="bg-indigo-50 dark:bg-gray-800 border-t border-indigo-100 dark:border-gray-700 px-8 py-8 sm:px-10">
                <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Everything in Free, plus
                </h4>
                <ul className="mt-6 space-y-4">
                  {[
                    '250 images per month',
                    'Advanced resize options',
                    'All image formats',
                    'Batch processing',
                    'Custom presets',
                    'Priority support'
                  ].map((feature, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      variants={featureVariants}
                      custom={index}
                    >
                      <div className="flex-shrink-0">
                        <FaCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                        {feature}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-40 left-20 w-72 h-72 rounded-full bg-indigo-50 dark:bg-indigo-900/10 blur-3xl opacity-70"
            animate={{ 
              x: [0, 20, 0], 
              y: [0, 10, 0]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 relative z-10">
          <motion.div 
            className="lg:grid lg:grid-cols-3 lg:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <motion.h2 
                className="text-3xl font-extrabold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Frequently asked questions
              </motion.h2>
              <motion.p 
                className="mt-4 text-lg text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Can't find the answer you're looking for? Contact our{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  customer support
                </a>{' '}
                team.
              </motion.p>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-2">
              <dl className="space-y-12">
                {[
                  {
                    question: "What image formats are supported?",
                    answer: "We support all major image formats including JPEG, PNG, GIF, WebP, and more. You can also convert between formats during the resize process."
                  },
                  {
                    question: "Is there a file size limit?",
                    answer: "Free users can upload images up to 10MB each. Premium users can upload images up to 50MB each."
                  },
                  {
                    question: "How does the monthly limit work?",
                    answer: "The monthly limit resets on the first day of each month. Unused image credits do not roll over to the next month."
                  },
                  {
                    question: "Can I cancel my subscription anytime?",
                    answer: "Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your current billing cycle."
                  }
                ].map((faq, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      {faq.answer}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <motion.div 
        className="bg-gray-50 dark:bg-gray-900 py-16 sm:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600 dark:text-indigo-400">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Loved by creators worldwide
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[
              {
                content: "This tool has saved me countless hours of work. The batch processing feature is a game-changer for my social media content.",
                author: "Sarah Johnson",
                role: "Content Creator"
              },
              {
                content: "The image quality after resizing is exceptional. I've tried many tools, but this one preserves details better than anything else I've used.",
                author: "Michael Chen",
                role: "Photographer"
              },
              {
                content: "The Pro plan is worth every penny. The time I save with the custom presets alone pays for the subscription many times over.",
                author: "Emma Rodriguez",
                role: "Marketing Manager"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">{testimonial.author}</h3>
                    <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Pricing;
