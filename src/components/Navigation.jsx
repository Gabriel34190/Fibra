import React from 'react'
import { motion } from 'framer-motion'

const Navigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <nav className="flex flex-wrap justify-center gap-4 mb-8">
      {tabs.map((tab, index) => (
        <motion.button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-fibonacci-gold text-black shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </motion.button>
      ))}
    </nav>
  )
}

export default Navigation
