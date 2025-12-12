import { Launch, Artifact, Content, DataSource, DataSourceConfig, ArtifactStatus, ContentStatus } from '../types/launch';

// Simulated data agents for different integrations
export class DataAgentService {
  private static instance: DataAgentService;
  private configs: Map<DataSource, DataSourceConfig> = new Map();

  static getInstance(): DataAgentService {
    if (!DataAgentService.instance) {
      DataAgentService.instance = new DataAgentService();
    }
    return DataAgentService.instance;
  }

  // Initialize data source connections
  async initializeDataSources(): Promise<void> {
    // Simulate connection setup
    this.configs.set(DataSource.JIRA, {
      source: DataSource.JIRA,
      endpoint: 'https://company.atlassian.net',
      projectId: 'LAUNCH',
      syncStatus: 'connected',
      lastSync: new Date()
    });

    this.configs.set(DataSource.AIRTABLE, {
      source: DataSource.AIRTABLE,
      endpoint: 'https://api.airtable.com/v0/app123',
      syncStatus: 'connected',
      lastSync: new Date()
    });

    this.configs.set(DataSource.CONFLUENCE, {
      source: DataSource.CONFLUENCE,
      endpoint: 'https://company.atlassian.net/wiki',
      syncStatus: 'connected',
      lastSync: new Date()
    });

    this.configs.set(DataSource.GITHUB, {
      source: DataSource.GITHUB,
      endpoint: 'https://api.github.com/repos/company',
      syncStatus: 'connected',
      lastSync: new Date()
    });
  }

  // JIRA Agent - Engineering data
  async fetchJiraData(): Promise<Artifact[]> {
    // Simulate JIRA API call
    await this.simulateDelay(800);
    
    return [
      {
        id: 'jira-1',
        name: 'HAX SDK Development',
        type: 'sdk' as any,
        owner: 'Engineering Team',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.JIRA,
        sourceUrl: 'https://company.atlassian.net/browse/PROJ-123',
        targetDate: new Date('2025-12-10'),
        description: 'Core SDK implementation for HAX platform'
      },
      {
        id: 'jira-2',
        name: 'AGNTCY Directory Backend',
        type: 'api' as any,
        owner: 'Backend Team',
        status: ArtifactStatus.IN_PROGRESS,
        source: DataSource.JIRA,
        sourceUrl: 'https://company.atlassian.net/browse/PROJ-456',
        targetDate: new Date('2025-02-15'),
        description: 'Directory service API implementation'
      },
      {
        id: 'jira-3',
        name: 'Collective Intelligence Demo',
        type: 'demo' as any,
        owner: 'Frontend Team',
        status: ArtifactStatus.TESTING,
        source: DataSource.JIRA,
        sourceUrl: 'https://company.atlassian.net/browse/PROJ-789',
        targetDate: new Date('2025-01-20'),
        description: 'Interactive demo for CI launch'
      }
    ];
  }

