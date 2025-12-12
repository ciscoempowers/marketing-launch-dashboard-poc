import React, { useState } from 'react';
import { format } from 'date-fns';
import { Launch, Content, ApprovalStatus, ContentStatus } from '../types/launch';

interface ContentTrackerProps {
  launches: Launch[];
}

const ContentTracker: React.FC<ContentTrackerProps> = ({ launches }) => {
  const [selectedLaunch, setSelectedLaunch] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<ContentStatus | 'all'>('all');

  // Get all content from all launches
  const getAllContent = () => {
    const allContent: Array<{ content: Content; launchName: string; launchId: string }> = [];
    
    launches.forEach(launch => {
      launch.content.forEach(content => {
        allContent.push({
          content,
          launchName: launch.name,
          launchId: launch.id
        });
      });
    });

    return allContent;
  };

  const getFilteredContent = () => {
    const allContent = getAllContent();
    
    return allContent.filter(item => {
      const launchMatch = selectedLaunch === 'all' || item.launchId === selectedLaunch;
      const statusMatch = filterStatus === 'all' || item.content.status === filterStatus;
      return launchMatch && statusMatch;
    });
  };

  const getStatusColor = (status: ContentStatus): string => {
    switch (status) {
      case ContentStatus.PUBLISHED: return 'bg-green-100 text-green-800';
      case ContentStatus.APPROVED: return 'bg-blue-100 text-blue-800';
      case ContentStatus.IN_REVIEW: return 'bg-yellow-100 text-yellow-800';
      case ContentStatus.DRAFT: return 'bg-gray-100 text-gray-800';
      case ContentStatus.REJECTED: return 'bg-red-100 text-red-800';
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

  const getCompletionPercentage = (content: Content): number => {
    const totalSteps = content.approvalChain.length;
    if (totalSteps === 0) return 0;
    
    const completedSteps = content.approvalChain.filter(step => 
      step.status === ApprovalStatus.APPROVED || step.status === ApprovalStatus.SKIPPED
    ).length;
    
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const filteredContent = getFilteredContent();

  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Artifact Tracking & Approval Workflow</h3>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Launch</label>
            <select
              value={selectedLaunch}
              onChange={(e) => setSelectedLaunch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Launches</option>
              {launches.map(launch => (
                <option key={launch.id} value={launch.id}>{launch.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ContentStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value={ContentStatus.DRAFT}>Draft</option>
              <option value={ContentStatus.IN_REVIEW}>In Review</option>
              <option value={ContentStatus.APPROVED}>Approved</option>
              <option value={ContentStatus.PUBLISHED}>Published</option>
              <option value={ContentStatus.REJECTED}>Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Launch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artifact Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Update
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviewer 1
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vijoy
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredContent.map((item) => {
              const content = item.content;
              const completion = getCompletionPercentage(content);
              
              return (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.launchName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{content.name}</div>
                      {content.description && (
                        <div className="text-sm text-gray-500">{content.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{content.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{content.owner}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(content.targetDate, 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                      {content.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {content.actualDate ? format(content.actualDate, 'MMM d, yyyy') : 'Not updated'}
                    </div>
                  </td>
                  {/* Reviewer 1 column (excluding Vijoy) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const nonVijoyReviewers = content.approvalChain.filter(step => step.approver !== 'Vijoy');
                      return nonVijoyReviewers.length > 0 ? (
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900 font-medium">
                            {nonVijoyReviewers[0].approver}
                          </div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getApprovalStatusColor(nonVijoyReviewers[0].status)} mt-1`}>
                            {nonVijoyReviewers[0].status}
                          </span>
                          {nonVijoyReviewers[0].approvedAt && (
                            <span className="text-xs text-gray-500 mt-1">
                              {format(nonVijoyReviewers[0].approvedAt, 'MMM d')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      );
                    })()}
                  </td>
                  {/* Vijoy column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const vijoyApproval = content.approvalChain.find(step => step.approver === 'Vijoy');
                      return vijoyApproval ? (
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getApprovalStatusColor(vijoyApproval.status)}`}>
                            {vijoyApproval.status}
                          </span>
                          {vijoyApproval.approvedAt && (
                            <span className="text-xs text-gray-500 mt-1">
                              {format(vijoyApproval.approvedAt, 'MMM d')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      );
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No artifact items found matching the current filters.
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{filteredContent.length}</div>
          <div className="text-sm text-gray-600">Total Artifacts</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {filteredContent.filter(item => item.content.status === ContentStatus.PUBLISHED).length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredContent.filter(item => item.content.status === ContentStatus.IN_REVIEW).length}
          </div>
          <div className="text-sm text-gray-600">In Review</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {filteredContent.filter(item => item.content.status === ContentStatus.DRAFT).length}
          </div>
          <div className="text-sm text-gray-600">Draft</div>
        </div>
      </div>
    </div>
  );
};

export default ContentTracker;
