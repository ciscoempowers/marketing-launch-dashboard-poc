import React, { useState } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  ShareIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface KPIMetric {
  name: string;
  value: number;
  target: number;
  wow: number;
  type: 'social' | 'content' | 'conversion' | 'traffic' | 'engagement';
  historicalData: { week: string; value: number }[];
}

interface WeeklyData {
  week: string;
  blog: number;
  social: number;
  whitepaper: number;
  website: number;
}

interface Alert {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'opportunity' | 'anomaly';
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  actionable?: boolean;
}

interface OptimizationRecommendation {
  id: string;
  category: 'budget' | 'timing' | 'content' | 'channel';
  title: string;
  description: string;
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
  priority: number;
}

const PerformanceMonitor: React.FC = () => {
  const [selectedLaunch, setSelectedLaunch] = useState('HAX Launch');
  const [viewMode, setViewMode] = useState<'cumulative' | 'netnew'>('cumulative');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [executiveSummary, setExecutiveSummary] = useState<string | null>(null);
  const [actionableInsights, setActionableInsights] = useState<string[]>([]);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [agentResponse, setAgentResponse] = useState<string | null>(null);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'recommendations' | 'insights'>('overview');

  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([
    { 
      name: 'Social Media Engagement', 
      value: 7234, 
      target: 5000, 
      wow: 18, 
      type: 'social',
      historicalData: [
        { week: '11/10/25', value: 3234 },
        { week: '11/17/25', value: 3876 },
        { week: '11/24/25', value: 4234 },
        { week: '12/01/25', value: 5234 },
        { week: '12/08/25', value: 6123 },
        { week: '12/15/25', value: 7234 }
      ]
    },
    { 
      name: 'Blog Post Views', 
      value: 1567, 
      target: 3500, 
      wow: 25, 
      type: 'content',
      historicalData: [
        { week: '11/10/25', value: 234 },
        { week: '11/17/25', value: 456 },
        { week: '11/24/25', value: 678 },
        { week: '12/01/25', value: 890 },
        { week: '12/08/25', value: 1234 },
        { week: '12/15/25', value: 1567 }
      ]
    },
    { 
      name: 'White Paper Downloads', 
      value: 203, 
      target: 180, 
      wow: 22, 
      type: 'conversion',
      historicalData: [
        { week: '11/10/25', value: 45 },
        { week: '11/17/25', value: 67 },
        { week: '11/24/25', value: 89 },
        { week: '12/01/25', value: 123 },
        { week: '12/08/25', value: 167 },
        { week: '12/15/25', value: 203 }
      ]
    },
    { 
      name: 'Website Traffic', 
      value: 10234, 
      target: 8000, 
      wow: 15, 
      type: 'traffic',
      historicalData: [
        { week: '11/10/25', value: 5678 },
        { week: '11/17/25', value: 6234 },
        { week: '11/24/25', value: 7123 },
        { week: '12/01/25', value: 8456 },
        { week: '12/08/25', value: 9234 },
        { week: '12/15/25', value: 10234 }
      ]
    },
    { 
      name: 'Content Engagement Score', 
      value: 89, 
      target: 85, 
      wow: 8, 
      type: 'engagement',
      historicalData: [
        { week: '11/10/25', value: 65 },
        { week: '11/17/25', value: 72 },
        { week: '11/24/25', value: 78 },
        { week: '12/01/25', value: 82 },
        { week: '12/08/25', value: 85 },
        { week: '12/15/25', value: 89 }
      ]
    }
  ]);

  const [weeklyData] = useState<WeeklyData[]>([
    { week: '11/10/25', blog: 234, social: 3234, whitepaper: 45, website: 5678 },
    { week: '11/17/25', blog: 456, social: 3876, whitepaper: 67, website: 6234 },
    { week: '11/24/25', blog: 678, social: 4234, whitepaper: 89, website: 7123 },
    { week: '12/01/25', blog: 890, social: 5234, whitepaper: 123, website: 8456 },
    { week: '12/08/25', blog: 1234, social: 6123, whitepaper: 167, website: 9234 },
    { week: '12/15/25', blog: 1567, social: 7234, whitepaper: 203, website: 10234 }
  ]);

  const launchOptions = [
    'HAX Launch',
    'CI Vision Launch',
    'Qunnect Launch',
    'AGNTCY Directory Launch'
  ];

  const generateExecutiveSummary = async () => {
    setIsGeneratingAnalysis(true);
    
    // Simulate analysis processing with steps
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const totalEngagement = kpiMetrics.reduce((sum, m) => sum + m.value, 0);
    const avgPerformance = Math.round(kpiMetrics.reduce((sum, m) => sum + (m.value / m.target * 100), 0) / kpiMetrics.length);
    const topPerformer = kpiMetrics.reduce((max, m) => (m.value / m.target) > (max.value / max.target) ? m : max, kpiMetrics[0]);
    
    setExecutiveSummary(
      `Overall launch performance exceeds targets by ${avgPerformance - 100}%. ` +
      `${topPerformer.name} leads with ${Math.round((topPerformer.value / topPerformer.target) * 100)}% of target achieved. ` +
      `Social media engagement shows strongest WoW growth at +18%.`
    );

    await new Promise(resolve => setTimeout(resolve, 500));

    setActionableInsights([
      "LinkedIn engagement climbed 25% WoW - leverage momentum with targeted whitepaper promotion",
      "Blog post views below target - consider optimizing SEO and distribution channels", 
      "White paper downloads exceeded target by 13% - expand similar content offerings",
      "Website traffic strong but conversion rate could improve - optimize landing pages"
    ]);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Enhanced Real-Time Alerts
    setAlerts([
      {
        id: '1',
        message: 'Whitepaper downloads surpassed 1,000 this week—a 50% increase from the previous period',
        type: 'success',
        timestamp: new Date(),
        priority: 'high',
        actionable: true
      },
      {
        id: '2', 
        message: 'Social media engagement dropped 5% compared to last week - consider boosting content',
        type: 'warning',
        timestamp: new Date(),
        priority: 'medium',
        actionable: true
      },
      {
        id: '3',
        message: 'Anomaly detected: Blog post views unusually high on Tuesday - analyze content drivers',
        type: 'anomaly',
        timestamp: new Date(),
        priority: 'medium',
        actionable: true
      },
      {
        id: '4',
        message: 'Opportunity: LinkedIn engagement up 40% - ideal time to launch targeted campaign',
        type: 'opportunity',
        timestamp: new Date(),
        priority: 'high',
        actionable: true
      }
    ]);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Automated Optimization Recommendations
    setOptimizationRecommendations([
      {
        id: '1',
        category: 'budget',
        title: 'Shift Budget to LinkedIn Ads',
        description: 'LinkedIn engagement up 40% WoW while other platforms flat. Reallocate 15% of display budget to LinkedIn sponsored content.',
        expectedImpact: '+25% overall engagement, +12% lead generation',
        effort: 'low',
        priority: 1
      },
      {
        id: '2',
        category: 'timing',
        title: 'Optimize Posting Schedule',
        description: 'Analysis shows peak engagement Tuesdays 2-4 PM. Move 60% of social content to this window.',
        expectedImpact: '+18% social media engagement',
        effort: 'low',
        priority: 2
      },
      {
        id: '3',
        category: 'content',
        title: 'Create More Whitepaper Downloads',
        description: 'Whitepapers exceed targets by 13%. Repurpose top-performing blog content into downloadable guides.',
        expectedImpact: '+30% lead conversions, +40% content downloads',
        effort: 'medium',
        priority: 3
      },
      {
        id: '4',
        category: 'channel',
        title: 'Double Down on Video Content',
        description: 'Video posts drive 3x more engagement than text. Convert 50% of blog content to video format.',
        expectedImpact: '+45% social engagement, +20% time on site',
        effort: 'high',
        priority: 4
      }
    ]);

    setIsGeneratingAnalysis(false);
  };

  const handleAgentQuery = () => {
    if (!userQuery.trim()) return;

    // Simulate intelligent agent responses
    const responses: { [key: string]: string } = {
      'yesterday': `Yesterday's post-launch performance: Social media engagement up 8% to 7,234, blog views increased 12% to 1,567, white paper downloads steady at 203.`,
      'traffic': `Blog post "HAX Announcement" drove the most site traffic this week with 1,567 views, generating 234 click-throughs to the main website.`,
      'engagement': `Social engagement has increased 45% since launch on Dec 15th, with LinkedIn being the top performing platform (+25% WoW).`,
      'default': `Based on current data, I recommend focusing on LinkedIn promotion to boost white paper downloads, as social engagement is strong while paper downloads could be optimized.`
    };

    const lowerQuery = userQuery.toLowerCase();
    const response = Object.keys(responses).find(key => lowerQuery.includes(key)) || responses.default;
    
    setAgentResponse(response);
  };

  const getKPIIcon = (type: string) => {
    switch (type) {
      case 'social': return <ShareIcon className="h-6 w-6 text-blue-500" />;
      case 'content': return <DocumentTextIcon className="h-6 w-6 text-green-500" />;
      case 'conversion': return <ArrowTrendingUpIcon className="h-6 w-6 text-purple-500" />;
      case 'traffic': return <ChartBarIcon className="h-6 w-6 text-orange-500" />;
      default: return <ArrowTrendingUpIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const renderLineChart = (data: { week: string; value: number }[], maxValue: number) => {
    if (data.length < 2) return null;
    
    const width = 200;
    const height = 60;
    const padding = 10;
    
    const xScale = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding);
    const yScale = (value: number) => height - padding - ((value / maxValue) * (height - 2 * padding));
    
    const points = data.map((point, index) => `${xScale(index)},${yScale(point.value)}`).join(' ');
    
    return (
      <svg width={width} height={height} className="mt-2">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
          <line
            key={fraction}
            x1={padding}
            y1={height - padding - fraction * (height - 2 * padding)}
            x2={width - padding}
            y2={height - padding - fraction * (height - 2 * padding)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((point, index) => (
          <circle
            key={index}
            cx={xScale(index)}
            cy={yScale(point.value)}
            r="3"
            fill="#3b82f6"
          />
        ))}
        
        {/* Labels */}
        {data.map((point, index) => (
          <text
            key={index}
            x={xScale(index)}
            y={height - 2}
            fontSize="7"
            fill="#6b7280"
            textAnchor="middle"
          >
            {point.week}
          </text>
        ))}
      </svg>
    );
  };

  const toggleSection = (section: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(section)) {
      newCollapsed.delete(section);
    } else {
      newCollapsed.add(section);
    }
    setCollapsedSections(newCollapsed);
  };

  const getOverallPerformance = () => {
    const avgPerformance = kpiMetrics.reduce((sum, m) => sum + (m.value / m.target * 100), 0) / kpiMetrics.length;
    return Math.round(avgPerformance);
  };

  const getFilteredAlerts = (priority?: 'low' | 'medium' | 'high') => {
    if (!priority) return alerts;
    return alerts.filter(alert => alert.priority === priority);
  };

  const getFilteredRecommendations = (effort?: 'low' | 'medium' | 'high') => {
    if (!effort) return optimizationRecommendations;
    return optimizationRecommendations.filter(rec => rec.effort === effort);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-gray-900">Performance Monitor</h1>
              <div className="flex items-center space-x-4 text-sm">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                  Overall: {getOverallPerformance()}% of target
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {alerts.length} alerts
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                  {optimizationRecommendations.length} recommendations
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedLaunch}
                onChange={(e) => setSelectedLaunch(e.target.value)}
                className="text-sm p-2 border border-gray-300 rounded"
              >
                {launchOptions.map(launch => (
                  <option key={launch} value={launch}>{launch}</option>
                ))}
              </select>
              <button
                onClick={generateExecutiveSummary}
                disabled={isGeneratingAnalysis}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {isGeneratingAnalysis ? 'Analyzing...' : 'Generate Analysis'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-1">
          <div className="flex space-x-1">
            {[
              { id: 'overview', name: 'Overview', count: null },
              { id: 'alerts', name: 'Alerts', count: alerts.length },
              { id: 'recommendations', name: 'Recommendations', count: optimizationRecommendations.length },
              { id: 'insights', name: 'Insights', count: actionableInsights.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{tab.name}</span>
                {tab.count !== null && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white text-blue-500' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Executive Summary */}
        {executiveSummary && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-blue-900">Executive Summary</h2>
              <button
                onClick={() => toggleSection('summary')}
                className="text-blue-600 hover:text-blue-800"
              >
                {collapsedSections.has('summary') ? 'Show' : 'Hide'}
              </button>
            </div>
            {!collapsedSections.has('summary') && (
              <p className="text-blue-800">{executiveSummary}</p>
            )}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* KPI Scorecard */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {kpiMetrics.map((metric, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getKPIIcon(metric.type)}
                      <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      metric.wow > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      WoW: {metric.wow > 0 ? '+' : ''}{metric.wow}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{metric.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Target: {metric.target.toLocaleString()}</div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((metric.value / metric.target) * 100)}% of target
                    </div>
                  </div>
                  
                  {/* Line Chart */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">6-Week Trend</div>
                    {renderLineChart(metric.historicalData, Math.max(...metric.historicalData.map(d => d.value)) * 1.1)}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">{getOverallPerformance()}%</div>
                <div className="text-sm text-gray-600">Overall Performance</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{alerts.length}</div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">{optimizationRecommendations.length}</div>
                <div className="text-sm text-gray-600">Recommendations</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">{actionableInsights.length}</div>
                <div className="text-sm text-gray-600">Key Insights</div>
              </div>
            </div>
          </>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {/* Filter Controls */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Filter by priority:</span>
                {['all', 'high', 'medium', 'low'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {/* Add filter logic */}}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
                <button className="ml-auto px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                  Take Action on All
                </button>
              </div>
            </div>

            {/* Enhanced Alerts Section */}
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.sort((a, b) => {
                  const priorityOrder = { high: 3, medium: 2, low: 1 };
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                }).map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${
                    alert.type === 'success' ? 'bg-green-50 border-green-200' :
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    alert.type === 'anomaly' ? 'bg-red-50 border-red-200' :
                    alert.type === 'opportunity' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                            alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.priority.toUpperCase()} PRIORITY
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            alert.type === 'success' ? 'bg-green-100 text-green-800' :
                            alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            alert.type === 'anomaly' ? 'bg-red-100 text-red-800' :
                            alert.type === 'opportunity' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          alert.type === 'success' ? 'text-green-800' :
                          alert.type === 'warning' ? 'text-yellow-800' :
                          alert.type === 'anomaly' ? 'text-red-800' :
                          alert.type === 'opportunity' ? 'text-blue-800' :
                          'text-gray-800'
                        }`}>{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                      {alert.actionable && (
                        <button className="ml-4 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                          Take Action
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <div className="text-gray-500">No alerts available. Generate analysis to see alerts.</div>
              </div>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {/* Filter Controls */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Filter by effort:</span>
                {['all', 'low', 'medium', 'high'].map((effort) => (
                  <button
                    key={effort}
                    onClick={() => {/* Add filter logic */}}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {effort.charAt(0).toUpperCase() + effort.slice(1)}
                  </button>
                ))}
                <button className="ml-auto px-4 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                  Implement All
                </button>
              </div>
            </div>

            {optimizationRecommendations.length > 0 ? (
              <div className="space-y-4">
                {optimizationRecommendations.sort((a, b) => a.priority - b.priority).map((rec, index) => (
                  <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          rec.category === 'budget' ? 'bg-green-500' :
                          rec.category === 'timing' ? 'bg-blue-500' :
                          rec.category === 'content' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}>
                          {rec.category.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            rec.effort === 'low' ? 'bg-green-100 text-green-800' :
                            rec.effort === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {rec.effort.toUpperCase()} EFFORT
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">{rec.expectedImpact}</div>
                        <div className="text-xs text-gray-500">Priority #{index + 1}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{rec.description}</p>
                    <div className="flex items-center space-x-3">
                      <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                        Implement Recommendation
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <div className="text-gray-500">No recommendations available. Generate analysis to see recommendations.</div>
              </div>
            )}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            {actionableInsights.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Actionable Insights & Recommendations</h3>
                <div className="space-y-3">
                  {actionableInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                      <p className="text-blue-800">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <div className="text-gray-500">No insights available. Generate analysis to see insights.</div>
              </div>
            )}
          </div>
        )}

              </div>

      
      {/* Actionable Insights */}
      {actionableInsights.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Actionable Insights & Recommendations</h3>
          <div className="space-y-3">
            {actionableInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-blue-800">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
            Real-Time Alerts & Notifications
          </h3>
          <div className="space-y-3">
            {alerts.sort((a, b) => {
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            }).map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.type === 'success' ? 'bg-green-50 border-green-200' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                alert.type === 'anomaly' ? 'bg-red-50 border-red-200' :
                alert.type === 'opportunity' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        alert.type === 'success' ? 'bg-green-100 text-green-800' :
                        alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        alert.type === 'anomaly' ? 'bg-red-100 text-red-800' :
                        alert.type === 'opportunity' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      alert.type === 'success' ? 'text-green-800' :
                      alert.type === 'warning' ? 'text-yellow-800' :
                      alert.type === 'anomaly' ? 'text-red-800' :
                      alert.type === 'opportunity' ? 'text-blue-800' :
                      'text-gray-800'
                    }`}>{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                  {alert.actionable && (
                    <button className="ml-4 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                      Take Action
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automated Optimization Recommendations */}
      {optimizationRecommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Automated Optimization Recommendations</h3>
          <div className="space-y-4">
            {optimizationRecommendations.sort((a, b) => a.priority - b.priority).map((rec, index) => (
              <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      rec.category === 'budget' ? 'bg-green-500' :
                      rec.category === 'timing' ? 'bg-blue-500' :
                      rec.category === 'content' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`}>
                      {rec.category.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.effort === 'low' ? 'bg-green-100 text-green-800' :
                        rec.effort === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {rec.effort.toUpperCase()} EFFORT
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">{rec.expectedImpact}</div>
                    <div className="text-xs text-gray-500">Priority #{index + 1}</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">{rec.description}</p>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                    Implement Recommendation
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Agent Interface */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Ask the Performance Agent</h3>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAgentQuery()}
              placeholder="Ask me anything about performance data... (e.g., 'Show me yesterday's performance')"
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleAgentQuery}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              Ask Agent
            </button>
          </div>
          
          {agentResponse && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{agentResponse}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Example queries:</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded">Show me yesterday's performance</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Which blog drove most traffic?</span>
              <span className="px-2 py-1 bg-gray-100 rounded">How has social engagement changed?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
