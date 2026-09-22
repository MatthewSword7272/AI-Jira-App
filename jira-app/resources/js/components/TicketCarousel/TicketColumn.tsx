import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';
import { ReactNode } from 'react';

export function TicketColumn({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
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
      className={`border border-white rounded-md h-160 w-60 bg-white! text-black opacity-100 transition-opacity duration-750 starting:opacity-0`}
      ref={ref}
    >
      {children}
    </div>
  );
}
