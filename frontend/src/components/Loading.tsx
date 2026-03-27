'use client';

interface LoadingProps {
  text?: string;
  type?: 'spinner' | 'skeleton' | 'pulse';
}

export function Loading({ text = 'Carregando...', type = 'spinner' }: LoadingProps) {
  if (type === 'skeleton') {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="flex flex-col items-center gap-2 text-gray-600">
        <div className="h-12 w-12 rounded-full bg-blue-500 animate-pulse"></div>
        <p>{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-gray-600">
      <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      <p>{text}</p>
    </div>
  );
}
