import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval, isSameMonth, differenceInDays } from 'date-fns';
import { Launch, LaunchStatus, RiskLevel } from '../types/launch';
import { RocketLaunchIcon, CalendarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface LaunchRoadmapProps {
  launches: Launch[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const LaunchRoadmap: React.FC<LaunchRoadmapProps> = ({ launches, currentDate, onDateChange }) => {
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);

  const getStatusColor = (status: LaunchStatus): string => {
    switch (status) {
      case LaunchStatus.COMPLETED: return 'bg-green-500';
      case LaunchStatus.ON_TRACK: return 'bg-blue-500';
      case LaunchStatus.AT_RISK: return 'bg-yellow-500';
      case LaunchStatus.DELAYED: return 'bg-red-500';
      case LaunchStatus.IN_PROGRESS: return 'bg-blue-400';
      case LaunchStatus.PLANNING: return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRiskIndicator = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.CRITICAL:
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case RiskLevel.HIGH:
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />;
      case RiskLevel.MEDIUM:
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case RiskLevel.LOW:
        return <div className="h-4 w-4 rounded-full bg-green-500"></div>;
      default:
        return null;
    }
  };

  const getMonthsInRange = () => {
    const startDate = startOfMonth(currentDate);
    const endDate = addMonths(startDate, 5); // Show 6 months total
    return eachMonthOfInterval({ start: startDate, end: endDate });
  };

  const getLaunchPosition = (launchDate: Date, monthStart: Date) => {
    const daysInMonth = differenceInDays(endOfMonth(monthStart), monthStart);
    const dayOfMonth = differenceInDays(launchDate, monthStart);
    return Math.max(0, Math.min(100, (dayOfMonth / daysInMonth) * 100));
  };

  const months = getMonthsInRange();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Launch Roadmap</h3>
          <p className="text-sm text-gray-500">6-month view of upcoming launches</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onDateChange(subMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <span className="text-sm font-medium">
            {format(currentDate, 'MMM yyyy')} - {format(addMonths(currentDate, 5), 'MMM yyyy')}
          </span>
          <button
            onClick={() => onDateChange(addMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Month headers */}
          <div className="flex border-b-2 border-gray-200 pb-4 mb-6">
            <div className="w-64 flex-shrink-0"></div>
            {months.map((month, index) => (
              <div key={index} className="flex-1 text-center">
                <div className="text-sm font-medium text-gray-700">
                  {format(month, 'MMM')}
                </div>
                <div className="text-xs text-gray-500">
                  {format(month, 'yyyy')}
                </div>
              </div>
            ))}
          </div>

          {/* Launch rows */}
          <div className="space-y-4">
            {launches.map((launch) => (
              <div
                key={launch.id}
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedLaunch(launch)}
              >
                {/* Launch info */}
                <div className="w-64 flex-shrink-0 pr-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(launch.status)}`}></div>
                    <h4 className="font-medium text-sm">{launch.name}</h4>
                    {getRiskIndicator(launch.riskLevel)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {format(launch.launchDate, 'MMM d, yyyy')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {launch.completionPercentage}% complete
                  </div>
                </div>

                {/* Timeline visualization */}
                <div className="flex-1 relative h-12">
                  {/* Month grid */}
                  <div className="absolute inset-0 flex">
                    {months.map((month, index) => (
                      <div key={index} className="flex-1 border-r border-gray-200 last:border-r-0"></div>
                    ))}
                  </div>

                  {/* Launch marker */}
                  {months.map((month, index) => {
                    if (isSameMonth(launch.launchDate, month)) {
                      const position = getLaunchPosition(launch.launchDate, month);
                      return (
                        <div
                          key={`marker-${launch.id}`}
                          className="absolute h-8 w-8 flex items-center justify-center"
                          style={{
                            left: `${(index / months.length) * 100 + (position / 100) * (100 / months.length)}%`,
                            transform: 'translateX(-50%)'
                          }}
                        >
                          <div className={`w-6 h-6 rounded-full ${getStatusColor(launch.status)} border-2 border-white shadow-lg flex items-center justify-center`}>
                            <RocketLaunchIcon className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}

                  {/* Progress bar */}
                  <div className="absolute inset-0 flex items-center px-2">
                    <div className="w-full h-1 bg-gray-200 rounded">
                      <div
                        className={`h-1 rounded ${getStatusColor(launch.status)}`}
                        style={{ width: `${launch.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <div className="w-32 flex-shrink-0 pl-4 text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    launch.status === LaunchStatus.ON_TRACK ? 'bg-blue-100 text-blue-800' :
                    launch.status === LaunchStatus.AT_RISK ? 'bg-yellow-100 text-yellow-800' :
                    launch.status === LaunchStatus.DELAYED ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {launch.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected launch details */}
      {selectedLaunch && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-lg">{selectedLaunch.name}</h4>
              <p className="text-sm text-gray-600">{selectedLaunch.description}</p>
            </div>
            <button
              onClick={() => setSelectedLaunch(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Launch Date</p>
              <p className="text-sm text-gray-900">{format(selectedLaunch.launchDate, 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Status</p>
              <p className="text-sm text-gray-900">{selectedLaunch.status.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Risk Level</p>
              <p className="text-sm text-gray-900">{selectedLaunch.riskLevel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Team</p>
              <p className="text-sm text-gray-900 capitalize">{selectedLaunch.team}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Completion</p>
              <p className="text-sm text-gray-900">{selectedLaunch.completionPercentage}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Artifacts</p>
              <p className="text-sm text-gray-900">{selectedLaunch.artifacts.length}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Key Milestones</p>
            <div className="space-y-1">
              {selectedLaunch.milestones.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="flex justify-between text-sm">
                  <span>{milestone.name}</span>
                  <span className="text-gray-500">{format(milestone.targetDate, 'MMM d')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>On Track</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span>At Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span>Delayed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
          <span>Planning</span>
        </div>
      </div>
    </div>
  );
};

export default LaunchRoadmap;
