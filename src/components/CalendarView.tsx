import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { Launch, Milestone, Content, Artifact } from '../types/launch';

interface CalendarViewProps {
  launches: Launch[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: 'month' | 'week' | 'year';
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'launch' | 'milestone' | 'content' | 'artifact';
  status: string;
  launchId: string;
  launchName: string;
  color: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ launches, currentDate, onDateChange, viewMode }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all']);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showHiddenItems, setShowHiddenItems] = useState<{ date: Date; events: CalendarEvent[] } | null>(null);

  // Filter launches by selected project
  const getFilteredLaunches = () => {
    if (selectedProject === 'all') {
      return launches;
    }
    return launches.filter(launch => launch.id === selectedProject);
  };

  // Transform launches into calendar events
  const getCalendarEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const filteredLaunches = getFilteredLaunches();

    filteredLaunches.forEach(launch => {
      // Add milestone deadlines (including launch dates)
      launch.milestones.forEach(milestone => {
        events.push({
          id: `milestone-${milestone.id}`,
          title: milestone.name,
          date: milestone.targetDate,
          type: 'milestone',
          status: milestone.status,
          launchId: launch.id,
          launchName: launch.name,
          color: getProjectColor(launch.id)
        });
      });
      
      // Add content deadlines
      launch.content.forEach(content => {
        events.push({
          id: `content-${content.id}`,
          title: content.name,
          date: content.targetDate,
          type: 'content',
          status: content.status,
          launchId: launch.id,
          launchName: launch.name,
          color: getProjectColor(launch.id)
        });
      });
      
      // Add artifact deadlines
      launch.artifacts.forEach(artifact => {
        events.push({
          id: `artifact-${artifact.id}`,
          title: artifact.name,
          date: artifact.targetDate,
          type: 'artifact',
          status: artifact.status,
          launchId: launch.id,
          launchName: launch.name,
          color: getProjectColor(launch.id)
        });
      });
    });

    // Filter by status if selected
    if (!selectedStatuses.includes('all')) {
      return events.filter(event => selectedStatuses.includes(event.status));
    }

