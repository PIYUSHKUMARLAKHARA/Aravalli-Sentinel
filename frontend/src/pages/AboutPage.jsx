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
  ExternalLink
} from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          <Mountain className="w-3.5 h-3.5" /> India's Ecological Shield
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About <span className="text-emerald-400">Aravalli Sentinel</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An AI-powered environmental monitoring platform engineered to protect the 690-kilometer Aravalli ecosystem through citizen vigilance and remote sensing intelligence.
        </p>
      </div>

      {/* The Ecological Crisis */}
      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Mountain className="w-6 h-6 text-emerald-400" />
          <span>The Ancient Shield of Northwest India</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300 text-sm leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Trees className="w-4 h-4 text-emerald-400" /> Desertification Barrier
            </h3>
            <p className="text-xs text-slate-400">
              The Aravalli Range is the geological wall that halts the eastward expansion of the Thar Desert into the fertile agrarian plains of Haryana, Rajasthan, and western Uttar Pradesh.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" /> Regional Recharge Aquifer
            </h3>
            <p className="text-xs text-slate-400">
              Its fractured quartzite rocks serve as the primary recharge zone for subterranean groundwater tables supporting 40+ million citizens in Delhi NCR, Gurgaon, and Faridabad.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Wildlife Corridor
            </h3>
            <p className="text-xs text-slate-400">
              It forms an unbroken contiguous migration corridor for leopards, hyenas, and avian species between Sariska Tiger Reserve, Asola Bhatti, and Kumbhalgarh.
            </p>
          </div>
        </div>
      </div>

      {/* Supreme Court Mandate & Legal Framework */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/20 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-400">
          <Scale className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">Supreme Court Jurisprudence & Legal Mandate</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          In landmark judgments spanning over two decades (<span className="text-amber-300 font-semibold">M.C. Mehta vs. Union of India</span>, 2002, 2004, 2009), the Supreme Court of India imposed an absolute ban on unpermitted commercial mining and ridge flattening across the Aravalli hills of Haryana and Rajasthan.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="font-semibold text-amber-400 mb-1">Punjab Land Preservation Act (PLPA 1900):</p>
            <p className="text-slate-400">Section 4 & 5 notifications strictly prohibit tree felling, construction, and quarrying on notified deemed forest lands.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="font-semibold text-amber-400 mb-1">Forest (Conservation) Act, 1980:</p>
            <p className="text-slate-400">Mandates prior Central Government approval before diverting forest land for non-forest purposes.</p>
          </div>
        </div>
      </div>

      {/* Technical Limitations & Non-Defamation Caveats */}
      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2.5 text-rose-400">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">Technical Limitations & AI Ethics</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Aravalli Sentinel strictly rejects black-box automation and automated guilt attribution:
        </p>
        <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
          <li>
            <strong className="text-white">A Photograph Is Not Judicial Proof:</strong> Machine vision observations and preliminary risk scores are decision-support estimates. They do not constitute official evidence or proof of legal guilt under Indian environmental laws.
          </li>
          <li>
            <strong className="text-white">Mandatory Ground Verification:</strong> All action memos and official enforcement raids require physical on-site verification by authorized Forest Range Officers and Mining Task Forces.
          </li>
          <li>
            <strong className="text-white">Seasonal & Optical Limitations:</strong> Deciduous trees naturally drop leaves during dry seasons, which optical NDVI indicators must account for without false-positive deforestation alarms.
          </li>
          <li>
            <strong className="text-white">Citizen Privacy Redaction:</strong> To safeguard informants from retribution, all personal identifying details (PII) are permanently stripped from public endpoints and feeds.
          </li>
        </ul>
      </div>

      {/* UN Sustainable Development Goals */}
      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-400" />
          <span>Alignment with UN Sustainable Development Goals (SDGs)</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-2xl font-black text-emerald-400">15</div>
            <div className="text-xs font-bold text-white">Life on Land</div>
            <p className="text-[10px] text-slate-400">Halting desertification & conserving native Dhau woodlands</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-2xl font-black text-cyan-400">6</div>
            <div className="text-xs font-bold text-white">Clean Water</div>
            <p className="text-[10px] text-slate-400">Protecting groundwater recharge aquifers from leachate dumping</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-2xl font-black text-amber-400">11</div>
            <div className="text-xs font-bold text-white">Sustainable Cities</div>
            <p className="text-[10px] text-slate-400">Preserving Delhi NCR's natural green buffer & air quality</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-2xl font-black text-purple-400">16</div>
            <div className="text-xs font-bold text-white">Peace & Justice</div>
            <p className="text-[10px] text-slate-400">Transparent, immutable audit logging for legal compliance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
