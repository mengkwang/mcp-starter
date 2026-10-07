import React, { useState } from 'react';
import { ECONOMIC_EVENTS } from '../data/marketData';
import { Calendar as CalendarIcon, Filter, AlertCircle, Clock, Globe } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [impactFilter, setImpactFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  const filteredEvents = ECONOMIC_EVENTS.filter(evt => {
    if (impactFilter !== 'all' && evt.impact !== impactFilter) return false;
    if (countryFilter !== 'all' && evt.countryCode !== countryFilter) return false;
    return true;
  });

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return (
          <span className="flex items-center gap-1 font-semibold text-[11px] text-[#f23645]">
            <span className="w-2 h-2 rounded-full bg-[#f23645]" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center gap-1 font-semibold text-[11px] text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Med
          </span>
        );
      case 'low':
        return (
          <span className="flex items-center gap-1 font-semibold text-[11px] text-[#787b86]">
            <span className="w-2 h-2 rounded-full bg-[#787b86]" />
            Low
          </span>
        );
    }
  };

  const getCountryFlag = (code: string) => {
    switch (code) {
      case 'US': return '🇺🇸';
      case 'EU': return '🇪🇺';
      case 'DE': return '🇩🇪';
      case 'GB': return '🇬🇧';
      case 'JP': return '🇯🇵';
      default: return '🌐';
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-5">
      {/* Top Banner and Filter Bar */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#2962ff]" />
            <h1 className="text-xl font-bold tracking-tight text-white">Economic Calendar</h1>
          </div>
          <p className="text-xs text-[#787b86] mt-0.5">
            Key macroeconomic releases, monetary policy decisions, and labor metrics shaping global market liquidity.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-[#131722] p-1 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => setImpactFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                impactFilter === 'all' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
              }`}
            >
              All Impact
            </button>
            <button
              onClick={() => setImpactFilter('high')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                impactFilter === 'high' ? 'bg-[#2a2e39] text-[#f23645] font-semibold' : 'text-[#787b86] hover:text-[#f23645]'
              }`}
            >
              High Impact Only
            </button>
          </div>

          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            className="bg-[#131722] border border-[#2a2e39] text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2962ff]"
          >
            <option value="all">All Countries</option>
            <option value="US">🇺🇸 United States</option>
            <option value="EU">🇪🇺 Eurozone</option>
            <option value="DE">🇩🇪 Germany</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#131722] border-b border-[#2a2e39] text-[#787b86] font-medium">
                <th className="py-3 px-4 w-28">Date & Time</th>
                <th className="py-3 px-4 w-20">Country</th>
                <th className="py-3 px-4 w-28 text-center">Impact</th>
                <th className="py-3 px-4">Economic Event</th>
                <th className="py-3 px-4 text-right">Actual</th>
                <th className="py-3 px-4 text-right">Forecast</th>
                <th className="py-3 px-4 text-right">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {filteredEvents.map(evt => (
                <tr key={evt.id} className="hover:bg-[#2a2e39]/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#d1d4dc]">
                    <div className="font-semibold text-white">{evt.date}</div>
                    <div className="text-[11px] text-[#787b86]">{evt.time}</div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-white">
                    <span className="text-base mr-1.5" role="img" aria-label={evt.country}>
                      {getCountryFlag(evt.countryCode)}
                    </span>
                    <span className="font-mono text-xs text-[#787b86]">{evt.countryCode}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {getImpactBadge(evt.impact)}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-white text-sm">
                    {evt.event}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                    {evt.actual ? (
                      <span className={evt.actual > (evt.forecast || '') ? 'text-[#089981]' : 'text-white'}>
                        {evt.actual}
                      </span>
                    ) : (
                      <span className="text-[#787b86] font-normal">-</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-[#787b86]">
                    {evt.forecast || '-'}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-[#787b86]">
                    {evt.previous || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
