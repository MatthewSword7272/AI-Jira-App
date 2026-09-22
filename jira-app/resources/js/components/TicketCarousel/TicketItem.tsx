import { useSortable } from '@dnd-kit/react/sortable';
import { Ticket } from '@/types';
import {
  CalendarDaysIcon,
  CircleDotIcon,
  ClockIcon,
  FlagIcon,
  HistoryIcon,
  TimerIcon,
  type LucideIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { useState, type ReactNode } from 'react';

interface TicketItemType {
  ticket: Ticket;
  index: number;
  column: string;
}

export function TicketItem({ ticket, index, column }: TicketItemType) {
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
      <TicketModal open={open} onOpenChange={setOpen} ticket={ticket} />
      <div
        onClick={() => setOpen(true)}
        className={`column-item relative flex justify-between flex-col h-35 z-20 border border-slate-400 p-2 shadow hover:shadow-2xl transition-shadow m-3 rounded-md bg-white ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        ref={ref}
        data-dragging={isDragging}
      >
        <div>
          <h3>{title}</h3>
          <p className='text-sm truncate'>{description}</p>
        </div>
        <div
          className={`text-sm rounded-sm p-1 w-20 flex items-center justify-center gap-1 ${dateStyle}`}
        >
          <TimerIcon size={16} className='text-gray-800/50' />
          {new Date(due_date).toLocaleDateString('en-AU', {
            day: '2-digit',
            month: 'short',
          })}
        </div>
        <div
          className={`flex items-center justify-center absolute right-3 top-2 rounded-full text-white size-7 font-bold ${severityColors[severity]}`}
        >
          {severity.charAt(0).toUpperCase()}
        </div>
      </div>
    </>
  );
}

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket;
}

const severityStyles: Record<
  Ticket['severity'],
  { bar: string; badge: string; dot: string }
> = {
  low: {
    bar: 'from-green-400 to-emerald-500',
    badge: 'bg-green-50 text-green-700 ring-green-600/20',
    dot: 'bg-green-500',
  },
  medium: {
    bar: 'from-amber-400 to-orange-500',
    badge: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    dot: 'bg-orange-500',
  },
  high: {
    bar: 'from-rose-500 to-red-600',
    badge: 'bg-red-50 text-red-700 ring-red-600/20',
    dot: 'bg-red-500',
  },
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const dueStatus = (dueDate: string) => {
  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const days = Math.round(
    (startOfDay(new Date(dueDate)) - startOfDay(new Date())) / 86_400_000,
  );
  const plural = (n: number) => `${n} day${n === 1 ? '' : 's'}`;

  if (days === 0)
    return { text: 'Due today', className: 'bg-yellow-100 text-yellow-800' };
  if (days > 0)
    return {
      text: `Due in ${plural(days)}`,
      className: 'bg-green-100 text-green-800',
    };
  return {
    text: `${plural(-days)} overdue`,
    className: 'bg-red-100 text-red-800',
  };
};

const Detail = ({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: LucideIcon;
  children: ReactNode;
}) => (
  <div className='space-y-1.5'>
    <dt className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400'>
      <Icon size={14} />
      {label}
    </dt>
    <dd className='text-sm text-slate-800'>{children}</dd>
  </div>
);

const TicketModal = ({ open, onOpenChange, ticket }: TicketModalProps) => {
  const {
    id,
    title,
    description,
    severity,
    status,
    due_date,
    created_at,
    updated_at,
  } = ticket;
  const styles = severityStyles[severity];
  const due = dueStatus(due_date);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='gap-0 overflow-hidden bg-white p-0 sm:max-w-3xl'>
        <div className={`h-1.5 bg-linear-to-r ${styles.bar}`} />

        <div className='grid md:grid-cols-[1fr_16rem]'>
          <div className='space-y-6 p-6 md:p-8'>
            <div className='space-y-2'>
              <DialogTitle className='text-2xl font-semibold leading-tight text-slate-900'>
                {title}
              </DialogTitle>
            </div>

            <section>
              <h4 className='mb-2 font-semibold'>Description</h4>
              {description ? (
                <DialogDescription className='whitespace-pre-wrap text-sm leading-relaxed text-slate-700'>
                  {description}
                </DialogDescription>
              ) : (
                <p className='text-sm italic text-slate-400'>
                  No description provided.
                </p>
              )}
            </section>
          </div>

          <aside className='border-t border-slate-100 bg-slate-50/70 p-6 md:border-t-0 md:border-l'>
            <dl className='space-y-5'>
              <Detail label='Status' icon={CircleDotIcon}>
                <span className='inline-flex rounded-md bg-slate-900 px-2 py-0.5 text-xs font-medium capitalize text-white'>
                  {status.replace(/[_-]/g, ' ')}
                </span>
              </Detail>

              <Detail label='Severity' icon={FlagIcon}>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${styles.badge}`}
                >
                  <span className={`size-1.5 rounded-full ${styles.dot}`} />
                  {severity}
                </span>
              </Detail>

              <Detail label='Due date' icon={CalendarDaysIcon}>
                <div className='flex flex-col items-start gap-1.5'>
                  <span className='font-medium'>{formatDate(due_date)}</span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${due.className}`}
                  >
                    {due.text}
                  </span>
                </div>
              </Detail>

              <div className='space-y-3 border-t border-slate-200 pt-5 text-xs text-slate-500'>
                <p className='flex items-center gap-1.5'>
                  <ClockIcon size={13} /> Created {formatDate(created_at)}
                </p>
                <p className='flex items-center gap-1.5'>
                  <HistoryIcon size={13} /> Updated {formatDate(updated_at)}
                </p>
              </div>
            </dl>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
};
