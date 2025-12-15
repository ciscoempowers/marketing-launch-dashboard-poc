import { Launch, LaunchStatus, RiskLevel, Team, Artifact, ArtifactType, ArtifactStatus, Content, ContentType, ContentStatus, ApprovalStep, ApprovalStatus, Priority, Milestone, MilestoneStatus, DataSource } from '../types/launch';

// Helper function to parse CSV dates
const parseDate = (dateStr: string): Date => {
  if (!dateStr || dateStr === 'TBD' || dateStr === 'TBA') {
    return new Date('2026-12-31'); // Default far future date for TBD items
  }
  
  // Handle various date formats
  const formats = [
    /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/, // MM/DD/YY or MM/DD/YYYY
    /(\d{1,2})-(\w{3})-(\d{2,4})/,      // DD-MMM-YY or DD-MMM-YYYY
  ];
  
  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      const [, part1, part2, year] = match;
      let month: number, day: number;
      
      if (format === formats[0]) { // MM/DD/YY
        month = parseInt(part1);
        day = parseInt(part2);
      } else { // DD-MMM-YY
        day = parseInt(part1);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        month = monthNames.indexOf(part2) + 1;
      }
      
      const fullYear = parseInt(year.length === 2 ? '20' + year : year);
      return new Date(fullYear, month - 1, day);
    }
  }
  
  return new Date();
};

// Helper function to map CSV status to enum
const mapArtifactStatus = (status: string): ArtifactStatus => {
  const statusMap: { [key: string]: ArtifactStatus } = {
    'ready to publish': ArtifactStatus.READY_TO_PUBLISH,
    'in progress': ArtifactStatus.IN_PROGRESS,
    'pending': ArtifactStatus.NOT_STARTED,
    'n/a': ArtifactStatus.NOT_STARTED,
  };
  return statusMap[status.toLowerCase()] || ArtifactStatus.NOT_STARTED;
};

