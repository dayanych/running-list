import { ChangeEvent, KeyboardEvent, useState } from 'react';

import { cn } from '@/shared/lib/cn';

import { Input } from '../shadcn/input';

interface EditableTextProps {
  value: string;
  onChangeFinish: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const EditableText = ({
  value,
  onChangeFinish,
  className,
  disabled = false,
  placeholder = 'Empty title',
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(value);
  const isInteractionDisabled = disabled;

  const handleFinishEditing = () => {
    if (!isEditing) return;

    const trimmedText = editingText.trim();

    onChangeFinish(trimmedText);
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        handleFinishEditing();
        break;
      case 'Escape':
        event.preventDefault();
        setEditingText(value);
        setIsEditing(false);
        break;
      default:
        break;
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingText(event.target.value);
  };

  const handleClick = () => {
    if (!isInteractionDisabled && !isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div
      className={cn(
        'relative w-full pl-10',
        isInteractionDisabled && 'cursor-not-allowed opacity-60',
        !isInteractionDisabled && !isEditing && 'cursor-pointer',
        className,
      )}
      onClick={handleClick}
      role="textbox"
      aria-label="Editable text"
      aria-readonly={isInteractionDisabled}
      aria-disabled={isInteractionDisabled}
    >
      {isEditing ? (
        <Input
          value={editingText}
          onChange={handleChange}
          onBlur={handleFinishEditing}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={isInteractionDisabled}
          className="h-full rounded-none border-x-0 border-b border-t-0 p-0 py-2 text-[length:inherit] focus:outline-none focus:ring-0"
          aria-label="Edit text"
        />
      ) : (
        editingText.trim() || (
          <span className="text-muted-foreground">{placeholder}</span>
        )
      )}
    </div>
  );
};
