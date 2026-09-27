import { useSortable } from '@dnd-kit/react/sortable';
import { Ticket } from '@/types';
import { TimerIcon } from 'lucide-react';
import { useState } from 'react';
import TicketModal from './TicketModal';

interface TicketItemType {
  ticket: Ticket;
  index: number;
  column: string;
  statuses: string[];
}

export function TicketItem({
  ticket,
  index,
  column,
  statuses,
}: TicketItemType) {
  const { id, title, description, due_date, severity } = ticket;

  const [open, setOpen] = useState(false);

  const severityColors: Record<Ticket['severity'], string> = {
    low: 'bg-green-500',
    medium: 'bg-orange-500',
    high: 'bg-red-500',
  };

  const { ref, isDragging } = useSortable({
    id: id,
    index,
    type: 'item',
    accept: 'item',
    group: column,
  });

  const dueDate = new Date(due_date);
  const today = new Date();
  const isToday = dueDate.toDateString() === today.toDateString();

  const dateStyle = isToday
    ? 'bg-yellow-500/50'
    : dueDate > today
      ? 'bg-green-500/50'
      : 'bg-red-500/50';

  return (
    <>
      <TicketModal
        statuses={statuses}
        open={open}
        onOpenChange={setOpen}
        ticket={ticket}
      />
      <div
        onClick={() => setOpen(true)}
        className={`column-item relative z-20 m-3 flex h-35 flex-col justify-between rounded-md border border-slate-400 bg-white p-2 shadow transition-shadow hover:shadow-2xl ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        ref={ref}
        data-dragging={isDragging}
      >
        <div>
          <div className='flex'>
            <h3 className='flex-1'>{title}</h3>
            <div
              className={`flex size-7 items-center justify-center rounded-full font-bold text-white ${severityColors[severity]}`}
            >
              {severity.charAt(0).toUpperCase()}
            </div>
          </div>
          <p className='line-clamp-2 text-sm'>{description}</p>
        </div>
        <div
          className={`flex w-fit items-center justify-center gap-1 rounded-sm p-1 text-sm ${dateStyle}`}
        >
          <TimerIcon size={16} className='text-gray-800/50' />
          {new Date(due_date).toLocaleDateString('en-AU', {
            day: '2-digit',
            month: 'short',
          })}
        </div>
      </div>
    </>
  );
}
