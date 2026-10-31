import React from 'react';
import {
  ShieldAlert,
  Mountain,
  Trees,
  Droplets,
  Scale,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  Satellite,
  Compass,
} from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#EAEFE4] text-[#1B5E3B] border border-[#A3B18A]">
          <Mountain className="w-3.5 h-3.5" /> India's Ecological Shield
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#26382D] tracking-tight">
          About <span className="text-[#1B5E3B]">Aravalli Sentinel</span>
        </h1>
        <p className="text-base sm:text-lg text-[#526A59] max-w-2xl mx-auto leading-relaxed">
          An AI-powered environmental monitoring platform engineered to protect the 690-kilometer Aravalli ecosystem through citizen vigilance and remote sensing intelligence.
        </p>
      </div>

      {/* The Ecological Crisis */}
      <div className="p-8 rounded-3xl bg-white border border-[#DCC8A3] shadow-sm space-y-6">
        <h2 className="text-2xl font-black text-[#26382D] flex items-center gap-2.5">
          <Mountain className="w-6 h-6 text-[#1B5E3B]" />
          <span>The Ancient Shield of Northwest India</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#26382D] text-sm leading-relaxed">
          <div className="p-5 rounded-2xl bg-[#F5F7F0] border border-[#DCC8A3] space-y-2">
            <h3 className="font-bold text-[#1B5E3B] flex items-center gap-2">
              <Trees className="w-4 h-4 text-[#2E8B57]" /> Desertification Barrier
            </h3>
            <p className="text-xs text-[#526A59]">
              The Aravalli Range is the geological wall that halts the eastward expansion of the Thar Desert into the fertile agrarian plains of Haryana, Rajasthan, and western Uttar Pradesh.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F7F0] border border-[#DCC8A3] space-y-2">
            <h3 className="font-bold text-[#1B5E3B] flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-600" /> Regional Recharge Aquifer
            </h3>
            <p className="text-xs text-[#526A59]">
              Its fractured quartzite rocks serve as the primary recharge zone for subterranean groundwater tables supporting 40+ million citizens in Delhi NCR, Gurgaon, and Faridabad.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F7F0] border border-[#DCC8A3] space-y-2">
            <h3 className="font-bold text-[#1B5E3B] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#806044]" /> Wildlife Corridor
            </h3>
            <p className="text-xs text-[#526A59]">
              It forms an unbroken contiguous migration corridor for leopards, hyenas, and avian species between Sariska Tiger Reserve, Asola Bhatti, and Kumbhalgarh.
            </p>
          </div>
        </div>
      </div>

      {/* System Intelligence Architecture */}
      <div className="p-8 rounded-3xl bg-white border border-[#DCC8A3] shadow-sm space-y-6">
        <h2 className="text-2xl font-black text-[#26382D] flex items-center gap-2.5">
          <Satellite className="w-6 h-6 text-[#1B5E3B]" />
          <span>Intelligence & Satellite Architecture</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#EAEFE4] border border-[#A3B18A] space-y-1.5">
            <span className="font-bold text-[#1B5E3B] block">Copernicus Sentinel-2 MSI (NDVI)</span>
            <p className="text-[#526A59]">
              Measures canopy vegetation index using the formula <code>NDVI = (B8_NIR - B4_Red) / (B8_NIR + B4_Red)</code> to detect mechanical vegetation clearing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EAEFE4] border border-[#A3B18A] space-y-1.5">
            <span className="font-bold text-[#1B5E3B] block">Google Gemini 2.0 Flash Vision</span>
            <p className="text-[#526A59]">
              Analyzes ground photographic and video evidence to detect stone quarrying, dust plumes, topsoil stripping, and native forest felling.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EAEFE4] border border-[#A3B18A] space-y-1.5">
            <span className="font-bold text-[#1B5E3B] block">Statutory Environmental Points</span>
            <p className="text-[#526A59]">
              Stewardship points are credited only after official Forest Authority verification, preventing gamified spam and securing forensic integrity.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EAEFE4] border border-[#A3B18A] space-y-1.5">
            <span className="font-bold text-[#1B5E3B] block">Decision Support Disclaimer</span>
            <p className="text-[#526A59]">
              AI observations are indicators, not judicial findings. Physical ground-truthing by authorized forest officers is mandatory under Indian law.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;