  // Airtable Agent - Marketing and Product data
  async fetchAirtableData(): Promise<Content[]> {
    await this.simulateDelay(600);
    
    return [
      {
        id: 'airtable-1',
        name: 'HAX Launch Announcement Blog',
        type: 'blog_post' as any,
        owner: 'Sarah Chen',
        status: ContentStatus.IN_REVIEW,
        approvalChain: [
          {
            id: 'app-1',
            approver: 'Sarah Chen',
            role: 'Content Manager',
            status: 'approved' as any,
            approvedAt: new Date('2025-12-08'),
            order: 1
          },
          {
            id: 'app-2',
            approver: 'Mike Johnson',
            role: 'Product Lead',
            status: 'pending' as any,
            order: 2
          },
          {
            id: 'app-3',
            approver: 'Lisa Wang',
            role: 'Legal',
            status: 'pending' as any,
            order: 3
          }
        ],
        targetDate: new Date('2025-12-12'),
        description: 'Official launch announcement for HAX SDK',
        linkedArtifacts: ['jira-1'],
        priority: 'high' as any
      },
      {
        id: 'airtable-2',
        name: 'Collective Intelligence Research Paper',
        type: 'research_paper' as any,
        owner: 'Dr. Emily Rodriguez',
        status: ContentStatus.DRAFT,
        approvalChain: [
          {
            id: 'app-4',
            approver: 'Dr. Emily Rodriguez',
            role: 'Research Lead',
            status: 'pending' as any,
            order: 1
          },
          {
            id: 'app-5',
            approver: 'Dr. James Kim',
            role: 'Peer Reviewer',
            status: 'pending' as any,
            order: 2
          }
        ],
        targetDate: new Date('2025-01-15'),
        description: 'Research findings on collective intelligence systems',
        linkedArtifacts: ['jira-3'],
        priority: 'medium' as any
      },
      {
        id: 'airtable-3',
        name: 'AGNTCY Directory Blog Post',
        type: 'blog_post' as any,
        owner: 'Tom Anderson',
        status: ContentStatus.DRAFT,
        approvalChain: [
          {
            id: 'app-6',
            approver: 'Tom Anderson',
            role: 'Marketing Manager',
            status: 'pending' as any,
            order: 1
          }
        ],
        targetDate: new Date('2025-02-10'),
        description: 'Launch blog for AGNTCY Directory v1.0',
        linkedArtifacts: ['jira-2'],
        priority: 'medium' as any
      }
    ];
  }

  // Confluence Agent - Documentation and planning
  async fetchConfluenceData(): Promise<any[]> {
    await this.simulateDelay(500);
    
    return [
      {
        id: 'conf-1',
        title: 'HAX Launch Plan',
        url: 'https://company.atlassian.net/wiki/HAX-PLAN',
        lastUpdated: new Date('2025-12-05'),
        type: 'launch_plan'
      },
      {
        id: 'conf-2',
        title: 'Collective Intelligence Requirements',
        url: 'https://company.atlassian.net/wiki/CI-REQS',
        lastUpdated: new Date('2025-11-28'),
        type: 'requirements'
      },
      {
        id: 'conf-3',
        title: 'AGNTCY Directory Technical Specs',
        url: 'https://company.atlassian.net/wiki/AGNTCY-SPECS',
        lastUpdated: new Date('2025-12-01'),
        type: 'technical_specs'
      }
    ];
  }

  // GitHub Agent - Code and deployment status
  async fetchGitHubData(): Promise<any[]> {
    await this.simulateDelay(700);
    
    return [
      {
        id: 'gh-1',
        repository: 'hax-sdk',
        branch: 'main',
        commits: 145,
        pullRequests: 12,
        lastDeploy: new Date('2025-12-08'),
        status: 'deployed'
      },
      {
        id: 'gh-2',
        repository: 'agntcy-directory',
        branch: 'develop',
        commits: 89,
        pullRequests: 8,
        lastDeploy: new Date('2025-12-05'),
        status: 'testing'
      },
      {
        id: 'gh-3',
        repository: 'collective-intelligence',
        branch: 'feature/demo',
        commits: 67,
        pullRequests: 5,
        lastDeploy: new Date('2025-12-07'),
        status: 'testing'
      }
    ];
  }

  // Sync all data sources
  async syncAllData(): Promise<{
    artifacts: Artifact[];
    content: Content[];
    confluence: any[];
    github: any[];
  }> {
    const [artifacts, content, confluence, github] = await Promise.all([
      this.fetchJiraData(),
      this.fetchAirtableData(),
      this.fetchConfluenceData(),
      this.fetchGitHubData()
    ]);

    return { artifacts, content, confluence, github };
  }

  // Get connection status for all data sources
  getConnectionStatus(): Map<DataSource, DataSourceConfig> {
    return this.configs;
  }

  // Simulate network delay
  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
