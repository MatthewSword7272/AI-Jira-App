import { router, useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { TicketValidator } from '@/lib/validator';
import { Button } from './ui/button';
import { useState, type FormEvent } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';

export default function AddTicket({ severities }: { severities: string[] }) {
  const {
    data: formData,
    setData: setFormData,
    post,
    processing,
    errors,
  } = useForm({
    title: '',
    description: '',
    severity: '',
    due_date: new Date(),
  });

  const [open, setOpen] = useState(false);

  function submitTicket(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    try {
      TicketValidator.parse(formData);

      post(route('ticket.store'));

      setOpen(false);
    } catch {
      console.error(errors);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className='bg-white text-black px-5 py-2 rounded cursor-pointer hover:shadow-2xl hover:bg-gray-200 duration-200 ease-linear'>
          Add Ticket
        </DialogTrigger>
        <DialogContent className={'bg-white'}>
          <DialogTitle>Create New Ticket</DialogTitle>
          <form onSubmit={submitTicket} className='flex flex-col gap-5'>
            <div className='space-y-3'>
              <Label htmlFor='title'>Title</Label>
              <Input
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                id='title'
                name='title'
              />
            </div>
            <div className='space-y-3'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                id='description'
                name='description'
                className='w-full'
              />
            </div>
            <div className='space-y-3'>
              <Label htmlFor='severity'>Severity</Label>
              <Select
                onValueChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    severity: (e as string).toLowerCase(),
                  }))
                }
              >
                <SelectTrigger className='w-45'>
                  <SelectValue placeholder='Level' />
                </SelectTrigger>
                <SelectContent>
                  {severities.map((item) => (
                    <SelectItem className={'capitalize'} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-3'>
              <Label htmlFor='due_date'>Due Date</Label>
              <Input
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    due_date: new Date(e.target.value),
                  }))
                }
                id='severity'
                type='date'
                name='severity'
              ></Input>
            </div>
            <Button type='submit' className={'cursor-pointer'}>
              Submit Ticket
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
