"use client";

import { useState } from 'react';
import { aiAgents } from '@/lib/data';
import { StatusBadge } from '@/components/status-badge';
import { TrustScore } from '@/components/trust-score';
import { Search, SortAsc, SortDesc } from 'lucide-react';

export default function Analysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof aiAgents[0];
    direction: 'asc' | 'desc';
  }>({ key: 'trustScore', direction: 'desc' });

  const sortedAgents = [...aiAgents].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const filteredAgents = sortedAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key: keyof typeof aiAgents[0]) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-mono font-bold text-green-500">Neural Analysis</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500/50" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-black/30 border border-green-500/30 rounded text-green-500 font-mono focus:outline-none focus:border-green-500 placeholder-green-500/50"
          />
        </div>
      </div>

      <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-green-500/30">
                <th className="px-6 py-4 text-left text-sm font-mono text-green-500">Agent</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-green-500">Status</th>
                <th 
                  className="px-6 py-4 text-left text-sm font-mono text-green-500 cursor-pointer"
                  onClick={() => handleSort('trustScore')}
                >
                  <div className="flex items-center gap-2">
                    Trust Score
                    {sortConfig.key === 'trustScore' && (
                      sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-mono text-green-500">Consensus Rate</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-green-500">Type</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-green-500">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent) => (
                <tr 
                  key={agent.id}
                  className="border-b border-green-500/10 hover:bg-green-500/5 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-green-400">{agent.name}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={agent.status} />
                  </td>
                  <td className="px-6 py-4">
                    <TrustScore score={agent.trustScore} />
                  </td>
                  <td className="px-6 py-4 font-mono text-green-400">{agent.consensusRate}%</td>
                  <td className="px-6 py-4 font-mono text-green-400 capitalize">{agent.type}</td>
                  <td className="px-6 py-4 font-mono text-green-400">
                    {new Date(agent.lastUpdate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}