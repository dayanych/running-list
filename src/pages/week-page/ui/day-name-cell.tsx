interface Props {
  day: string;
}

export const DayNameCell = ({ day }: Props) => (
  <div className="w-state text-center">
    <span>{day}</span>
  </div>
);
