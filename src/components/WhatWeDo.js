import React from "react";
import { motion } from "framer-motion";
import { Utensils, Truck, Users, Heart } from "lucide-react";

const WhatWeDo = () => {
  const services = [
    {
      icon: Utensils,
      title: "Satvik Meal Preparation",
      description:
        "Preparing pure vegetarian meals with devotion and the finest ingredients.",
    },
    {
      icon: Truck,
      title: "Hospital Delivery",
      description:
        "Timely delivery of fresh meals to hospitals across the region.",
    },
    {
      icon: Users,
      title: "Community Engagement",
      description:
        "Involving volunteers and creating a network of compassionate individuals.",
    },
    {
      icon: Heart,
      title: "Support",
      description:
        "Providing daily meals support to patient attendants and healthcare workers.",
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
              We bring the healing power of Satvik food to those who need it
              most, serving with devotion and care.
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

        <div className="max-w-3xl mx-auto">
            {/* Animated Process Line with Content */}
            <div className="flex justify-center mb-8">
                {[1, 2, 3].map((number, index) => (
                    <div key={number} className="flex items-center">
                        <motion.div 
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: index * 0.3 }}
                            className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center"
                        >
                            <span className="text-orange-600 font-semibold">{number}</span>
                        </motion.div>
                        {/* Line will now appear for all numbers */}
                        <motion.div 
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ delay: index * 0.3 + 0.2 }}
                            className="w-8 h-0.5 bg-orange-200 origin-left"
                            // Hide the last line after number 3
                            style={{ display: index === 2 ? 'none' : 'block' }}
                        />
                    </div>
                ))}
            </div>

            {/* Content Cards */}
            <div className="space-y-8">
                {[
                    {
                        title: 'Kitchen',
                        content: 'Our process begins early each morning with the careful selection of ingredients and preparation of meals in a pure, devotional atmosphere.'
                    },
                    {
                        title: 'Preparation',
                        content: 'Every meal is prepared following strict Satvik principles, ensuring both nutritional value and spiritual purity.'
                    },
                    {
                        title: 'Delivery',
                        content: 'Our dedicated team of volunteers ensures timely delivery to hospitals, maintaining the quality and warmth of each meal.'
                    }
                ].map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.3 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.content}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
</section>




    </div>
  );
};

export default WhatWeDo;
