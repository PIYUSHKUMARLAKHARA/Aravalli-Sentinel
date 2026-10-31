import React from 'react';
import { ExternalLink, Heart, AlertTriangle } from 'lucide-react';
import brandLogo from '../assets/images/aravalli-sentinel-logo.png';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <img
              src={brandLogo}
              alt="Aravalli Sentinel Logo"
              className="w-7 h-7 object-contain"
            />
            <span className="font-bold text-white tracking-tight">ARAVALLI SENTINEL</span>
          </div>
          <p className="text-sm text-slate-300 max-w-md leading-relaxed">
            AI-powered ecological early-warning and action platform protecting the Aravalli ecosystem — India's ancient green wall against Thar desertification spanning Gujarat, Rajasthan, Haryana, and Delhi NCR.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400/90 font-mono">
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
          <h4 className="text-xs uppercase font-mono tracking-wider text-slate-300 font-semibold mb-3">Regulatory Anchors</h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-emerald-400 transition-colors">Supreme Court Aravalli Ban (2002/2009)</li>
            <li className="hover:text-emerald-400 transition-colors">Punjab Land Preservation Act (PLPA Sec 4/5)</li>
            <li className="hover:text-emerald-400 transition-colors">MoEFCC Eco-Sensitive Zone Notifications</li>
            <li className="hover:text-emerald-400 transition-colors">National Green Tribunal (NGT) Directives</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase font-mono tracking-wider text-slate-300 font-semibold mb-3">Telemetry Providers</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5 hover:text-emerald-400">
              <span>Copernicus Sentinel-2 MSI</span>
            </li>
            <li className="flex items-center gap-1.5 hover:text-emerald-400">
              <span>Google Gemini 2.0 Flash Vision</span>
            </li>
            <li className="flex items-center gap-1.5 hover:text-emerald-400">
              <span>ISRO Bhuvan Geo-Portal</span>
            </li>
            <li className="flex items-center gap-1.5 hover:text-emerald-400">
              <span>Central Ground Water Board</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
        <p className="flex items-center gap-1.5 text-slate-400">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>
            <strong>Legal Notice:</strong> AI assessments and risk engine calculations are decision-support estimates. Field verification by authorized government officers is mandatory.
          </span>
        </p>
        <p className="font-mono text-slate-400">© 2026 ARAVALLI SENTINEL MVP</p>
      </div>
    </footer>
  );
}

export default Footer;
