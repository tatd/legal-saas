import { type Matter } from '@/services/customersApi';

function MatterItem({ matter }: { matter: Matter }) {
  return (
    <div className="p-2 border-b last:border-b-0">
      <div className="font-medium">{matter.name}</div>
      <div className="text-sm text-gray-600">{matter.description}</div>
      <div className="text-xs text-gray-500">
        Created: {new Date(matter.createdAt).toLocaleDateString('en-US')}
      </div>
    </div>
  );
}

type MattersListProps = {
  matters: Matter[];
};

export function MattersList({ matters }: MattersListProps) {
  if (!matters.length) {
    return <div className="p-2 text-sm text-gray-500">No matters found</div>;
  }

  return (
    <div className="divide-y">
      {matters.map((matter) => (
        <MatterItem key={matter.id} matter={matter} />
      ))}
    </div>
  );
}
