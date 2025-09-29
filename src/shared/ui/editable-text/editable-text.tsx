import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';

import { cn } from '@/shared/lib/cn';

import { Input } from '../shadcn/input';

interface EditableTextProps {
  title: string;
  onChangeFinish: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
}

export const EditableText = ({
  title,
  onChangeFinish,
  className,
  disabled = false,
  // isLoading = false,
  placeholder = 'Empty title',
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(title);

  if (title !== text && !isEditing) {
    setText(title);
  }

  const handleFinishEditing = useCallback(() => {
    if (!isEditing) return;

    const trimmedText = text.trim();
    onChangeFinish(trimmedText);
    setIsEditing(false);
  }, [isEditing, onChangeFinish, text]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleFinishEditing();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setText(title);
        setIsEditing(false);
      }
    },
    [handleFinishEditing, title],
  );

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && !isEditing) {
      setIsEditing(true);
    }
  }, [disabled, isEditing]);

  return (
    <div
      className={cn(
        'relative w-full pl-10',
        disabled && 'cursor-not-allowed opacity-60',
        !disabled && !isEditing && 'cursor-pointer',
        className,
      )}
      onClick={handleClick}
      role="textbox"
      aria-label="Editable text"
      aria-readonly={disabled}
    >
      {isEditing ? (
        <Input
          value={text}
          onChange={handleChange}
          onBlur={handleFinishEditing}
          onKeyDown={handleKeyDown}
          autoFocus
          className="h-full rounded-none border-x-0 border-b border-t-0 p-0 py-2 text-[length:inherit] focus:outline-none focus:ring-0"
          aria-label="Edit text"
        />
      ) : (
        text.trim() || (
          <span className="text-muted-foreground">{placeholder}</span>
        )
      )}
    </div>
  );
};
