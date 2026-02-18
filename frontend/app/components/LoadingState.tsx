interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading..."
}: LoadingStateProps) {
  return (
    <div className="section">
      <div className="card text-center py-12">
        <h2 className="text-xl font-semibold">
          {message}
        </h2>
      </div>
    </div>
  );
}
