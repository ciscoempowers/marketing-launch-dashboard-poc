import React from 'react';
import { format } from 'date-fns';

interface TimelineEvent {
  id: number;
  title: string;
  date: Date;
  completed: boolean;
  description: string;
}

interface LaunchTimelineProps {
  events: TimelineEvent[];
}

const LaunchTimeline: React.FC<LaunchTimelineProps> = ({ events }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Launch Timeline</h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                event.completed ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                {event.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {index < events.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex justify-between items-center">
                <h4 className={`font-medium ${event.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                  {event.title}
                </h4>
                <span className="text-sm text-gray-500">
                  {format(event.date, 'MMM d, yyyy')}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaunchTimeline;
