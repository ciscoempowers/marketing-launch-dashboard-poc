import React, { useState } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { Launch, Artifact, ArtifactStatus, ContentType, Content, ApprovalStatus } from '../types/launch';

interface ContentTrackerProps {
  launches: Launch[];
}

const LaunchArtifactsTracker: React.FC<ContentTrackerProps> = ({ launches }) => {
  const [selectedLaunch, setSelectedLaunch] = useState<string>('all');

  // Get all artifacts from all launches
  const getAllArtifacts = () => {
    const allArtifacts: Array<{ 
      artifact: Artifact; 
      launchName: string; 
      launchId: string;
      launchDate: Date;
      linkedContent?: Content;
    }> = [];
    
    launches.forEach(launch => {
      launch.artifacts.forEach(artifact => {
        // Find linked content for approval information
        const linkedContent = launch.content.find(content => 
          content.linkedArtifacts.includes(artifact.id)
        );
        
        allArtifacts.push({
          artifact,
          launchName: launch.name,
          launchId: launch.id,
          launchDate: launch.launchDate,
          linkedContent
        });
      });
    });

    return allArtifacts;
  };

  const getFilteredArtifacts = () => {
    const allArtifacts = getAllArtifacts();
    
    return allArtifacts.filter(item => {
      const launchMatch = selectedLaunch === 'all' || item.launchId === selectedLaunch;
      return launchMatch;
    });
  };

  const getStatusColor = (status: ArtifactStatus): string => {
    switch (status) {
      case ArtifactStatus.COMPLETED: return 'bg-green-100 text-green-800';
      case ArtifactStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
      case ArtifactStatus.TESTING: return 'bg-yellow-100 text-yellow-800';
      case ArtifactStatus.NOT_STARTED: return 'bg-gray-100 text-gray-800';
      case ArtifactStatus.READY_TO_PUBLISH: return 'bg-purple-100 text-purple-800';
      case ArtifactStatus.BLOCKED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalStatusColor = (status: ApprovalStatus): string => {
    switch (status) {
      case ApprovalStatus.APPROVED: return 'bg-green-100 text-green-800';
      case ApprovalStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case ApprovalStatus.REJECTED: return 'bg-red-100 text-red-800';
      case ApprovalStatus.SKIPPED: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (targetDate: Date, status: ArtifactStatus): boolean => {
    return isPast(targetDate) && !isToday(targetDate) && status !== ArtifactStatus.COMPLETED;
  };

  const filteredArtifacts = getFilteredArtifacts();

  // Group artifacts by launch
  const getArtifactsByLaunch = () => {
    const grouped: { [key: string]: Array<{ 
      artifact: Artifact; 
      launchName: string; 
      launchId: string;
      launchDate: Date;
      linkedContent?: Content;
    }> } = {};
    
    filteredArtifacts.forEach(item => {
      if (!grouped[item.launchId]) {
        grouped[item.launchId] = [];
      }
      grouped[item.launchId].push(item);
    });
    
    return grouped;
  };

  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-[95vw] mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Launch Artifacts Tracker</h2>
        
        {/* Visual Launch Selection Buttons */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Launch</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedLaunch('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedLaunch === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Launches
            </button>
            {launches.map(launch => (
              <button
                key={launch.id}
                onClick={() => setSelectedLaunch(launch.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedLaunch === launch.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {launch.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Artifacts Table Grouped by Launch */}
      <div className="space-y-8">
        {Object.entries(getArtifactsByLaunch()).map(([launchId, items]) => {
          const launch = launches.find(l => l.id === launchId);
          return (
            <div key={launchId} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Launch Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{launch?.name}</h3>
                <p className="text-sm text-gray-600">
                  {items.length} artifacts • Launch Date: {format(items[0].launchDate, 'MMM d, yyyy')}
                </p>
              </div>
              
              {/* Artifacts Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">
                        Artifact Name
                      </th>
                      <th className="px-3 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                        Owner
                      </th>
                      <th className="px-3 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                        Publish Date
                      </th>
                      <th className="px-3 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                        Status
                      </th>
                      <th className="px-3 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                        Approver
                      </th>
                      <th className="px-3 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Review Start Date
                      </th>
                      <th className="px-3 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Approve By
                      </th>
                      <th className="px-3 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Approval Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => {
                      const artifact = item.artifact;
                      const overdue = isOverdue(artifact.targetDate, artifact.status);
                      const linkedContent = item.linkedContent;
                      const hasApproval = linkedContent && linkedContent.approvalChain.length > 0;
                      const firstApproval = hasApproval ? linkedContent.approvalChain[0] : null;
                      
                      return (
                        <tr 
                          key={artifact.id} 
                          className={`hover:bg-gray-50 ${
                            overdue ? 'bg-red-50 border-l-4 border-red-500' : ''
                          }`}
                        >
                          <td className="px-3 py-3">
                            <div className="text-base font-medium text-gray-900">
                              {artifact.name}
                              {overdue && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                  OVERDUE
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div className="text-base text-gray-900">{artifact.owner}</div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div className={`text-base ${
                              overdue ? 'text-red-600 font-medium' : 'text-gray-900'
                            }`}>
                              {format(artifact.targetDate, 'MMM d, yyyy')}
                              {overdue && (
                                <div className="text-sm text-red-500 mt-1">
                                  Overdue by {Math.ceil((new Date().getTime() - artifact.targetDate.getTime()) / (1000 * 60 * 60 * 24))} days
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(artifact.status)}`}>
                              {artifact.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {hasApproval && firstApproval ? (
                              <div className="text-base text-gray-900">{firstApproval.approver}</div>
                            ) : (
                              <span className="text-base text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {hasApproval && firstApproval?.reviewStartDate ? (
                              <div className="text-base text-gray-900">
                                {format(firstApproval.reviewStartDate, 'MMM d, yyyy')}
                              </div>
                            ) : (
                              <span className="text-base text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {hasApproval && firstApproval?.approvalDueDate ? (
                              <div className="text-base text-gray-900">
                                {format(firstApproval.approvalDueDate, 'MMM d, yyyy')}
                              </div>
                            ) : (
                              <span className="text-base text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {hasApproval && firstApproval ? (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getApprovalStatusColor(firstApproval.status)}`}>
                                {firstApproval.status}
                              </span>
                            ) : (
                              <span className="text-base text-gray-400">N/A</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {filteredArtifacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No artifacts found matching the current filters.
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{filteredArtifacts.length}</div>
          <div className="text-sm text-gray-600">Total Artifacts</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {filteredArtifacts.filter(item => item.artifact.status === ArtifactStatus.COMPLETED).length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {filteredArtifacts.filter(item => item.artifact.status === ArtifactStatus.IN_PROGRESS).length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {filteredArtifacts.filter(item => isOverdue(item.artifact.targetDate, item.artifact.status)).length}
          </div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>
    </div>
  );
};

export default LaunchArtifactsTracker;
