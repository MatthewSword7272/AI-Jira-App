import { router, useForm } from '@inertiajs/react';
import {
  CalendarDaysIcon,
  CircleDotIcon,
  ClockIcon,
  FlagIcon,
  HistoryIcon,
  LucideIcon,
  Trash,
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { toast } from '../ui/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { formatDate, formatStatus, severityOptions } from '@/lib/utils';
import { Ticket } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

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

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket;
  statuses: string[];
}

export default function TicketModal({
  open,
  onOpenChange,
  ticket,
  statuses,
}: TicketModalProps) {
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

  const due = dueStatus(due_date);

  const statusOptions = statuses.map((value) => ({
    value,
    label: formatStatus(value),
  }));

  const [isDeleting, setIsDeleting] = useState(false);

  const { data, setData, patch, processing, errors } = useForm({
    id: id,
    title: title,
    status: status,
    description: description,
    severity: severity,
    due_date: due_date,
  });

  const styles = severityStyles[data.severity];

  function deleteTicket() {
    setIsDeleting(true);
    router.delete(`/ticket/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.add({
          type: 'success',
          title: 'Ticket Deleted',
        });
        onOpenChange(false);
      },
      onError: () => {
        toast.add({
          type: 'error',
          title: 'Could not delete ticket',
        });
      },
      onFinish: () => setIsDeleting(false),
    });
  }

  function changeTicket(e: React.SubmitEvent) {
    e.preventDefault();
    patch(`/ticket/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.add({
          type: 'success',
          title: 'Ticket Updated',
        });
      },
      onError: () => {
        toast.add({
          type: 'error',
          title: 'Could not update ticket',
        });
      },
    });
  }

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
      <dt className='flex items-center gap-1.5 text-xs font-medium tracking-wider text-slate-400 uppercase'>
        <Icon size={14} />
        {label}
      </dt>
      <dd className='text-sm text-slate-800'>{children}</dd>
    </div>
  );

  const DeleteAlertModal = () => {
    return (
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button type='button' variant={'destructive'} disabled={isDeleting}>
              <Trash />
              Delete
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTicket} variant={'destructive'}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='gap-0 overflow-hidden bg-white p-0 sm:max-w-3xl'>
          <div className={`h-1.5 bg-linear-to-r ${styles.bar}`} />

          <form
            onSubmit={changeTicket}
            className='grid md:grid-cols-[1fr_16rem]'
          >
            <div className='space-y-6 p-6 md:p-8'>
              <div className='space-y-2'>
                <DialogTitle>
                  <input
                    onChange={(e) => {
                      setData('title', e.target.value);
                    }}
                    defaultValue={data.title}
                    className='w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-2xl leading-tight font-semibold text-slate-900 hover:border-slate-200 focus:border-slate-300 focus:outline-none'
                  />
                </DialogTitle>
              </div>

              <section className='h-46.25 overflow-y-auto'>
                <h4 className='mb-2 font-semibold'>Description</h4>
                {data.description ? (
                  <DialogDescription className={'h-full'}>
                    <textarea
                      onChange={(e) => {
                        setData('description', e.target.value);
                      }}
                      className='h-full w-full text-sm leading-relaxed whitespace-pre-wrap text-slate-700'
                      defaultValue={data.description}
                    />
                  </DialogDescription>
                ) : (
                  <p className='text-sm text-slate-400 italic'>
                    No description provided.
                  </p>
                )}
              </section>
              <section className='flex gap-2'>
                <Button type='submit' disabled={processing}>
                  Update
                </Button>
                {DeleteAlertModal()}
              </section>
            </div>

            <aside className='border-t border-slate-100 bg-slate-50/70 p-6 md:border-t-0 md:border-l'>
              <dl className='space-y-5'>
                <Detail label='Status' icon={CircleDotIcon}>
                  <Select
                    items={statusOptions}
                    value={data.status}
                    onValueChange={(value) =>
                      setData('status', value as string)
                    }
                  >
                    <SelectTrigger
                      type='button'
                      size='sm'
                      aria-label='Status'
                      className='rounded-md border-0 bg-slate-900 pl-2.5 text-xs font-medium text-white'
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Detail>

                <Detail label='Severity' icon={FlagIcon}>
                  <Select
                    items={severityOptions}
                    value={data.severity}
                    onValueChange={(value) =>
                      setData('severity', value as Ticket['severity'])
                    }
                  >
                    <SelectTrigger
                      type='button'
                      size='sm'
                      aria-label='Severity'
                      className={`rounded-full border-0 pl-2.5 text-xs font-medium capitalize ring-1 ring-inset ${styles.badge}`}
                    >
                      <span className={`size-1.5 rounded-full ${styles.dot}`} />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {severityOptions.map((option) => (
                        <SelectItem
                          className={'[&_div]:items-center'}
                          key={option.value}
                          value={option.value}
                        >
                          <span
                            className={`size-1.5 rounded-full ${severityStyles[option.value].dot}`}
                          />
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
