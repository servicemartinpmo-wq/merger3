'use client';
import { useState, useEffect } from 'react';
import { pmoService } from '@/lib/services/pmoService';
import { AlgorithmScore, IndustryMode } from '@/lib/types/pmo';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  campaignId: string;
  industryMode: IndustryMode;
}

export function MarketingIntelligenceDashboard({ campaignId, industryMode }: Props) {
  const [scores, setScores] = useState<AlgorithmScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await pmoService.getAlgorithmScores(campaignId);
      if (data && data.length > 0) {
        setScores(data[0]);
      }
      setLoading(false);
    };
    fetchData();
  }, [campaignId]);

  if (loading) return <div className="p-4">Loading Intelligence...</div>;
  if (!scores) return <div className="p-4">No data available for this campaign.</div>;

  // Accuracy Check based on Industry Mode
  const checkAccuracy = (score: AlgorithmScore, mode: IndustryMode) => {
    const benchmarks: Record<IndustryMode, number> = {
      'SMB': 70,
      'start-up': 75,
      'executive': 80,
      'healthcare': 85,
      'creative': 65,
      'freelancer': 60
    };
    
    const threshold = benchmarks[mode] || 70;
    const isAccurate = scores.mega_algorithm_score >= threshold;
    
    return {
      isAccurate,
      message: isAccurate 
        ? `Performance is aligned with ${mode} industry benchmarks.` 
        : `Performance is below ${mode} industry benchmarks. Optimization recommended.`
    };
  };

  const assessment = checkAccuracy(scores, industryMode);

  const data = [
    { name: 'Engagement', value: scores.engagement_score },
    { name: 'Relevance', value: scores.relevance_score },
    { name: 'Conversion', value: scores.conversion_score },
    { name: 'Authority', value: scores.authority_score },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Marketing Intelligence: {campaignId}</h2>
      <div className="mb-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
        <p className={`font-semibold ${assessment.isAccurate ? 'text-emerald-600' : 'text-amber-600'}`}>
          {assessment.message}
        </p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
