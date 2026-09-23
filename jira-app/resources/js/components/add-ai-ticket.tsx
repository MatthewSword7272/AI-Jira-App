import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { useForm } from '@inertiajs/react';
import { Button } from './ui/button';
import { Mosaic } from 'react-loading-indicators';

export default function AddAITicket() {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    message: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/ticket/ai', {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className='bg-white text-black px-5 py-2 rounded cursor-pointer hover:shadow-2xl hover:bg-gray-200 duration-200 ease-linear'>
          Add Ticket through Chatbot
        </DialogTrigger>
        <DialogContent className={'bg-white'}>
          <DialogTitle>Create New Ticket</DialogTitle>
          {!processing ? (
            <form onSubmit={submit} className='flex flex-col gap-3'>
              <Textarea
                onChange={(e) => setData('message', e.target.value)}
                value={data.message}
                disabled={processing}
                placeholder='e.g. "Checkout crashes on Safari, urgent, need it fixed by Friday"'
              ></Textarea>

              {errors.message && (
                <p className='text-sm text-red-600'>{errors.message}</p>
              )}
              <Button
                type='submit'
                disabled={processing || !data.message.trim()}
              >
                {processing ? 'Creating…' : 'Create ticket'}
              </Button>
            </form>
          ) : (
            <div className='mx-auto'>
              <Mosaic
                color='#9f9f9f8c'
                size='small'
                text='Processing...'
                textColor='black'
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