const mapApprovalStatus = (status: string): ApprovalStatus => {
  const statusMap: { [key: string]: ApprovalStatus } = {
    'approved': ApprovalStatus.APPROVED,
    'pending': ApprovalStatus.PENDING,
    'review pending': ApprovalStatus.PENDING,
    'n/a': ApprovalStatus.SKIPPED,
  };
  return statusMap[status.toLowerCase()] || ApprovalStatus.SKIPPED;
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
        name: 'Social blog announcement',
        type: ArtifactType.BLOG_POST,
        owner: 'Leah',
        status: ArtifactStatus.READY_TO_PUBLISH,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Dec-25'),
        description: 'This blog post introduces the launch of HAX, highlighting its purpose, key features, and impact. Hosted on Outshift, it provides readers with an in-depth look at the campaign goals, innovative elements, and how it aligns with our broader vision. Owned Social: This social post highlights the announcement blog, the purpose is to generate engagement, spark curiosity, and encourage clicks to the full blog on Outshift.',
        sourceUrl: 'https://cisco-my.sharepoint.com/:w:/p/mscibell/IQBB9iBmD7baS4rOmG9j-_VDAe9Mj9Byxr0Vm-b4F2DUcDE?e=HYOfRh&wdLOR=c7FCB8E18-4855-EB47-BD24-CF1B0CC7C06B'
      },
      {
        id: 'hax-youtube-video',
        name: 'HAX Youtube video',
        type: ArtifactType.DEMO,
        owner: 'Leah',
        status: ArtifactStatus.READY_TO_PUBLISH,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Dec-25'),
        description: 'HAX demonstration video for YouTube'
      },
      {
        id: 'hax-arxiv-paper',
        name: 'Arxiv research paper',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Marc',
        status: ArtifactStatus.READY_TO_PUBLISH,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Dec-25'),
        description: 'ArXiv research paper for HAX launch'
      },
      {
        id: 'hax-exec-social',
        name: 'Exec social blog post',
        type: ArtifactType.BLOG_POST,
        owner: 'Rebecca',
        status: ArtifactStatus.READY_TO_PUBLISH,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Dec-25'),
        description: 'Leverage Vijoy to promote the announcement. Will publish ahead of the webinar on Dec 18, 2025',
        sourceUrl: 'https://cisco-my.sharepoint.com/:w:/p/krygonza/EepgS9kbL1NAnrd_osiuQsgBRYs9fwDOp1OE9v0LDAngnA?e=KAJ1dt&wdLOR=c211A38C9-FB13-534E-9980-9F7F44746395'
      },
      {
        id: 'hax-reddit-post',
        name: 'Reddit social post',
        type: ArtifactType.WEBSITE,
        owner: 'Leah',
        status: ArtifactStatus.READY_TO_PUBLISH,
        source: DataSource.MANUAL,
        targetDate: parseDate('17-Dec-25'),
        description: 'Reddit social post for HAX promotion'
      },
      {
        id: 'hax-webinar',
        name: 'HAX webinar',
        type: ArtifactType.WEBINAR,
        owner: 'Leah',
        status: ArtifactStatus.READY_TO_PUBLISH,
        source: DataSource.MANUAL,
        targetDate: parseDate('18-Dec-25'),
        description: 'HAX webinar presentation'
      },
      {
        id: 'hax-demo-social',
        name: 'Social post on demo',
        type: ArtifactType.WEBSITE,
        owner: 'Leah',
        status: ArtifactStatus.READY_TO_PUBLISH,
        source: DataSource.MANUAL,
        targetDate: parseDate('19-Dec-25'),
        description: 'Social media post highlighting HAX demo'
      }
    ],
    content: [
      {
        id: 'hax-blog-content',
        name: 'HAX Blog Content',
        type: ContentType.BLOG_POST,
        owner: 'Leah',
        status: ContentStatus.PUBLISHED,
        approvalChain: [
          {
            id: 'hax-blog-review',
            approver: 'Vijoy',
            role: 'Reviewer',
            status: ApprovalStatus.APPROVED,
            reviewStartDate: parseDate('12/9/25'),
            approvalDueDate: parseDate('12/11/25'),
            order: 1
          }
        ],
        targetDate: parseDate('15-Dec-25'),
        description: 'Blog announcement content for HAX launch',
        linkedArtifacts: ['hax-social-blog'],
        priority: Priority.HIGH
      },
      {
        id: 'hax-paper-content',
        name: 'HAX Research Paper Content',
        type: ContentType.RESEARCH_PAPER,
        owner: 'Marc',
        status: ContentStatus.PUBLISHED,
        approvalChain: [
          {
            id: 'hax-paper-review',
            approver: 'Ramana',
            role: 'Reviewer',
            status: ApprovalStatus.APPROVED,
            reviewStartDate: parseDate('12/5/25'),
            approvalDueDate: parseDate('12/11/25'),
            order: 1
          }
        ],
        targetDate: parseDate('15-Dec-25'),
        description: 'ArXiv research paper content',
        linkedArtifacts: ['hax-arxiv-paper'],
        priority: Priority.HIGH
      }
    ],
    milestones: [
      {
        id: 'hax-launch',
        name: 'HAX Launch',
        description: 'Official HAX launch date',
        targetDate: parseDate('12/15/25'),
        status: MilestoneStatus.IN_PROGRESS,
        dependencies: [],
        assignee: 'Leah'
      },
      {
        id: 'hax-webinar',
        name: 'HAX Webinar',
        description: 'HAX webinar presentation',
        targetDate: parseDate('12/18/25'),
        status: MilestoneStatus.IN_PROGRESS,
        dependencies: [],
        assignee: 'Leah'
      }
    ],
    dependencies: [],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date()
  },
  {
    id: 'collective-intelligence',
    name: 'Collective Intelligence Vision Launch',
    description: 'Collective Intelligence Vision Launch Campaign',
    launchDate: parseDate('1/22/26'),
    status: LaunchStatus.ON_TRACK,
    completionPercentage: 60,
    riskLevel: RiskLevel.MEDIUM,
    team: Team.MARKETING,
    artifacts: [
      {
        id: 'ci-messaging',
        name: 'Internal Messaging house',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.COMPLETED,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Dec-25'),
        description: 'Internal messaging house for Collective Intelligence',
        sourceUrl: 'https://cisco-eti.atlassian.net/wiki/spaces/Marketing/pages/1934196761/Scaling+Superintelligence+Message+House'
      },
      {
        id: 'ci-osi-paper',
        name: 'OSI Stack arXiv research paper',
        type: ArtifactType.RESEARCH_PAPER,
        owner: 'Ramana',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('16-Dec-25'),
        description: 'Follow up with Ramana on publication date'
      },
      {
        id: 'ci-osi-research',
        name: 'OSI Stack Research paper',
        type: ArtifactType.RESEARCH_PAPER,
        owner: 'Ramana',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Jan-26'),
        description: 'Ramana will have a draft before shut down'
      },
      {
        id: 'ci-pitch-deck',
        name: 'Pitch deck & talk track',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('15-Jan-26'),
        description: 'Review must include Papi, as host of webinar.Dependency for final, approved deck on Jan 15, 2025 is to deliver webinar deck for recording on Jan 16, 2026'
      },
      {
        id: 'ci-whitepaper',
        name: 'Whitepaper',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.MANUAL,
        targetDate: parseDate('22-Jan-26'),
        description: 'Collective Intelligence whitepaper'
      },
      {
        id: 'ci-outshift-blog',
        name: 'Outshift Blog',
        type: ArtifactType.BLOG_POST,
        owner: 'Leah',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('22-Jan-26'),
        description: 'Outshift blog post for Collective Intelligence'
      },
      {
        id: 'ci-social-post',
        name: 'Outshift, Vijoy, Ammar social post',
        type: ArtifactType.WEBSITE,
        owner: 'Leah',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('22-Jan-26'),
        description: 'Social media post featuring Vijoy and Ammar'
      },
      {
        id: 'ci-landing-page',
        name: 'Landing page',
        type: ArtifactType.WEBINAR,
        owner: 'Leah',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('22-Jan-26'),
        description: 'Landing page for Collective Intelligence'
      },
      {
        id: 'ci-hivemind-demo',
        name: 'Hivemind Demo',
        type: ArtifactType.DEMO,
        owner: 'Sabitha',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('27-Jan-26'),
        description: 'Hivemind demonstration'
      },
      {
        id: 'ci-podcast',
        name: 'SDS Podcast Interview with Vijoy',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Vijoy',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('27-Jan-26'),
        description: 'Vijoy is currently set to record on Jan 6, 2026'
      },
      {
        id: 'ci-keynote-deck',
        name: 'VB SF Keynote Deck',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('27-Jan-26'),
        description: 'Vijoy- to provide speaker requests, if he has any (asap). dependencies -keynote deck needs the pitch deck'
      },
      {
        id: 'ci-webinar-deck',
        name: 'Intro 101: Webinar deck',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('29-Jan-26'),
        description: 'Host: Papi. Vijoy approval deadlines: Confirm speakers: Dec 15, 2025(Papi) Final webinar title, abstract: Dec 17, 2025(Vijoy approval deadline) Final slides due: Jan 15, 2026(Vijoy approval deadline)'
      },
      {
        id: 'ci-cleu-pitch',
        name: 'CLEU Pitch deck & talk track',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('9-Feb-26'),
        description: 'CLEU pitch deck and talking points'
      },
      {
        id: 'ci-vb-podcast',
        name: 'VB podcast interview with Vijoy',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Leah',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('18-Feb-26'),
        description: 'Prep call: 1st week Jan (WIP),Recording: 2nd week Jan (WIP)'
      }
    ],
    content: [
      {
        id: 'ci-messaging-content',
        name: 'CI Messaging Content',
        type: ContentType.RESEARCH_PAPER,
        owner: 'Leah',
        status: ContentStatus.IN_REVIEW,
        approvalChain: [
          {
            id: 'ci-messaging-review',
            approver: 'Vijoy',
            role: 'Reviewer',
            status: ApprovalStatus.PENDING,
            reviewStartDate: parseDate('12/12/25'),
            approvalDueDate: parseDate('12/14/25'),
            order: 1
          }
        ],
        targetDate: parseDate('15-Dec-25'),
        description: 'Internal messaging content',
        linkedArtifacts: ['ci-messaging'],
        priority: Priority.HIGH
      },
      {
        id: 'ci-whitepaper-content',
        name: 'CI Whitepaper Content',
        type: ContentType.RESEARCH_PAPER,
        owner: 'Leah',
        status: ContentStatus.IN_REVIEW,
        approvalChain: [
          {
            id: 'ci-whitepaper-review',
            approver: 'Vijoy',
            role: 'Reviewer',
            status: ApprovalStatus.PENDING,
            reviewStartDate: parseDate('1/10/25'),
            approvalDueDate: parseDate('01/13/26'),
            order: 1
          }
        ],
        targetDate: parseDate('22-Jan-26'),
        description: 'Whitepaper content for CI launch',
        linkedArtifacts: ['ci-whitepaper'],
        priority: Priority.HIGH
      }
    ],
    milestones: [
      {
        id: 'ci-vision-launch',
        name: 'CI Vision Launch',
        description: 'Collective Intelligence Vision Launch',
        targetDate: parseDate('1/22/26'),
        status: MilestoneStatus.IN_PROGRESS,
        dependencies: [],
        assignee: 'Leah'
      },
      {
        id: 'ci-webinar',
        name: 'CI Webinar',
        description: 'Collective Intelligence Webinar',
        targetDate: parseDate('1/29/26'),
        status: MilestoneStatus.IN_PROGRESS,
        dependencies: [],
        assignee: 'Leah'
      }
    ],
    dependencies: [],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date()
  },
  {
    id: 'qunnect',
    name: 'Qunnect Launch',
    description: 'Qunnect NY Testbed Co-Marketing Launch Plan',
    launchDate: parseDate('1/26/26'),
    status: LaunchStatus.AT_RISK,
    completionPercentage: 25,
    riskLevel: RiskLevel.HIGH,
    team: Team.MARKETING,
    artifacts: [
      {
        id: 'qunnect-exec-social',
        name: 'Exec social blog post',
        type: ArtifactType.BLOG_POST,
        owner: 'Rebecca',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('26-Jan-26'),
        description: 'Leverage ELT & SLT leadership, to promote the announcement. Vijoy definitely, Ammar maybe'
      },
      {
        id: 'qunnect-press-release',
        name: 'Qunnect Press Release',
        type: ArtifactType.DOCUMENTATION,
        owner: 'TBA',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('26-Jan-26'),
        description: 'Official press release for Qunnect launch'
      },
      {
        id: 'qunnect-internal-pr',
        name: 'Internal PR announcement',
        type: ArtifactType.DOCUMENTATION,
        owner: 'Rebecca',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('26-Jan-26'),
        description: 'Internal PR announcement is shared via email if applicable. Spokesperson email.'
      },
      {
        id: 'qunnect-social-blog',
        name: 'Social blog announcement',
        type: ArtifactType.BLOG_POST,
        owner: 'Michelle',
        status: ArtifactStatus.NOT_STARTED,
        source: DataSource.MANUAL,
        targetDate: parseDate('26-Jan-26'),
        description: 'Tier 3_Qunnect NY Testbed Co-Marketing Launch Plan'
      }
    ],
    content: [],
    milestones: [
      {
        id: 'qunnect-launch',
        name: 'Qunnect Launch',
        description: 'Qunnect NY Testbed Launch',
        targetDate: parseDate('1/26/26'),
        status: MilestoneStatus.BLOCKED,
        dependencies: [],
        assignee: 'Rebecca'
      }
    ],
    dependencies: ['collective-intelligence'],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date()
  }
];

// Helper function to get risk level
const getRiskLevel = (completionPercentage: number, daysUntilLaunch: number): RiskLevel => {
  if (daysUntilLaunch < 30 && completionPercentage < 80) return RiskLevel.HIGH;
  if (daysUntilLaunch < 60 && completionPercentage < 60) return RiskLevel.MEDIUM;
  return RiskLevel.LOW;
};

// Helper function to calculate completion percentage
const calculateCompletionPercentage = (artifacts: Artifact[]): number => {
  if (artifacts.length === 0) return 0;
  const completedArtifacts = artifacts.filter(a => 
    a.status === ArtifactStatus.COMPLETED || a.status === ArtifactStatus.READY_TO_PUBLISH
  ).length;
  return Math.round((completedArtifacts / artifacts.length) * 100);
};

// Update completion percentages based on artifact statuses
sampleLaunches.forEach(launch => {
  launch.completionPercentage = calculateCompletionPercentage(launch.artifacts);
  const daysUntilLaunch = Math.ceil((launch.launchDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  launch.riskLevel = getRiskLevel(launch.completionPercentage, daysUntilLaunch);
});
