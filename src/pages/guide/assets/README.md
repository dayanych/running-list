# Guide screenshots

The guide loads these PNG files through Vite. If a screenshot is missing, its figure is omitted.

| File                | Capture                                        | Section                          |
| ------------------- | ---------------------------------------------- | -------------------------------- |
| `week-overview.png` | Task names and seven columns of daily marks    | Your week at a glance            |
| `add-task.png`      | The task input and its plus button             | Start with a few tasks           |
| `choose-status.png` | A day cell with its status menu open           | Give each day a mark             |
| `next-week.png`     | A task menu with Copy to next week highlighted | Make room for next week          |
| `habit-example.png` | Read for 20 minutes with marks on several days | Keep habits alongside your tasks |

Use demonstration data and crop to the relevant controls. Keep labels readable on a phone and use the current English menu labels when taking new screenshots.

When replacing a crop, update its display dimensions in `../ui/guide-figure.tsx` to match the image's aspect ratio. Update its alt text and caption in `../ui/guide-page.tsx` if the example changes.
