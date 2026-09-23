import { Head, Link, router, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { isSortable } from '@dnd-kit/react/sortable';
import { useEffect, useState } from 'react';
import { TicketColumn } from '@/components/TicketCarousel/TicketColumn';
import { TicketItem } from '@/components/TicketCarousel/TicketItem';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import AddTicket from '@/components/add-ticket';
import { Ticket } from '@/types';
import AddAITicket from '@/components/add-ai-ticket';

export default function Welcome({
  tickets,
  statuses,
  severities,
}: {
  tickets: Record<string, Ticket[]>;
  statuses: string[];
  severities: string[];
}) {
  const { auth } = usePage().props;

  const [items, setItems] = useState(tickets);

  useEffect(() => {
    setItems(tickets);
  }, [tickets]);

  return (
    <>
      <Head title='Welcome' />
      <div className='flex min-h-screen flex-col items-center bg-blue-500 p-6 text-white lg:justify-center lg:p-8 dark:bg-[#0a0a0a]'>
        <header className='mb-6 w-full max-w-83.75 text-sm not-has-[nav]:hidden lg:max-w-4xl'>
          <nav className='flex items-center justify-end gap-4'>
            {auth.user ? (
              <Link
                href={dashboard()}
                className='inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-white hover:border-[#1915014a]'
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={login()}
                  className='inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-white hover:border-[#19140035]'
                >
                  Log in
                </Link>
                <Link
                  href={register()}
                  className='inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-white hover:border-[#1915014a]'
                >
                  Register
                </Link>
              </>
            )}
            <AddTicket severities={severities} />
            <AddAITicket />
          </nav>
        </header>
        <div className='w-full'>
          <main>
            <DragDropProvider
              onDragOver={(event) => {
                setItems((items) => move(items, event));
              }}
              onDragEnd={(event) => {
                const { source, canceled } = event.operation;

                if (canceled || !isSortable(source)) return;

                const original = Object.values(tickets)
                  .flat()
                  .find((t) => t.id === source.id);

                if (!original || original.status === source.group) return;

                router.patch(
                  `/ticket/updateStatus/${source.id}`,
                  { status: source.group },
                  { preserveScroll: true, preserveState: true },
                );
              }}
            >
              <Carousel
                opts={{
                  align: 'start',
                  skipSnaps: false,
                  watchDrag: (_emblaApi, event) => {
                    const target = event.target as HTMLElement;
                    if (target.closest('.column-item')) {
                      return false;
                    }
                    return true;
                  },
                }}
                className={`-mx-6 lg:-mx-4`}
              >
                <CarouselContent>
                  {statuses.map((status, index) => (
                    <CarouselItem key={index} className='basis-auto'>
                      <TicketColumn id={status} status={status}>
                        <>
                          {(items[status] ?? []).map((ticket, index) => {
                            return (
                              <TicketItem
                                ticket={ticket}
                                index={index}
                                column={status}
                                key={ticket.id}
                              />
                            );
                          })}
                        </>
                      </TicketColumn>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </DragDropProvider>
          </main>
        </div>
        <div className='hidden h-14.5 lg:block'></div>
      </div>
    </>
  );
}
