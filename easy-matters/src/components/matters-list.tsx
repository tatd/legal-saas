import { type Matter, useCreateMatterMutation } from '@/services/customersApi';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

function MatterItem({ matter }: { matter: Matter }) {
  return (
    <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{matter.name}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {matter.description}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(matter.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
}

type MattersListProps = {
  matters: Matter[];
  customerId: number;
};

type FormData = {
  name: string;
  description: string;
};

export function MattersList({ matters, customerId }: MattersListProps) {
  const [createMatter, { isLoading }] = useCreateMatterMutation();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await createMatter({
        ...data,
        customerId
      }).unwrap();
      reset();
    } catch (err) {
      setError('Failed to create matter. Please try again.');
      console.error('Failed to create matter:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-6 border rounded-lg bg-card">
        <h2 className="text-lg font-semibold">Create New Matter</h2>
        {error && (
          <div className="mb-3 p-2 text-red-600 text-sm bg-red-50 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">
              Matter Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              placeholder="Enter matter name"
              {...register('name', { required: 'Name is required' })}
              className={errors.name ? 'border-red-300' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none"
            >
              Description <span className="text-destructive">*</span>
            </label>
            <Input
              id="description"
              placeholder="Enter description"
              {...register('description', {
                required: 'Description is required'
              })}
              className={errors.description ? 'border-red-300' : ''}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Matter'}
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-2">
        {matters.map((matter) => (
          <MatterItem key={matter.id} matter={matter} />
        ))}
      </div>
    </div>
  );
}