    return events;
  };

  // Handle status selection
  const handleStatusToggle = (status: string) => {
    if (status === 'all') {
      setSelectedStatuses(['all']);
    } else {
      const newStatuses = selectedStatuses.includes('all') 
        ? [status]
        : selectedStatuses.includes(status)
          ? selectedStatuses.filter(s => s !== status)
          : [...selectedStatuses, status];
      
      // If no statuses selected, default to 'all'
      if (newStatuses.length === 0) {
        setSelectedStatuses(['all']);
      } else {
        setSelectedStatuses(newStatuses);
      }
    }
  };

  const projects = [
    { id: 'all', name: 'All Projects' },
    { id: 'collective-intelligence', name: 'Collective Intelligence' },
    { id: 'hax', name: 'HAX' },
    { id: 'qunnect', name: 'Qunnect' },
  ];

  const getProjectColor = (launchId: string): string => {
    switch (launchId) {
      case 'hax': return '#3B82F6'; // Blue
      case 'collective-intelligence': return '#10B981'; // Emerald  
      case 'qunnect': return '#8B5CF6'; // Violet
      default: return '#6B7280'; // Gray
    }
  };

  const getProjectColorLight = (launchId: string): string => {
    switch (launchId) {
      case 'hax': return '#DBEAFE'; // Light Blue
      case 'collective-intelligence': return '#D1FAE5'; // Light Emerald  
      case 'qunnect': return '#EDE9FE'; // Light Violet
      default: return '#F3F4F6'; // Light Gray
    }
  };

  const getEventDetails = (event: CalendarEvent) => {
    const launch = launches.find(l => l.id === event.launchId);
    if (!launch) return null;

    switch (event.type) {
      case 'launch':
        return {
          title: event.title,
          type: 'Launch',
          status: launch.status,
          completion: launch.completionPercentage,
          riskLevel: launch.riskLevel,
          team: launch.team,
          description: launch.description,
          owner: 'Launch Team',
          link: null
        };
      case 'milestone':
        const milestone = launch.milestones.find(m => m.id === event.id.replace('milestone-', ''));
        return milestone ? {
          title: milestone.name,
          type: 'Milestone',
          status: milestone.status,
          completion: null,
          riskLevel: null,
          team: null,
          description: milestone.description,
          owner: milestone.assignee,
          link: null
        } : null;
      case 'content':
        const content = launch.content.find(c => c.id === event.id.replace('content-', ''));
        return content ? {
          title: content.name,
          type: 'Content',
          status: content.status,
          completion: null,
          riskLevel: null,
          team: null,
          description: content.description,
          owner: content.owner,
          link: content.linkedArtifacts?.length > 0 ? `Linked to ${content.linkedArtifacts.length} artifacts` : null
        } : null;
      case 'artifact':
        const artifact = launch.artifacts.find(a => a.id === event.id.replace('artifact-', ''));
        return artifact ? {
          title: artifact.name,
          type: 'Artifact',
          status: artifact.status,
          completion: null,
          riskLevel: null,
          team: null,
          description: artifact.description,
          owner: artifact.owner,
          link: artifact.sourceUrl
        } : null;
      default:
        return null;
    }
  };

  const renderMonthView = () => {
    const events = getCalendarEvents();
    
    // Generate 3 months starting from current month
    const getMonthsToDisplay = () => {
      const months = [];
      const currentMonth = startOfMonth(currentDate);
      for (let i = 0; i < 3; i++) {
        months.push(addMonths(currentMonth, i));
      }
      return months;
    };

    const renderSingleMonth = (monthDate: Date) => {
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthStart);
      const calendarStart = startOfWeek(monthStart);
      const calendarEnd = endOfWeek(monthEnd);
      const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

      const getEventsForDay = (day: Date) => {
        return events.filter(event => isSameDay(event.date, day));
      };

      return (
        <div key={monthDate.toISOString()} className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Month display */}
         
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold">
              {format(monthDate, 'MMMM yyyy')}
            </h3>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2 text-sm">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-3">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day) => {
              const events = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, monthDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  className={`
                    border rounded p-3 min-h-[100px] ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${
                      isToday ? 'ring-2 ring-blue-500' : ''
                    } hover:bg-gray-50 cursor-pointer
                  `}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className={`text-sm font-normal bg-white px-1 rounded ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-800'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="mt-2 space-y-1">
                    {events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80 relative"
                        style={{ backgroundColor: event.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                      >
                        {/* Launch milestone indicator */}
                        {event.type === 'milestone' && event.title.toLowerCase().includes('launch') && (
                          <div className="absolute -top-1 -right-1 text-lg">
                            ⭐
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          {event.type === 'artifact' && (
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              event.status === 'completed' || event.status === 'ready to publish' ? 'bg-green-300' :
                              event.status === 'in_progress' || event.status === 'in_review' ? 'bg-yellow-300' :
                              event.status === 'not_started' ? 'bg-gray-300' :
                              event.status === 'blocked' ? 'bg-red-300' :
                              'bg-gray-300'
                            }`}></div>
                          )}
                          <div className="text-white font-normal truncate">
                            {event.title}
                          </div>
                        </div>
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div 
                        className="text-xs font-normal bg-white px-2 py-1 rounded border border-gray-400 cursor-pointer hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHiddenItems({ date: day, events });
                        }}
                      >
                        +{events.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div>
        {/* Project Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Projects:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedProject('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedProject === 'all'
                      ? 'bg-gray-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Projects
                </button>
                {launches.map((launch) => (
                  <button
                    key={launch.id}
                    onClick={() => setSelectedProject(launch.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:opacity-80 ${
                      selectedProject === launch.id
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}
                    style={{
                      backgroundColor: selectedProject === launch.id ? getProjectColor(launch.id) : getProjectColorLight(launch.id)
                    }}
                  >
                    {launch.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => onDateChange(new Date())}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Today
            </button>
          </div>
        </div>
        
        {/* Status Indicator Legend */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Status Indicators:</div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <span>⭐</span>
              <span>Launch Day</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-300"></div>
              <span>Completed/Ready to Publish</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
              <span>In Progress/In Review</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <span>Not Started</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-300"></div>
              <span>Blocked</span>
            </div>
          </div>
        </div>

        {/* Stacked Months */}
        <div className="space-y-4">
          {getMonthsToDisplay().map(monthDate => renderSingleMonth(monthDate))}
        </div>

        {/* Status Legend */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-medium text-gray-700 mb-2">Status Indicators:</div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <span className="text-xs text-gray-600">Not Started</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
              <span className="text-xs text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-300"></div>
              <span className="text-xs text-gray-600">Completed</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null;

    const events = getCalendarEvents().filter(event => 
      isSameDay(event.date, selectedDate)
    );

    if (events.length === 0) return null;

    return (
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Events for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-start p-3 bg-gray-50 rounded">
              <div className={`w-3 h-3 rounded-full mr-3 mt-1 ${event.color}`}></div>
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-600">{event.launchName}</p>
                <p className="text-xs text-gray-500 capitalize">{event.type} • {event.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const months = [];
    let currentMonth = startOfMonth(currentDate);
    
    for (let i = 0; i < 12; i++) {
      months.push(currentMonth);
      currentMonth = addMonths(currentMonth, 1);
    }

    const events = getCalendarEvents();

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">{format(currentDate, 'yyyy')}</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {months.map((month, index) => {
            const monthEvents = events.filter(event => 
              isSameMonth(event.date, month)
            );

            return (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{format(month, 'MMMM')}</h4>
                <div className="space-y-1">
                  {monthEvents.slice(0, 5).map((event, eventIndex) => (
                    <div key={eventIndex} className="flex items-center text-xs">
                      <div className={`w-2 h-2 rounded-full mr-2 ${event.color}`}></div>
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  {monthEvents.length > 5 && (
                    <div className="text-xs text-gray-500">
                      +{monthEvents.length - 5} more events
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMultiMonthView = () => {
    const months = [
      { name: 'December', year: 2024, month: 11 },
      { name: 'January', year: 2025, month: 0 },
      { name: 'February', year: 2025, month: 1 }
    ];
    
    const events = getCalendarEvents();
    
    // Generate days 1-31 for each month
    const getDaysForMonth = (monthIndex: number, year: number) => {
      const days = [];
      for (let day = 1; day <= 31; day++) {
        const date = new Date(year, monthIndex, day);
        // Check if the date is valid (handles February 30, etc.)
        if (date.getMonth() === monthIndex) {
          days.push(date);
        }
      }
      return days;
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Multi-month grid */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Month headers */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="font-medium text-gray-700">Day</div>
              {months.map(month => (
                <div key={month.name} className="font-medium text-center text-gray-900 bg-gray-100 p-2 rounded">
                  {month.name} {month.year}
                </div>
              ))}
            </div>

            {/* Days 1-31 rows */}
            {getDaysForMonth(11, 2024).map((day, dayIndex) => (
              <div key={dayIndex} className="grid grid-cols-4 gap-4 min-h-[60px] border-t border-gray-200">
                {/* Day number */}
                <div className="font-medium text-gray-700 p-2 flex items-center">
                  {format(day, 'd')}
                  {day.getDay() === 0 && <span className="ml-2 text-xs text-red-500">Sun</span>}
                  {day.getDay() === 6 && <span className="ml-2 text-xs text-blue-500">Sat</span>}
                </div>
                
                {/* Events for each month */}
                {months.map((month, monthIndex) => {
                  const monthDay = new Date(month.year, month.month, day.getDate());
                  if (monthDay.getMonth() !== month.month) {
                    return <div key={monthIndex} className="p-2 bg-gray-50"></div>;
                  }
                  
                  const dayEvents = events.filter(event => 
                    isSameDay(event.date, monthDay)
                  );
                  
                  return (
                    <div key={monthIndex} className="p-2 border-l-2 border-gray-200">
                      {dayEvents.length > 0 ? (
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getProjectColor(event.launchId)} text-white`}
                              onClick={() => setSelectedEvent(event)}
                              title={`${event.title} - ${event.launchName}`}
                            >
                              <div className="truncate">{event.title}</div>
                              <div className="text-xs opacity-75">{event.launchName.split(' ')[0]}</div>
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">—</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Status Legend */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-medium text-gray-700 mb-2">Status Indicators:</div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <span className="text-xs text-gray-600">Not Started</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
              <span className="text-xs text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-300"></div>
              <span className="text-xs text-gray-600">Completed</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {viewMode === 'month' && renderMonthView()}
      {renderSelectedDateEvents()}
      
      {/* Event Details Pane */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {(() => {
              const details = getEventDetails(selectedEvent);
              if (!details) return null;
              
              return (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Type:</span>
                    <span className="ml-2 text-sm font-medium">{details.type}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Project:</span>
                    <span className="ml-2 text-sm font-medium">{selectedEvent.launchName}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Date:</span>
                    <span className="ml-2 text-sm font-medium">{format(selectedEvent.date, 'MMMM d, yyyy')}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      selectedEvent.status === 'completed' || selectedEvent.status === 'approved' || selectedEvent.status === 'published' ? 'bg-green-100 text-green-800' :
                      selectedEvent.status === 'in_progress' || selectedEvent.status === 'in_review' ? 'bg-yellow-100 text-yellow-800' :
                      selectedEvent.status === 'at_risk' ? 'bg-orange-100 text-orange-800' :
                      selectedEvent.status === 'delayed' || selectedEvent.status === 'blocked' || selectedEvent.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedEvent.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {details.owner && (
                    <div>
                      <span className="text-sm text-gray-500">Owner:</span>
                      <span className="ml-2 text-sm font-medium">{details.owner}</span>
                    </div>
                  )}
                  
                  {details.completion !== null && (
                    <div>
                      <span className="text-sm text-gray-500">Completion:</span>
                      <span className="ml-2 text-sm font-medium">{details.completion}%</span>
                    </div>
                  )}
                  
                  {details.description && (
                    <div>
                      <span className="text-sm text-gray-500">Description:</span>
                      <p className="mt-1 text-sm text-gray-700">{details.description}</p>
                    </div>
                  )}
                  
                  {details.link && (
                    <div>
                      <span className="text-sm text-gray-500">Link:</span>
                      <a 
                        href={details.link.startsWith('http') ? details.link : '#'}
                        target={details.link.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="ml-2 text-sm text-blue-600 hover:underline"
                        onClick={(e) => {
                          if (!details.link?.startsWith('http')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {details.link.startsWith('http') ? 'View Source' : details.link}
                      </a>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
      
      {/* Hidden Items Popup */}
      {showHiddenItems && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowHiddenItems(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                All Events for {format(showHiddenItems.date, 'MMMM d, yyyy')}
              </h3>
              <button
                onClick={() => setShowHiddenItems(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              {showHiddenItems.events.map((event) => (
                <div 
                  key={event.id} 
                  className="flex items-start p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowHiddenItems(null);
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-3 mt-1 flex-shrink-0" 
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.launchName}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500 capitalize">{event.type}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 capitalize">{event.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
