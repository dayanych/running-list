export const getEmptyStateMessage = () => {
  const prompts = [
    '📌 Let’s plan your week — start by adding a task',
    '💭 No tasks yet. What’s one thing you’d like to do this week?',
    '✨ Your week is a blank canvas. Add your first task to begin.',
    '📝 Write your first task and set the tone for the week!',
    '🚀 Ready when you are — let’s add your first goal.',
    "🌱 Every plan starts with a single task. What's yours?",
    '📅 Make this week yours. Add your first task!',
    '💡 Got an idea? Add it as your first task.',
    '🔖 Nothing here yet. Let’s change that.',
    '🧠 Think it, write it, do it — start with one task.',
    '🎯 What’s your focus this week? Let’s write it down.',
    '🕊️ No pressure. Just add one thing you’d like to try.',
    '🧭 Small steps make big changes. Start with one.',
  ];

  const randomIndex = Math.floor(Math.random() * prompts.length);

  return prompts[randomIndex];
};
