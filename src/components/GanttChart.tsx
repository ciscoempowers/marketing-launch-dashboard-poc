import React, { useState } from 'react';
import { format, differenceInDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Launch, Milestone, Artifact, Content, LaunchStatus, RiskLevel } from '../types/launch';

interface GanttChartProps {
  launches: Launch[];
  viewRange: { start: Date; end: Date };
}

interface GanttItem {
  id: string;
  name: string;
  launchId: string;
  type: 'launch' | 'milestone' | 'artifact' | 'content';
  startDate: Date;
  endDate: Date;
  status: LaunchStatus | string;
  riskLevel?: RiskLevel;
  owner?: string;
  progress?: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ launches, viewRange }) => {
  const [selectedItem, setSelectedItem] = useState<GanttItem | null>(null);

  // Transform launches into Gantt items
  const getGanttItems = (): GanttItem[] => {
    const items: GanttItem[] = [];

    launches.forEach(launch => {
      // Add main launch item
      items.push({
        id: launch.id,
        name: launch.name,
        launchId: launch.id,
        type: 'launch',
        startDate: addDays(launch.launchDate, -30), // Assume 30-day prep
        endDate: launch.launchDate,
        status: launch.status,
        riskLevel: launch.riskLevel,
        progress: launch.completionPercentage
      });

      // Add milestones
      launch.milestones.forEach(milestone => {
        items.push({
          id: milestone.id,
          name: milestone.name,
          launchId: launch.id,
          type: 'milestone',
          startDate: milestone.targetDate,
          endDate: milestone.targetDate,
          status: milestone.status,
          owner: milestone.assignee
        });
      });

      // Add artifacts
      launch.artifacts.forEach(artifact => {
        items.push({
          id: artifact.id,
          name: artifact.name,
          launchId: launch.id,
          type: 'artifact',
          startDate: addDays(artifact.targetDate, -7), // Assume 1-week work
          endDate: artifact.targetDate,
          status: artifact.status,
          owner: artifact.owner
        });
      });

      // Add content
      launch.content.forEach(content => {
        items.push({
          id: content.id,
          name: content.name,
          launchId: launch.id,
          type: 'content',
          startDate: addDays(content.targetDate, -5), // Assume 5-day work
          endDate: content.targetDate,
          status: content.status,
          owner: content.owner
        });
      });
    });

    return items;
  };

  const getStatusColor = (status: string, type: string): string => {
    if (type === 'launch') {
      switch (status) {
        case 'on_track': return 'bg-green-500';
        case 'at_risk': return 'bg-yellow-500';
        case 'delayed': return 'bg-red-500';
        case 'completed': return 'bg-blue-500';
        default: return 'bg-gray-400';
      }
    }
    
    switch (status) {
      case 'completed': case 'approved': case 'published': return 'bg-green-500';
      case 'in_progress': case 'in_review': case 'testing': return 'bg-blue-500';
      case 'not_started': case 'draft': return 'bg-gray-400';
      case 'blocked': case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getRiskColor = (riskLevel?: RiskLevel): string => {
    if (!riskLevel) return '';
    switch (riskLevel) {
      case 'low': return 'border-green-300';
      case 'medium': return 'border-yellow-300';
      case 'high': return 'border-orange-300';
      case 'critical': return 'border-red-300';
      default: return 'border-gray-300';
    }
  };

  const calculatePosition = (startDate: Date, endDate: Date): { left: number; width: number } => {
    const totalDays = differenceInDays(viewRange.end, viewRange.start);
    const startOffset = differenceInDays(startDate, viewRange.start);
    const duration = differenceInDays(endDate, startDate) || 1; // Minimum 1 day

    return {
      left: (startOffset / totalDays) * 100,
      width: (duration / totalDays) * 100
    };
  };

  const getMonths = () => {
    const months = [];
    let current = startOfMonth(viewRange.start);
    while (current <= viewRange.end) {
      months.push(current);
      current = addDays(endOfMonth(current), 1);
    }
    return months;
  };

  const items = getGanttItems();
  const months = getMonths();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Launch Timeline Gantt Chart</h3>
        <p className="text-sm text-gray-500">
          {format(viewRange.start, 'MMM d, yyyy')} - {format(viewRange.end, 'MMM d, yyyy')}
        </p>
      </div>

      {/* Timeline header */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Month headers */}
          <div className="flex border-b-2 border-gray-200 pb-2 mb-4">
            <div className="w-48 flex-shrink-0"></div>
            {months.map((month, index) => (
              <div
                key={index}
                className="flex-1 text-center text-sm font-medium text-gray-600"
              >
                {format(month, 'MMMM yyyy')}
              </div>
            ))}
          </div>

          {/* Gantt items */}
          <div className="space-y-2">
            {items.map((item) => {
              const position = calculatePosition(item.startDate, item.endDate);
              const statusColor = getStatusColor(item.status, item.type);
              const riskBorder = getRiskColor(item.riskLevel);

              return (
                <div
                  key={item.id}
                  className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Item name and type */}
                  <div className="w-48 flex-shrink-0 pr-4">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${statusColor}`}></div>
                      <div>
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline bar */}
                  <div className="flex-1 relative h-8">
                    <div
                      className={`absolute h-6 rounded ${statusColor} ${riskBorder} border-2 ${item.type === 'milestone' ? 'w-2' : ''}`}
                      style={{
                        left: `${position.left}%`,
                        width: item.type === 'milestone' ? '8px' : `${position.width}%`,
                        minWidth: item.type === 'milestone' ? '8px' : '20px'
                      }}
                    >
                      {item.type !== 'milestone' && item.progress !== undefined && (
                        <div
                          className="absolute top-0 left-0 h-full bg-white bg-opacity-30 rounded"
                          style={{ width: `${100 - item.progress}%` }}
                        ></div>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="w-32 flex-shrink-0 pl-4 text-xs text-gray-500">
                    {format(item.startDate, 'MMM d')} - {format(item.endDate, 'MMM d')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected item details */}
      {selectedItem && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{selectedItem.name}</h4>
              <p className="text-sm text-gray-600 capitalize">{selectedItem.type}</p>
              <p className="text-sm text-gray-500 mt-1">
                {format(selectedItem.startDate, 'MMM d, yyyy')} - {format(selectedItem.endDate, 'MMM d, yyyy')}
              </p>
              {selectedItem.owner && (
                <p className="text-sm text-gray-500">Owner: {selectedItem.owner}</p>
              )}
              {selectedItem.progress !== undefined && (
                <p className="text-sm text-gray-500">Progress: {selectedItem.progress}%</p>
              )}
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span>Completed/Approved</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>In Progress/Review</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
          <span>At Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
          <span>Delayed/Blocked</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
          <span>Not Started</span>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
