import { 
  Launch, 
  LaunchStatus, 
  RiskLevel, 
  Team, 
  ArtifactType, 
  ArtifactStatus, 
  ContentType, 
  ContentStatus, 
  ApprovalStatus, 
  MilestoneStatus, 
  Priority,
  DataSource 
} from '../types/launch';

// Helper function to parse CSV dates
const parseDate = (dateStr: string): Date => {
  if (!dateStr || dateStr === 'TBD' || dateStr === 'TBA') {
    return new Date('2026-12-31'); // Default far future date for TBD items
  }
  
  // Handle various date formats
  const cleanDate = dateStr.replace(/"/g, '').trim();
  
  // Try MM/DD/YY format
  const mmddyyMatch = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (mmddyyMatch) {
    const [, month, day, year] = mmddyyMatch;
    return new Date(`20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  }
  
  // Try MM/DD/YYYY format  
  const mmddyyyyMatch = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mmddyyyyMatch) {
    const [, month, day, year] = mmddyyyyMatch;
    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  }
  
  // Try MMM-DD-YY format
  const mmmddyyMatch = cleanDate.match(/^([A-Za-z]{3})-(\d{1,2})-(\d{2})$/);
  if (mmmddyyMatch) {
    const [, month, day, year] = mmmddyyMatch;
    const monthMap: { [key: string]: string } = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    return new Date(`20${year}-${monthMap[month]}-${day.padStart(2, '0')}`);
  }
  
  // Default fallback
  return new Date(cleanDate);
};

// Helper function to determine status
const getStatus = (statusStr: string): LaunchStatus => {
  const status = statusStr.toLowerCase();
  if (status.includes('wip') || status.includes('in progress')) return LaunchStatus.IN_PROGRESS;
  if (status.includes('review pending')) return LaunchStatus.AT_RISK;
  if (status.includes('not started')) return LaunchStatus.PLANNING;
  if (status.includes('complete') || status.includes('done')) return LaunchStatus.COMPLETED;
  return LaunchStatus.ON_TRACK;
};

// Helper function to determine risk level
const getRiskLevel = (statusStr: string): RiskLevel => {
  const status = statusStr.toLowerCase();
  if (status.includes('review pending') || status.includes('wip')) return RiskLevel.MEDIUM;
  if (status.includes('not started')) return RiskLevel.HIGH;
  return RiskLevel.LOW;
};

// Parse CSV data into Launch objects
export const sampleLaunches: Launch[] = [
  {
    id: 'hax',
    name: 'HAX',
    description: 'HAX Collaboration',
    launchDate: parseDate('12/15/25'),
    status: LaunchStatus.ON_TRACK,
    completionPercentage: 95,
    riskLevel: RiskLevel.LOW,
    team: Team.ENGINEERING,
    artifacts: [
      {
        id: 'hax-social-blog',
        name: '[Social] Promotion of Announcement Blog',
        type: ArtifactType.BLOG_POST,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Dec-25'),
        description: 'Social blog post announcement for HAX launch'
      },
      {
        id: 'hax-demo-video',
        name: 'HAX Demo video',
        type: ArtifactType.DEMO,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Dec-25'),
        description: 'Youtube video demo of HAX'
      },
      {
        id: 'hax-arxiv-paper',
        name: '[Research Paper] ArXiv paper',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Marc',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Dec-25'),
        description: 'Arxiv documentation paper'
      },
      {
        id: 'hax-exec-social',
        name: '[Social] Exec Promotion of Outshift Announcement Blog',
        type: ArtifactType.BLOG_POST,
        owner: 'Rebecca',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Dec-25'),
        description: 'Executive social blog post promotion'
      },
      {
        id: 'hax-reddit-promo',
        name: '[Reddit] promotion of Announcement Blog',
        type: ArtifactType.BLOG_POST,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('17-Dec-25'),
        description: 'Reddit social promotion'
      },
      {
        id: 'hax-webinar',
        name: 'HAX Webinar',
        type: ArtifactType.WEBINAR,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('18-Dec-25'),
        description: 'Webinar production plan for HAX'
      },
      {
        id: 'hax-demo-social',
        name: '[Social] Promotion of HAX Demo video',
        type: ArtifactType.BLOG_POST,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('19-Dec-25'),
        description: 'Social post promoting demo video'
      }
    ],
    content: [
      {
        id: 'hax-blog-announcement',
        name: 'HAX Announcement Blog',
        type: ContentType.BLOG_POST,
        owner: 'Leah',
        status: ContentStatus.IN_REVIEW,
        approvalChain: [
          {
            id: 'hax-review-1',
            approver: 'Vijoy',
            role: 'Reviewer',
            status: ApprovalStatus.PENDING,
            order: 1
          }
        ],
        targetDate: parseDate('15-Dec-25'),
        actualDate: parseDate('12/10/25'),
        description: 'Blog post announcing HAX launch',
        linkedArtifacts: ['hax-social-blog'],
        priority: Priority.HIGH
      }
    ],
    milestones: [
      {
        id: 'hax-launch',
        name: 'HAX Launch Day',
        description: 'Official HAX launch',
        targetDate: parseDate('12/15/25'),
        status: MilestoneStatus.IN_PROGRESS,
        dependencies: [],
        assignee: 'Launch Team'
      }
    ],
    dependencies: [],
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-12-10')
  },
  {
    id: 'collective-intelligence',
    name: 'Collective Intelligence Vision Launch',
    description: 'Collective Intelligence',
    launchDate: parseDate('1/22/26'),
    status: LaunchStatus.ON_TRACK,
    completionPercentage: 45,
    riskLevel: RiskLevel.LOW,
    team: Team.PRODUCT,
    artifacts: [
      {
        id: 'ci-messaging',
        name: 'Finalize core messaging and glossary of terms',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Vijoy, Rebecca, Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('12-Dec-25'),
        description: 'Internal Messaging house'
      },
      {
        id: 'ci-publication-v2',
        name: 'First pre-launch publication V1 Nov and V2 Dec',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Ramana',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('16-Dec-25'),
        description: 'V2 Dec publication'
      },
      {
        id: 'ci-messaging-guide',
        name: 'Messaging guide for all interviews',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Rebecca',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('19-Dec-25'),
        description: 'Interview messaging guide'
      },
      {
        id: 'ci-blog-osi',
        name: 'Publish blog',
        type: ArtifactType.BLOG_POST,
        owner: 'Ramana',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Jan-26'),
        description: 'Blog on OSI Stack Research paper'
      },
      {
        id: 'ci-pitch-deck',
        name: 'Pitch deck',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Jan-26'),
        description: 'Pitch PPT deck & talk track'
      },
      {
        id: 'ci-whitepaper',
        name: 'Vision Launch',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('22-Jan-26'),
        description: 'Whitepaper'
      },
      {
        id: 'ci-outshift-blog',
        name: 'Vision Launch',
        type: ArtifactType.BLOG_POST,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('22-Jan-26'),
        description: 'Outshift Blog'
      },
      {
        id: 'ci-social-media',
        name: 'Vision Launch',
        type: ArtifactType.BLOG_POST,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('22-Jan-26'),
        description: 'Outshift, Vijoy, Ammar social media'
      },
      {
        id: 'ci-landing-page',
        name: 'Vision Launch',
        type: ArtifactType.WEBSITE,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('22-Jan-26'),
        description: 'Landing page'
      },
      {
        id: 'ci-homepage',
        name: 'Vision Launch',
        type: ArtifactType.WEBSITE,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('22-Jan-26'),
        description: 'Homepage feature (new design)'
      },
      {
        id: 'ci-launch-demo',
        name: 'Launch Demo',
        type: ArtifactType.DEMO,
        owner: 'Sabitha',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('27-Jan-26'),
        description: 'Hivemind Demo - if possible'
      },
      {
        id: 'ci-podcast',
        name: 'SuperDataScience Podcast',
        type: ArtifactType.BLOG_POST,
        owner: 'Vijoy',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('27-Jan-26'),
        description: 'Featured Interview with Vijoy'
      },
      {
        id: 'ci-venturebeat-keynote',
        name: 'VentureBeat SF CI Launch Event',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('27-Jan-26'),
        description: 'Keynote Deck'
      },
      {
        id: 'ci-venturebeat-pitch',
        name: 'VentureBeat SF CI Launch Event',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('27-Jan-26'),
        description: 'Pitch deck'
      },
      {
        id: 'ci-venturebeat-talk',
        name: 'VentureBeat SF CI Launch Event',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('27-Jan-26'),
        description: 'Talk Track'
      },
      {
        id: 'ci-webinar-deck',
        name: 'Webinar: Intro 101',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('29-Jan-26'),
        description: 'Webinar deck'
      },
      {
        id: 'ci-cleu-pitch',
        name: 'CLEU (Whisper Suite, Demo station)',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('9-Feb-26'),
        description: 'Pitch deck, talk track'
      },
      {
        id: 'ci-venturebeat-podcast',
        name: 'Venture Beat "Beyond the Pilot" Podcast',
        type: ArtifactType.BLOG_POST,
        owner: 'Leah',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('18-Feb-26'),
        description: 'Featured Interview with Vijoy'
      }
    ],
    content: [
      {
        id: 'ci-whitepaper-content',
        name: 'Vision Launch Whitepaper',
        type: ContentType.RESEARCH_PAPER,
        owner: 'Leah',
        status: ContentStatus.IN_REVIEW,
        approvalChain: [
          {
            id: 'ci-whitepaper-review',
            approver: 'Vijoy',
            role: 'Reviewer',
            status: ApprovalStatus.PENDING,
            order: 1
          }
        ],
        targetDate: parseDate('22-Jan-26'),
        actualDate: parseDate('12/08/25'),
        description: 'Vision Launch Whitepaper',
        linkedArtifacts: ['ci-whitepaper'],
        priority: Priority.HIGH
      }
    ],
    milestones: [
      {
        id: 'ci-vision-launch',
        name: 'Collective Intelligence Vision Launch',
        description: 'Official CI Vision launch',
        targetDate: parseDate('1/22/26'),
        status: MilestoneStatus.IN_PROGRESS,
        dependencies: [],
        assignee: 'Launch Team'
      }
    ],
    dependencies: [],
    createdAt: new Date('2025-10-15'),
    updatedAt: new Date('2025-12-11')
  },
  {
    id: 'qunnect',
    name: 'Qunnect Launch',
    description: 'Qunnect Launch',
    launchDate: parseDate('1/10/26'),
    status: LaunchStatus.ON_TRACK,
    completionPercentage: 15,
    riskLevel: RiskLevel.LOW,
    team: Team.MARKETING,
    artifacts: [
      {
        id: 'qunnect-social-blog',
        name: '[Social] Promotion of Qunnect NY Testbed Co-Marketing Announcement Blog',
        type: ArtifactType.BLOG_POST,
        owner: 'Leah',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('TBD'),
        description: 'Owned Social: This social post highlights the announcement blog'
      },
      {
        id: 'qunnect-exec-social',
        name: '[Social] Exec Promotion of Outshift Qunnect Announcement Blog',
        type: ArtifactType.BLOG_POST,
        owner: 'Rebecca',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('TBD'),
        description: 'Executive social blog promotion'
      },
      {
        id: 'qunnect-press-release',
        name: 'Launch of [external] Qunnect Press Release',
        type: ArtifactType.BLOG_POST,
        owner: 'TBA',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('TBD'),
        description: 'Press releases for various partners - Qunnect'
      },
      {
        id: 'qunnect-internal-pr',
        name: 'Launch [Internal] PR Announcement',
        type: ArtifactType.BLOG_POST,
        owner: 'Rebecca',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('TBD'),
        description: 'Press release - internal'
      },
      {
        id: 'qunnect-blog',
        name: 'Qunnect Launch',
        type: ArtifactType.BLOG_POST,
        owner: 'Michelle',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('26-Jan-26'),
        description: 'Tier 3_Qunnect NY Testbed Co-Marketing Launch Plan'
      }
    ],
    content: [
      {
        id: 'qunnect-blog-content',
        name: 'Qunnect Launch Blog',
        type: ContentType.BLOG_POST,
        owner: 'Michelle',
        status: ContentStatus.DRAFT,
        approvalChain: [
          {
            id: 'qunnect-blog-review',
            approver: 'Leah',
            role: 'Reviewer',
            status: ApprovalStatus.PENDING,
            order: 1
          }
        ],
        targetDate: parseDate('26-Jan-26'),
        actualDate: parseDate('12/05/25'),
        description: 'Qunnect Launch Blog',
        linkedArtifacts: ['qunnect-blog'],
        priority: Priority.MEDIUM
      }
    ],
    milestones: [
      {
        id: 'qunnect-launch',
        name: 'Qunnect Launch',
        description: 'Official Qunnect launch',
        targetDate: parseDate('1/10/26'),
        status: MilestoneStatus.NOT_STARTED,
        dependencies: [],
        assignee: 'Launch Team'
      }
    ],
    dependencies: [],
    createdAt: new Date('2025-11-20'),
    updatedAt: new Date('2025-12-11')
  }
];
