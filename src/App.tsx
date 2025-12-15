import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import CalendarView from './components/CalendarView';
import LaunchArtifactsTracker from './components/ContentTracker';
import LaunchStatusOverview from './components/LaunchStatusOverview';
import PerformanceMonitor from './components/PerformanceMonitor';
import { sampleLaunches } from './data/sampleLaunches';
import { DataAgentService } from './services/dataAgents';
import { Launch } from './types/launch';
import { addMonths, startOfMonth } from 'date-fns';

type ViewType = 'calendar' | 'content' | 'status' | 'workflow' | 'performance';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('status');
  const [launches, setLaunches] = useState<Launch[]>(sampleLaunches);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [dataAgent] = useState(DataAgentService.getInstance());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('all');

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await dataAgent.initializeDataSources();
      } catch (error) {
        console.error('Failed to initialize data agents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, [dataAgent]);

  const navigation = [
    { id: 'status', name: 'Launch Status', icon: RocketLaunchIcon },
    { id: 'calendar', name: 'Calendar', icon: CalendarIcon },
    { id: 'content', name: 'Artifacts Tracker', icon: DocumentTextIcon },
    { id: 'workflow', name: 'Content Review Agent', icon: DocumentTextIcon },
    { id: 'performance', name: 'Performance Monitor Agent', icon: DocumentTextIcon },
  ];

  const handleNavigateToArtifacts = (launchId: string) => {
    setSelectedProject(launchId);
    setActiveView('content');
  };

  const handleNavigateToContentReview = (launchId: string, artifactId: string) => {
    setSelectedProject(launchId);
    setActiveView('content');
    // Store the artifact ID to highlight it when navigating to content tracker
    setTimeout(() => {
      const element = document.getElementById(`artifact-${artifactId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-red-500', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2');
        }, 3000);
      }
    }, 100);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'status':
        return <LaunchStatusOverview launches={launches} onNavigateToArtifacts={handleNavigateToArtifacts} onNavigateToContentReview={handleNavigateToContentReview} />;
      case 'calendar':
        return (
          <CalendarView 
            launches={launches} 
            currentDate={calendarDate}
            onDateChange={setCalendarDate}
            viewMode="month"
          />
        );
      case 'content':
        return <LaunchArtifactsTracker launches={launches} selectedProject={selectedProject} />;
      case 'workflow':
        return <AgentWorkflowSimulator />;
      case 'performance':
        return <PerformanceMonitor />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Launch Readiness Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Track Outshift Marketing Launches</p>
            </div>
            <div className="flex items-center space-x-4">
              {isLoading && (
                <div className="flex items-center text-sm text-gray-500">
                  <CogIcon className="h-4 w-4 animate-spin mr-2" />
                  Syncing data...
                </div>
              )}
              <div className="text-sm text-gray-500">
                {launches.length} launches tracked
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewType)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeView === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {renderContent()}
      </main>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-center text-sm text-gray-500">
              &copy; 2025 Launch Dashboard. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Integrating: Jira • Airtable • Confluence • GitHub • SharePoint
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Enhanced Agent Workflow Simulator Component
const AgentWorkflowSimulator: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedContent, setSelectedContent] = useState('HAX Announcement Blog');
  const [workflowSteps, setWorkflowSteps] = useState([
    { name: 'Agent Curates Project Content', status: 'pending', type: 'automated' },
    { name: 'Content Assigned to Author', status: 'pending', type: 'automated' },
    { name: 'Author Drafts Content', status: 'pending', type: 'human', reviewer: 'Marc' },
    { name: 'Reviewer 1 Review', status: 'pending', type: 'human', reviewer: 'Leah' },
    { name: 'Vijoy Review', status: 'pending', type: 'human', reviewer: 'Vijoy' },
    { name: 'Ready to Publish', status: 'pending', type: 'automated' },
    { name: 'Publish Content', status: 'pending', type: 'human', reviewer: 'Noelle' }
  ]);
  const [emailNotification, setEmailNotification] = useState<string | null>(null);
  const [contentEdits, setContentEdits] = useState<string | null>(null);
  const [editSummary, setEditSummary] = useState<string | null>(null);
  const [curatedContent, setCuratedContent] = useState<string | null>(null);

  const contentOptions = [
    'HAX Announcement Blog',
    'CI Vision Launch Whitepaper',
    'Qunnect Launch Blog',
    'HAX Demo Video',
    'CI Messaging Guide'
  ];

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(0);
    setEmailNotification(null);
    setContentEdits(null);
    setEditSummary(null);
    
    const initialSteps = [
      { name: 'Agent Curates Project Content', status: 'pending', type: 'automated' },
      { name: 'Content Assigned to Author', status: 'pending', type: 'automated' },
      { name: 'Author Drafts Content', status: 'pending', type: 'human', reviewer: 'Marc' },
      { name: 'Reviewer 1 Review', status: 'pending', type: 'human', reviewer: 'Leah' },
      { name: 'Vijoy Review', status: 'pending', type: 'human', reviewer: 'Vijoy' },
      { name: 'Ready to Publish', status: 'pending', type: 'automated' },
      { name: 'Publish Content', status: 'pending', type: 'human', reviewer: 'Noelle' }
    ];
    
    setWorkflowSteps(initialSteps);
    setCuratedContent(null);
    let stepIndex = 0;
    
    const progressWorkflow = () => {
      if (stepIndex < initialSteps.length) {
        setWorkflowSteps(prev => {
          const updated = [...prev];
          // Mark previous step as completed if it exists
          if (stepIndex > 0 && updated[stepIndex - 1]) {
            updated[stepIndex - 1].status = 'completed';
          }
          // Set current step to in_progress
          if (updated[stepIndex]) {
            updated[stepIndex].status = 'in_progress';
          }
          return updated;
        });
        
        setCurrentStep(stepIndex);
        
        // Content curation when agent starts
        if (stepIndex === 0) {
          setTimeout(() => {
            setCuratedContent(`Agent curated content for "${selectedContent}":
• Confluence: Extracted 3 key technical specifications and 5 customer interviews
• Jira: Identified 12 completed epics
• SharePoint: Retrieved 4 case studies and 6 competitive analysis documents
• Customer Value Points: Accelerated MAS deployments by 40%, reduced operational costs by 35%, improved security posture by 60%`);
          }, 1500);
        }
        
        // Email notification when Vijoy's review starts
        if (stepIndex === 4) {
          setEmailNotification(`Email sent to Vijoy: "${selectedContent}" ready for review`);
          setTimeout(() => {
            setContentEdits(`Vijoy is editing "${selectedContent}"...`);
          }, 1000);
        }
        
        setTimeout(() => {
          setWorkflowSteps(prev => {
            const updated = [...prev];
            if (updated[stepIndex]) {
              updated[stepIndex].status = 'completed';
            }
            return updated;
          });
          
          // Edit summary when Vijoy completes review
          if (stepIndex === 4) {
            setEditSummary(`Vijoy's edits sent to Leah and Marc. Edit summary: "Updated messaging and added key insights for ${selectedContent}"`);
          }
          
          stepIndex++;
          
          if (stepIndex < initialSteps.length) {
            setTimeout(progressWorkflow, 1000);
          } else {
            setIsSimulating(false);
            // Keep all steps as completed and maintain expanded details
            setCurrentStep(-1); // Remove active step but keep completed state
          }
        }, 2000);
      }
    };
    
    // Immediately complete first step
    setWorkflowSteps(prev => {
      const updated = [...prev];
      updated[0].status = 'completed';
      return updated;
    });
    
    setTimeout(progressWorkflow, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Agent Workflow Simulator</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Content Review & Approval Workflow</h3>
        <p className="text-gray-600 mb-4">
          This simulation demonstrates how an AI agent can automate the content review process, 
          with human-in-the-loop steps for critical approvals.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Content to Review:
          </label>
          <select
            value={selectedContent}
            onChange={(e) => setSelectedContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {contentOptions.map(content => (
              <option key={content} value={content}>{content}</option>
            ))}
          </select>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">Currently Reviewing:</h4>
          <p className="text-blue-800 font-medium">{selectedContent}</p>
          <p className="text-sm text-blue-600 mt-1">
            This content will flow through the automated review workflow below.
          </p>
        </div>
        
        <button
          onClick={startSimulation}
          disabled={isSimulating}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSimulating ? 'Simulation Running...' : 'Start Workflow Simulation'}
        </button>
      </div>

      
      <div className="space-y-4">
        {workflowSteps.map((step, index) => (
          <div 
            key={index} 
            className={`flex items-start space-x-4 p-4 border rounded-lg transition-all ${
              index === currentStep && isSimulating ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className={`w-4 h-4 rounded-full transition-all flex items-center justify-center ${
              step.status === 'completed' ? 'bg-green-500' :
              step.status === 'in_progress' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
            }`}>
              {step.status === 'completed' && (
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${
                index === currentStep && isSimulating ? 'text-blue-900' : ''
              }`}>
                {step.name}
                {index === currentStep && isSimulating && (
                  <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">Active</span>
                )}
                {step.status === 'completed' && (
                  <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">Completed ✓</span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {step.type === 'automated' ? 'Automated Step' : 
                 step.name === 'Author Drafts Content' ? `Author - ${step.reviewer || 'Author'}` :
                 step.name === 'Publish Content' ? `Publisher - ${step.reviewer || 'Author'}` :
                 `Human Review - ${step.reviewer || 'Author'}`}
              </div>
              
              {/* Inline content details for proceeding steps */}
              {index === 0 && (currentStep === 0 || !isSimulating) && (
                <div className="mt-2 text-sm space-y-2">
                  {(currentStep === 0 || !isSimulating) && curatedContent && (
                    <div className="text-purple-700 bg-purple-50 p-2 rounded">
                      <span className="font-medium">Content Curation Complete:</span>
                      <div className="whitespace-pre-line mt-1">{curatedContent}</div>
                    </div>
                  )}
                </div>
              )}
              {index === 4 && (currentStep === 4 || !isSimulating) && (
                <div className="mt-2 text-sm space-y-2">
                  {(currentStep === 4 || !isSimulating) && emailNotification && (
                    <div className="text-green-700 bg-green-50 p-2 rounded">
                      <span className="font-medium">Email sent to Vijoy:</span> "{selectedContent}" ready for review
                    </div>
                  )}
                  {(currentStep === 4 || !isSimulating) && contentEdits && (
                    <div className="text-yellow-700 bg-yellow-50 p-2 rounded">
                      <span className="font-medium">Vijoy is editing:</span> "{selectedContent}"...
                    </div>
                  )}
                  {(currentStep === 4 || !isSimulating) && editSummary && (
                    <div className="text-blue-700 bg-blue-50 p-2 rounded">
                      <span className="font-medium">Vijoy's edits sent to Leah and Marc. Edit summary:</span> "Updated messaging and added key insights for {selectedContent}"
                    </div>
                  )}
                </div>
              )}
              
              {/* Timestamp for completed steps */}
              {step.status === 'completed' && (
                <div className="mt-1 text-xs text-gray-400">
                  Completed at {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>
            {step.reviewer && (
              <div className="text-sm">
                {step.status === 'in_progress' && index === currentStep ? (
                  <span className="text-blue-600 font-medium">Reviewing...</span>
                ) : step.status === 'completed' ? (
                  <span className="text-green-600 font-medium">Approved ✓</span>
                ) : (
                  <span className="text-gray-400">Pending</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Post-Launch Performance Agent Component
const PostLaunchPerformanceAgent: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLaunch, setSelectedLaunch] = useState('HAX Launch');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [viewMode, setViewMode] = useState<'cumulative' | 'netnew'>('cumulative');
  const [alerts, setAlerts] = useState<string[]>([]);
  const [executiveSummary, setExecutiveSummary] = useState<string | null>(null);
  const [metrics, setMetrics] = useState([
    { name: 'Social Media Engagement', status: 'pending', type: 'social', value: 0, target: 5000, wow: 0 },
    { name: 'Blog Post Views', status: 'pending', type: 'content', value: 0, target: 3500, wow: 0 },
    { name: 'White Paper Downloads', status: 'pending', type: 'conversion', value: 0, target: 180, wow: 0 },
    { name: 'Website Traffic', status: 'pending', type: 'traffic', value: 0, target: 8000, wow: 0 },
    { name: 'Lead Conversions', status: 'pending', type: 'conversion', value: 0, target: 320, wow: 0 },
    { name: 'Content Engagement Score', status: 'pending', type: 'engagement', value: 0, target: 85, wow: 0 }
  ]);
  const [insights, setInsights] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [weeklyData, setWeeklyData] = useState([
    { week: 'Nov 10', blog: 234, social: 3234, whitepaper: 45, website: 5678 },
    { week: 'Nov 17', blog: 456, social: 3876, whitepaper: 67, website: 6234 },
    { week: 'Nov 24', blog: 678, social: 4234, whitepaper: 89, website: 7123 },
    { week: 'Dec 1', blog: 890, social: 5234, whitepaper: 123, website: 8456 },
    { week: 'Dec 8', blog: 1234, social: 6123, whitepaper: 167, website: 9234 },
    { week: 'Dec 15', blog: 1567, social: 7234, whitepaper: 203, website: 10234 }
  ]);
  const [blogData, setBlogData] = useState([
    { week: 'Nov 10', views: 234, downloads: 12 },
    { week: 'Nov 17', views: 456, downloads: 23 },
    { week: 'Nov 24', views: 678, downloads: 34 },
    { week: 'Dec 1', views: 890, downloads: 45 },
    { week: 'Dec 8', views: 1234, downloads: 56 },
    { week: 'Dec 15', views: 1567, downloads: 67 }
  ]);
  const [socialData, setSocialData] = useState([
    { week: 'Nov 10', engagement: 3234, trend: 'up', change: 12 },
    { week: 'Nov 17', engagement: 3876, trend: 'up', change: 20 },
    { week: 'Nov 24', engagement: 4234, trend: 'up', change: 9 },
    { week: 'Dec 1', engagement: 5234, trend: 'up', change: 24 },
    { week: 'Dec 8', engagement: 6123, trend: 'up', change: 17 },
    { week: 'Dec 15', engagement: 7234, trend: 'up', change: 18 }
  ]);
  const [whitepaperData, setWhitepaperData] = useState([
    { week: 'Nov 10', downloads: 45, trend: 'up', change: 8 },
    { week: 'Nov 17', downloads: 67, trend: 'up', change: 15 },
    { week: 'Nov 24', downloads: 89, trend: 'up', change: 12 },
    { week: 'Dec 1', downloads: 123, trend: 'up', change: 20 },
    { week: 'Dec 8', downloads: 167, trend: 'up', change: 18 },
    { week: 'Dec 15', downloads: 203, trend: 'up', change: 22 }
  ]);
  const [metricsAnalysis, setMetricsAnalysis] = useState<string | null>(null);
  const [agentInsights, setAgentInsights] = useState<string[]>([]);
  const [autonomousAction, setAutonomousAction] = useState<string | null>(null);
  const [patternRecognized, setPatternRecognized] = useState<string | null>(null);
  const [competitiveIntel, setCompetitiveIntel] = useState<string | null>(null);

  const launchOptions = [
    'HAX Launch',
    'CI Vision Launch',
    'Qunnect Launch',
    'AGNTCY Directory Launch'
  ];

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setInsights(null);
    setRecommendations(null);
    setMetricsAnalysis(null);
    setAgentInsights([]);
    setAutonomousAction(null);
    setPatternRecognized(null);
    setCompetitiveIntel(null);
    setAlerts([]);
    setExecutiveSummary(null);
    
    const initialMetrics = [
      { name: 'Social Media Engagement', status: 'pending', type: 'social', value: 0, target: 5000, wow: 0 },
      { name: 'Blog Post Views', status: 'pending', type: 'content', value: 0, target: 3500, wow: 0 },
      { name: 'White Paper Downloads', status: 'pending', type: 'conversion', value: 0, target: 180, wow: 0 },
      { name: 'Website Traffic', status: 'pending', type: 'traffic', value: 0, target: 8000, wow: 0 },
      { name: 'Lead Conversions', status: 'pending', type: 'conversion', value: 0, target: 320, wow: 0 },
      { name: 'Content Engagement Score', status: 'pending', type: 'engagement', value: 0, target: 85, wow: 0 }
    ];
    
    setMetrics(initialMetrics);
    let metricIndex = 0;
    
    const analyzeMetrics = () => {
      if (metricIndex < initialMetrics.length) {
        setMetrics(prev => {
          const updated = [...prev];
          if (metricIndex > 0 && updated[metricIndex - 1]) {
            updated[metricIndex - 1].status = 'completed';
          }
          if (updated[metricIndex]) {
            updated[metricIndex].status = 'in_progress';
            // Simulate metric values based on launch with WoW metrics
            const metricValues = {
              'HAX Launch': [7234, 1567, 203, 10234, 356, 89],
              'CI Vision Launch': [6123, 1234, 167, 9234, 298, 76],
              'Qunnect Launch': [5234, 1123, 189, 8456, 312, 82],
              'AGNTCY Directory Launch': [6567, 1345, 195, 9678, 334, 85]
            };
            const wowValues = {
              'HAX Launch': [18, 25, 22, 15, 12, 8],
              'CI Vision Launch': [15, 18, 20, 12, 10, 5],
              'Qunnect Launch': [12, 15, 18, 8, 8, 6],
              'AGNTCY Directory Launch': [17, 20, 15, 14, 11, 7]
            };
            const values = metricValues[selectedLaunch as keyof typeof metricValues] || metricValues['HAX Launch'];
            const wow = wowValues[selectedLaunch as keyof typeof wowValues] || wowValues['HAX Launch'];
            updated[metricIndex].value = values[metricIndex];
            updated[metricIndex].wow = wow[metricIndex];
          }
          return updated;
        });
        
        setAnalysisStep(metricIndex);
        
        // Demonstrate agent capabilities during analysis
        if (metricIndex === 1) {
          setPatternRecognized("🤖 Pattern Recognition: LinkedIn posts on Tuesdays perform 40% better than other days");
          setAgentInsights(prev => [...prev, "📊 Cross-platform analysis shows video content drives 3x more engagement than text"]);
        }
        if (metricIndex === 2) {
          setCompetitiveIntel("🎯 Competitive Intelligence: Competitor A's similar webinar got 45% fewer sign-ups");
        }
        if (metricIndex === 3) {
          setAutonomousAction("🚀 Autonomous Action: Automatically increased LinkedIn ad budget by 25% based on performance");
        }
        
        setTimeout(() => {
          setMetrics(prev => {
            const updated = [...prev];
            if (updated[metricIndex]) {
              updated[metricIndex].status = 'completed';
            }
            return updated;
          });
          
          metricIndex++;
          
          if (metricIndex < initialMetrics.length) {
            setTimeout(analyzeMetrics, 800);
          } else {
            // Generate insights, recommendations, and metrics analysis
            setTimeout(() => {
              const totalEngagement = metrics.reduce((sum, m) => sum + m.value, 0);
              const avgPerformance = Math.round((totalEngagement / metrics.length) / 100);
              const topPerformer = metrics.reduce((max, m) => m.value > max.value ? m : max, metrics[0]);
              
              setInsights(`Analysis complete for ${selectedLaunch}. Overall performance exceeds targets by 12%. Social media engagement is the standout performer with 23% above target.`);
              setRecommendations(`Recommendations: 1) Double down on LinkedIn content strategy 2) Optimize webinar registration flow 3) Create more downloadable assets similar to top-performing white paper`);
              setMetricsAnalysis(`Performance Analysis: Total engagement: ${totalEngagement.toLocaleString()}, Average achievement: ${avgPerformance}%, Top performer: ${topPerformer.name} (${Math.round((topPerformer.value / topPerformer.target) * 100)}% of target)`);
              setIsAnalyzing(false);
              setAnalysisStep(-1);
            }, 1000);
          }
        }, 1500);
      }
    };
    
    setTimeout(analyzeMetrics, 800);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Post-Launch Performance Agent</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Launch Performance Analysis</h3>
        <p className="text-gray-600 mb-4">
          AI-powered analysis of post-launch success metrics including social engagement, content performance, and conversion tracking.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Launch to Analyze:
          </label>
          <select
            value={selectedLaunch}
            onChange={(e) => setSelectedLaunch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {launchOptions.map(launch => (
              <option key={launch} value={launch}>{launch}</option>
            ))}
          </select>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">Currently Analyzing:</h4>
          <p className="text-blue-800 font-medium">{selectedLaunch}</p>
          <p className="text-sm text-blue-600 mt-1">
            Tracking social engagement, content performance, and conversion metrics.
          </p>
        </div>
        
        <button
          onClick={startAnalysis}
          disabled={isAnalyzing}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isAnalyzing ? 'Analysis Running...' : 'Start Performance Analysis'}
        </button>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className={`flex items-start space-x-4 p-4 border rounded-lg transition-all ${
              index === analysisStep && isAnalyzing ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className={`w-4 h-4 rounded-full transition-all flex items-center justify-center ${
              metric.status === 'completed' ? 'bg-green-500' :
              metric.status === 'in_progress' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
            }`}>
              {metric.status === 'completed' && (
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${
                index === analysisStep && isAnalyzing ? 'text-blue-900' : ''
              }`}>
                {metric.name}
                {index === analysisStep && isAnalyzing && (
                  <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">Analyzing</span>
                )}
                {metric.status === 'completed' && (
                  <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">Completed ✓</span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {metric.type === 'social' ? 'Social Media Metric' : 
                 metric.type === 'conversion' ? 'Conversion Tracking' : 'Engagement Score'}
              </div>
              
              {/* Metric value display */}
              {metric.status === 'completed' && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Performance: {metric.value.toLocaleString()} / {metric.target.toLocaleString()}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        metric.value >= metric.target ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {Math.round((metric.value / metric.target) * 100)}%
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        metric.wow > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        WoW: {metric.wow > 0 ? '+' : ''}{metric.wow}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Timestamp for completed metrics */}
              {metric.status === 'completed' && (
                <div className="mt-1 text-xs text-gray-400">
                  Analyzed at {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Trending Graph */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">Weekly Social Media Engagement</h4>
        <div className="space-y-3">
          {weeklyData.map((week, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-medium text-gray-700">{week.week}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div 
                      className="h-6 rounded-full transition-all bg-blue-500"
                      style={{ width: `${(week.social / 8000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{week.social.toLocaleString()}</span>
                    <div className="flex items-center text-xs text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{index > 0 ? Math.round(((week.social - weeklyData[index - 1].social) / weeklyData[index - 1].social) * 100) : 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Trend:</span> Strong upward momentum with 6 consecutive weeks of social media growth
        </div>
      </div>

      {/* Metrics Analysis Section */}
      {metricsAnalysis && (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2">Metrics Analysis</h4>
          <p className="text-purple-800">{metricsAnalysis}</p>
        </div>
      )}

      {/* Insights Section */}
      {insights && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Performance Insights</h4>
          <p className="text-green-800">{insights}</p>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">AI Recommendations</h4>
          <p className="text-blue-800 whitespace-pre-line">{recommendations}</p>
        </div>
      )}
    </div>
  );
};

export default App;