import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';
import { ReactNode } from 'react';

export function TicketColumn({
  children,
  status,
  id,
}: {
  children: ReactNode;
  id: string;
  status: string;
}) {
  const { isDropTarget, ref } = useDroppable({
    id,
    type: 'column',
    collisionPriority: CollisionPriority.Low,
    accept: 'item',
  });

  const style = isDropTarget ? { background: '#00000030' } : undefined;

  return (
    <div
      style={style}
      className={`relative flex h-160 w-60 flex-col overflow-hidden rounded-md border border-white bg-white! text-black opacity-100 transition-opacity duration-750 starting:opacity-0`}
      ref={ref}
    >
      <div className='w-full shrink-0 border-b border-slate-400 p-2'>
        {status}
      </div>
      <div className='ticket-column min-h-0 flex-1 overflow-y-auto'>
        {children}
      </div>
    </div>
  );
}
