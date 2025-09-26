export const mockStats = {
  totalFeedback: 342,
  serviceFeedback: 198,
  staffFeedback: 144,
  avgResponseTime: '2.3',
  implementationRate: 67,
  satisfactionScore: 4.2
};

export const mockServiceFeedback = [
  {
    id: 1,
    area: 'customerService',
    type: 'suggestion',
    title: 'feedback.mock.improveResponseTime',
    description: 'feedback.mock.chatSystemSuggestion',
    submittedBy: 'Cliente A',
    timestamp: '2024-01-15',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 2,
    area: 'operations',
    type: 'negative',
    title: 'feedback.mock.coordinationProblems',
    description: 'feedback.mock.scheduleConfusion',
    submittedBy: 'Cliente B',
    timestamp: '2024-01-14',
    status: 'in_progress',
    priority: 'medium'
  },
  {
    id: 3,
    area: 'safety',
    type: 'positive',
    title: 'feedback.mock.excellentSafety',
    description: 'feedback.mock.feltSafe',
    submittedBy: 'Cliente C',
    timestamp: '2024-01-13',
    status: 'reviewed',
    priority: 'low'
  }
];

export const mockStaffFeedback = [
  {
    id: 1,
    staffName: 'Carlos Mendez',
    staffRole: 'feedback.roles.tourGuide',
    category: 'communication',
    type: 'recognition',
    title: 'feedback.mock.excellentCommunication',
    description: 'feedback.mock.clearExplanations',
    submittedBy: 'Supervisor A',
    timestamp: '2024-01-15',
    status: 'reviewed'
  },
  {
    id: 2,
    staffName: 'Ana García',
    staffRole: 'feedback.roles.coordinator',
    category: 'performance',
    type: 'suggestion',
    title: 'feedback.mock.improveFollowUp',
    description: 'feedback.mock.structuredSystem',
    submittedBy: 'Manager B',
    timestamp: '2024-01-14',
    status: 'pending'
  }
];