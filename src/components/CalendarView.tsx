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
      // Add launch date
      events.push({
        id: `launch-${launch.id}`,
        title: launch.name,
        date: launch.launchDate,
        type: 'launch',
        status: launch.status,
        launchId: launch.id,
        launchName: launch.name,
        color: getProjectColor(launch.id)
      });
      
      // Add milestone deadlines
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
      case 'collective-intelligence': return 'bg-blue-500';
      case 'hax': return 'bg-green-500';
      case 'qunnect': return 'bg-purple-500';
      default: return 'bg-gray-500';
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
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const events = getCalendarEvents();

    const getEventsForDay = (day: Date) => {
      return events.filter(event => isSameDay(event.date, day));
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Calendar header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onDateChange(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <h3 className="text-lg font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => onDateChange(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded"
            >
              →
            </button>
          </div>
          <button
            onClick={() => onDateChange(new Date())}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Today
          </button>
        </div>

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
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Projects
                </button>
                {launches.map(launch => (
                  <button
                    key={launch.id}
                    onClick={() => setSelectedProject(launch.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                      selectedProject === launch.id
                        ? `${getProjectColor(launch.id)} text-white shadow-sm`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${getProjectColor(launch.id)}`}></div>
                    <span>{launch.name.replace('Human and Agent Collaboration (HAX)', 'HAX').replace('Collective Intelligence Vision Launch', 'Collective Intelligence')}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              {getFilteredLaunches().length} of {launches.length} projects
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusToggle('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1 ${
                      selectedStatuses.includes('all')
                        ? 'bg-gray-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded border-2 ${
                      selectedStatuses.includes('all') ? 'bg-white border-white' : 'border-gray-400'
                    }`}></div>
                    <span>All Status</span>
                  </button>
                  <button
                    onClick={() => handleStatusToggle('not_started')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1 ${
                      selectedStatuses.includes('not_started')
                        ? 'bg-gray-400 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded border-2 ${
                      selectedStatuses.includes('not_started') ? 'bg-white border-white' : 'border-gray-400'
                    }`}></div>
                    <span>Not Started</span>
                  </button>
                  <button
                    onClick={() => handleStatusToggle('in_progress')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1 ${
                      selectedStatuses.includes('in_progress')
                        ? 'bg-yellow-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded border-2 ${
                      selectedStatuses.includes('in_progress') ? 'bg-white border-white' : 'border-gray-400'
                    }`}></div>
                    <span>In Progress</span>
                  </button>
                  <button
                    onClick={() => handleStatusToggle('completed')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1 ${
                      selectedStatuses.includes('completed')
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded border-2 ${
                      selectedStatuses.includes('completed') ? 'bg-white border-white' : 'border-gray-400'
                    }`}></div>
                    <span>Completed</span>
                  </button>
                </div>
              </div>
              {selectedStatuses.length > 0 && !selectedStatuses.includes('all') && (
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  {selectedStatuses.length} selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
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

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 mb-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            
            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 cursor-pointer hover:bg-gray-50 ${
                  !isCurrentMonth ? 'text-gray-400' : ''
                } ${isSelected ? 'bg-blue-50' : ''} ${isToday ? 'bg-yellow-50 ring-2 ring-yellow-400 ring-offset-1' : ''} ${
                  isWeekend ? 'bg-gray-50' : 'bg-white'
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className={`text-sm font-medium ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {dayEvents.length}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-1 rounded truncate flex items-center space-x-1 cursor-pointer hover:opacity-80 ${
                        event.status === 'not_started' ? 'bg-gray-400 text-white' :
                        event.status === 'in_progress' ? `${event.color} text-white` :
                        event.status === 'completed' ? 'bg-green-500 text-white' :
                        `${event.color} text-white`
                      }`}
                      title={`${event.title} - ${event.status.replace('_', ' ')}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        event.status === 'not_started' ? 'bg-gray-300' :
                        event.status === 'in_progress' ? 'bg-yellow-300' :
                        event.status === 'completed' ? 'bg-green-300' :
                        'bg-white'
                      }`}></div>
                      <span className="truncate flex-1">{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayEvents.length - 3} more
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
    </div>
  );
};

export default CalendarView;
