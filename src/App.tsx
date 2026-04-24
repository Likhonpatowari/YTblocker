/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Settings, EyeOff, Lock, CheckCircle, Download, Youtube, Zap, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F1F3F5] font-sans text-gray-800 overflow-x-hidden">
      {/* Dashboard Viewport Simulation */}
      <div className="max-w-[1024px] mx-auto py-12 px-4">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[40px] shadow-2xl border border-gray-200 flex flex-col md:flex-row overflow-hidden min-h-[700px]"
        >
          {/* Sidebar / Controls Panel */}
          <div className="w-full md:w-[340px] bg-white border-r border-gray-100 flex flex-col">
            <div className="p-8 border-b border-gray-50 bg-gradient-to-br from-blue-50/50 to-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">YT Blocker</h1>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Production-Ready v3.0</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 space-y-8">
              {/* Toggle Section */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="font-bold text-gray-700 text-sm">Blocking Active</span>
                <div className="w-11 h-6 bg-blue-600 rounded-full relative shadow-inner cursor-default">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>

              {/* Security Status */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Security</label>
                  <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full uppercase border border-green-100">Verified</span>
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    value="••••••••" 
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100/50 transition-all cursor-not-allowed" 
                    disabled
                  />
                  <Lock className="absolute right-3 top-3.5 w-4 h-4 text-blue-600" />
                </div>
              </div>

              {/* Keyword Filters */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Filters</label>
                  <span className="text-[10px] text-blue-600 font-bold uppercase">7 Filters</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge text="Cartoon" />
                  <Badge text="Kids" />
                  <Badge text="Shorts" />
                  <Badge text="Animation" />
                  <div className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-400 rounded-lg text-[10px] font-bold uppercase cursor-pointer hover:bg-gray-50 transition-colors">
                    + Add New
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100">
              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Install Extension
              </button>
            </div>
          </div>

          {/* Content / Preview Area */}
          <div className="flex-1 bg-[#F8F9FA] p-10 relative flex flex-col">
            <div className="mb-10">
              <div className="w-48 h-4 bg-gray-200 rounded-full mb-6 opacity-60"></div>
              <div className="grid grid-cols-3 gap-6">
                <div className="h-32 bg-gray-200/50 rounded-2xl border border-gray-200 border-dashed"></div>
                <div className="h-32 bg-gray-200/50 rounded-2xl border border-gray-200 border-dashed"></div>
                <div className="h-32 bg-gray-200/50 rounded-2xl border border-gray-200 border-dashed"></div>
              </div>
            </div>

            {/* Blocked Message Simulation */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[40px] p-12 shadow-xl border border-blue-50 flex flex-col items-center text-center space-y-6 max-w-lg mx-auto relative overflow-hidden"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full opacity-30"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-50 rounded-full opacity-30"></div>
              
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-4xl mb-2 relative z-10">
                🚫
              </div>
              
              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">এই ভিডিওটি ব্লক করা হয়েছে</h2>
                <p className="text-xl text-gray-600 leading-relaxed font-medium">সময় নষ্ট না করে কিছু শেখার চেষ্টা করো 💡</p>
              </div>

              <div className="pt-6 w-full relative z-10">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-blue-600 rounded-full shadow-sm"
                  ></motion.div>
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Focus Optimized</span>
                  <span>Safety Guard Active</span>
                </div>
              </div>
            </motion.div>

            <div className="mt-auto pt-10 opacity-20 pointer-events-none hidden md:block">
              <div className="w-full h-px bg-gray-200 mb-8"></div>
              <div className="grid grid-cols-3 gap-6">
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>

            <div className="absolute bottom-6 right-10 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>View Source on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights beneath */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <Detail icon={<Lock />} title="Lock" desc="Passcode security" />
          <Detail icon={<Youtube />} title="Shorts" desc="Full blocking" />
          <Detail icon={<Zap />} title="Smart" desc="Mutation logic" />
          <Detail icon={<Settings />} title="Logic" desc="Custom filters" />
        </section>
      </div>

      <footer className="py-12 bg-white border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
          <Shield className="w-4 h-4" />
          YouTube Smart Content Blocker
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Production Standard System • v3.0.0</p>
      </footer>
    </div>
  );
}

function Badge({ text }) {
  return (
    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold uppercase border border-blue-100 tracking-wide">
      {text} ×
    </span>
  );
}

function Detail({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 mb-4">
        {icon}
      </div>
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-[10px] text-gray-500 font-medium">{desc}</p>
    </div>
  );
}
