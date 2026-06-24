export const getEmptyStateMessage = () => {
  const prompts = [
    'Small steps create big progress. Add your first task.',
    'Turn your goal into action. Start with one task.',
    'Make this week count. Add something worth completing.',
    'Your next win starts with one clear task.',
    'Choose a priority and take the first step.',
    'Build momentum by adding one meaningful task.',
    'Shape your week, one focused task at a time.',
    'Start small, stay consistent, and keep moving forward.',
  ];

  const randomIndex = Math.floor(Math.random() * prompts.length);

  return prompts[randomIndex];
};
