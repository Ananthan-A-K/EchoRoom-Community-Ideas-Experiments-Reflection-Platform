interface ErrorStateProps {
  message: string;
}

export default function ErrorState({
  message
}: ErrorStateProps) {
  return (
    <div className="section">
      <div className="card text-center py-12">
        <h2 className="text-xl font-semibold text-red-600">
          Error: {message}
        </h2>
      </div>
    </div>
  );
}
