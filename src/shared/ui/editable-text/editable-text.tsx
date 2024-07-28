import { useState } from 'react';

import { Input } from '../shadcn/input';

const ENTER = 'Enter';

const renderInput = (
  text: string,
  setValue: (event: React.ChangeEvent<HTMLInputElement>) => void,
) => (
  <Input
    value={text}
    autoFocus={true}
    onChange={setValue}
    className="h-full rounded-none border-x-transparent border-t-transparent px-0 py-1 text-[length:inherit] focus:outline-none focus:ring-0 disabled:opacity-50"
  />
);

const renderText = (text: string) => {
  const title = text === '' ? 'Task with empty title' : text;

  return <div className="text">{title}</div>;
};

interface EditableTextProps {
  title: string;
  onChangeFinish: (value: string) => void;
}

export const EditableText = ({ title, onChangeFinish }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(title);

  const handleChangeFinish = () => {
    onChangeFinish(text);
    setIsEditing(false);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === ENTER) {
      handleChangeFinish();
    }
  };

  const setValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <div
      onClick={() => {
        setIsEditing(true);
      }}
      onBlur={handleChangeFinish}
      onKeyDown={handleEnter}
      className="w-full"
    >
      {isEditing ? renderInput(text, setValue) : renderText(text)}
    </div>
  );
};
