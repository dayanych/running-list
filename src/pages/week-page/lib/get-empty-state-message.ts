export const getEmptyStateMessage = () => {
  const messages = [
    'Write the first line of the week. One task carries across all seven days',
    'Add the first task for this week. Track its progress one day at a time',
    'Start with one clear task. Its daily status will stay visible here',
    'Create a task to begin. You can follow it across every day of the week',
    'Add one task for the week. Mark each day as you make progress',
    'Set the first task for this week. The seven-day view will appear here',
    'Begin with the task that matters most. Track it throughout the week',
    'Choose one task to start. Its full week will stay in view',
  ];

  return messages[Math.floor(Math.random() * messages.length)];
};
