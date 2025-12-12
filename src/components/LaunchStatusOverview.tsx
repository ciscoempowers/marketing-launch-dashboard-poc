import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Launch, LaunchStatus, RiskLevel, Team } from '../types/launch';
import { 
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  UserGroupIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface LaunchStatusOverviewProps {
  launches: Launch[];
}

const LaunchStatusOverview: React.FC<LaunchStatusOverviewProps> = ({ launches }) => {
  const getStatusIcon = (status: LaunchStatus) => {
    switch (status) {
      case LaunchStatus.COMPLETED:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case LaunchStatus.ON_TRACK:
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case LaunchStatus.AT_RISK:
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case LaunchStatus.DELAYED:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case LaunchStatus.IN_PROGRESS:
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case LaunchStatus.PLANNING:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: LaunchStatus): string => {
    switch (status) {
      case LaunchStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case LaunchStatus.ON_TRACK:
        return 'bg-blue-100 text-blue-800';
      case LaunchStatus.AT_RISK:
        return 'bg-yellow-100 text-yellow-800';
      case LaunchStatus.DELAYED:
        return 'bg-red-100 text-red-800';
      case LaunchStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case LaunchStatus.PLANNING:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: RiskLevel): string => {
    switch (risk) {
      case RiskLevel.LOW:
        return 'bg-green-100 text-green-800 border-green-200';
      case RiskLevel.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RiskLevel.HIGH:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case RiskLevel.CRITICAL:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntilLaunch = (launchDate: Date): number => {
    return differenceInDays(launchDate, new Date());
  };

  const getCompletionColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTeamIcon = (team: Team) => {
    switch (team) {
      case Team.MARKETING:
        return <RocketLaunchIcon className="h-4 w-4" />;
      case Team.PRODUCT:
        return <DocumentTextIcon className="h-4 w-4" />;
      case Team.ENGINEERING:
        return <UserGroupIcon className="h-4 w-4" />;
      default:
        return <ChartBarIcon className="h-4 w-4" />;
    }
  };

  const sortedLaunches = [...launches].sort((a, b) => a.launchDate.getTime() - b.launchDate.getTime());

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Launches</p>
              <p className="text-2xl font-bold text-gray-900">{launches.length}</p>
            </div>
            <RocketLaunchIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">On Track</p>
              <p className="text-2xl font-bold text-green-600">
                {launches.filter(l => l.status === LaunchStatus.ON_TRACK).length}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">At Risk</p>
              <p className="text-2xl font-bold text-yellow-600">
                {launches.filter(l => l.status === LaunchStatus.AT_RISK).length}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Delayed</p>
              <p className="text-2xl font-bold text-red-600">
                {launches.filter(l => l.status === LaunchStatus.DELAYED).length}
              </p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Launch Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedLaunches.map((launch) => {
          const daysUntilLaunch = getDaysUntilLaunch(launch.launchDate);
          const isOverdue = daysUntilLaunch < 0 && launch.status !== LaunchStatus.COMPLETED;
          
          return (
            <div key={launch.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(launch.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{launch.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{launch.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        {getTeamIcon(launch.team)}
                        <span className="capitalize">{launch.team}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">Launch:</span>
                        <span className="font-medium">{format(launch.launchDate, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(launch.status)}`}>
                      {launch.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(launch.riskLevel)}`}>
                      {launch.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress and Metrics */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Completion</span>
                      <span className={`text-sm font-medium ${getCompletionColor(launch.completionPercentage)}`}>
                        {launch.completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${launch.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Days to Launch</span>
                      <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : daysUntilLaunch <= 7 ? 'text-yellow-600' : 'text-gray-900'}`}>
                        {isOverdue ? `${Math.abs(daysUntilLaunch)} days overdue` : daysUntilLaunch === 0 ? 'Today' : `${daysUntilLaunch} days`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isOverdue ? 'bg-red-600' : daysUntilLaunch <= 7 ? 'bg-yellow-600' : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, (30 - daysUntilLaunch) / 30 * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg font-semibold text-gray-900">{launch.artifacts.length}</div>
                    <div className="text-xs text-gray-600">Artifacts</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg font-semibold text-gray-900">{launch.content.length}</div>
                    <div className="text-xs text-gray-600">Content Items</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg font-semibold text-gray-900">{launch.milestones.length}</div>
                    <div className="text-xs text-gray-600">Milestones</div>
                  </div>
                </div>

                {/* Recent Activity Preview */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Recent Updates:</span> Last updated {format(launch.updatedAt, 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LaunchStatusOverview;
