import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Truck, Users, Heart } from 'lucide-react';

const WhatWeDo = () => {
  const services = [
    {
      icon: Utensils,
      title: 'Satvik Meal Preparation',
      description: 'Preparing pure vegetarian meals with devotion and the finest ingredients.',
    },
    {
      icon: Truck,
      title: 'Hospital Delivery',
      description: 'Timely delivery of fresh meals to hospitals across the region.',
    },
    {
      icon: Users,
      title: 'Community Engagement',
      description: 'Involving volunteers and creating a network of compassionate individuals.',
    },
    {
      icon: Heart,
      title: 'Patient Support',
      description: 'Providing nutritional support to patients and healthcare workers.',
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What We Do
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We bring the healing power of Satvik food to those who need it most,
              serving with devotion and care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <service.icon className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600">
              How we bring Satvik food from our kitchen to those in need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f"
                alt="Our Process"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  From Kitchen to Hospital
                </h3>
                <p className="text-gray-600">
                  Our process begins early each morning with the careful selection of
                  ingredients and preparation of meals in a pure, devotional atmosphere.
                </p>
                <p className="text-gray-600">
                  Every meal is prepared following strict Satvik principles, ensuring
                  both nutritional value and spiritual purity.
                </p>
                <p className="text-gray-600">
                  Our dedicated team of volunteers ensures timely delivery to hospitals,
                  maintaining the quality and warmth of each meal.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeDo;