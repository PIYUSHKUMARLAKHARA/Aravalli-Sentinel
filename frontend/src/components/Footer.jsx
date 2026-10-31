import React from 'react';
import { AlertTriangle } from 'lucide-react';
import brandLogo from '../assets/images/aravalli-sentinel-logo.png';

export function Footer() {
  return (
    <footer className="border-t border-[#DCC8A3]/70 bg-[#EAEFE4] text-[#26382D] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <img
              src={brandLogo}
              alt="Aravalli Sentinel Logo"
              className="w-7 h-7 object-contain"
            />
            <span className="font-extrabold text-[#1B5E3B] tracking-tight">ARAVALLI SENTINEL</span>
          </div>
          <p className="text-sm text-[#526A59] max-w-md leading-relaxed">
            AI-powered ecological early-warning and action platform protecting the Aravalli ecosystem — India's ancient green wall against Thar desertification spanning Gujarat, Rajasthan, Haryana, and Delhi NCR.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#1B5E3B] font-mono font-bold">
            <span>DETECT</span>
            <span>→</span>
            <span>VERIFY</span>
            <span>→</span>
            <span>PRIORITIZE</span>
            <span>→</span>
            <span>ACT</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase font-mono tracking-wider text-[#1B5E3B] font-bold mb-3">Regulatory Framework</h4>
          <ul className="space-y-2 text-xs text-[#526A59]">
            <li className="hover:text-[#1B5E3B] transition-colors">Supreme Court Aravalli Ban (2002/2009)</li>
            <li className="hover:text-[#1B5E3B] transition-colors">Punjab Land Preservation Act (PLPA Sec 4/5)</li>
            <li className="hover:text-[#1B5E3B] transition-colors">MoEFCC Eco-Sensitive Zone Notifications</li>
            <li className="hover:text-[#1B5E3B] transition-colors">National Green Tribunal (NGT) Directives</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase font-mono tracking-wider text-[#1B5E3B] font-bold mb-3">Intelligence & Telemetry</h4>
          <ul className="space-y-2 text-xs text-[#526A59]">
            <li className="flex items-center gap-1.5 hover:text-[#1B5E3B]">
              <span>Copernicus Sentinel-2 MSI (NDVI)</span>
            </li>
            <li className="flex items-center gap-1.5 hover:text-[#1B5E3B]">
              <span>Google Gemini 2.0 Flash Vision</span>
            </li>
            <li className="flex items-center gap-1.5 hover:text-[#1B5E3B]">
              <span>Meteorological & Weather Context API</span>
            </li>
            <li className="flex items-center gap-1.5 hover:text-[#1B5E3B]">
              <span>Ground Citizen Ground-Truthing</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[#DCC8A3]/60 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
        <p className="flex items-center gap-2 text-[#526A59] bg-white/70 px-4 py-2 rounded-xl border border-[#DCC8A3]/50">
          <AlertTriangle className="w-4 h-4 text-[#EA580C] flex-shrink-0" />
          <span>
            <strong className="text-[#26382D]">Legal Notice:</strong> AI assessments and risk engine calculations are decision-support estimates. Field verification by authorized government officers is mandatory.
          </span>
        </p>
        <p className="font-mono text-[#526A59]">© 2026 ARAVALLI SENTINEL 2.0</p>
      </div>
    </footer>
  );
}

export default Footer;
