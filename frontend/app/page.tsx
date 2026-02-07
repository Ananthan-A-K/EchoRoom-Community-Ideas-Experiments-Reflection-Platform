import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 text-gray-900">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">EchoRoom</h1>
            <p className="text-sm text-gray-600">
              Ideas • {" "}
              <Link href="/experiments">Experiments</Link>{" "} • Reflection
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
            OSQ Project
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-5xl font-bold mb-6 leading-tight">
          Turn Ideas into
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
            {" "}Learning
          </span>
        </h2>

        <p className="text-lg text-gray-700 max-w-2xl">
          EchoRoom is a community platform where ideas aren't just discussed they're 
          tested through real experiments and reflected on openly. Learn by doing, together.
        </p>

        {/* Placeholder CTA */}
        <button
          disabled
          className="mt-8 px-6 py-3 rounded-lg bg-indigo-600/20 text-indigo-700 cursor-not-allowed border border-indigo-300"
        >
          Start Exploring (Coming Soon)
        </button>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h3 className="text-3xl font-semibold mb-10">
            How EchoRoom Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Idea",
                emoji: "💡",
                color: "indigo",
                text: "Share a thought, proposal, or question with the community."
              },
              {
                title: "Experiment",
                emoji: "🧪",
                color: "emerald",
                text: "Test your idea through a small, time-bound experiment."
              },
              {
                title: "Outcome",
                emoji: "📊",
                color: "amber",
                text: "Record what actually happened  success, fail, or mixed."
              },
              {
                title: "Reflection",
                emoji: "🧠",
                color: "rose",
                text: "Share what you learned and discuss insights with others."
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border p-6 bg-gradient-to-br from-white to-gray-50"
              >
                <div className={`text-3xl mb-3`}>
                  {item.emoji}
                </div>
                <h4 className={`font-semibold text-lg mb-2 text-${item.color}-600`}>
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-semibold mb-6">
          What You'll Be Able to Do
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {[
            "Submit and discuss ideas with the community",
            "Run and track your own experiments",
            "Document what happened and what you learned",
            "Discover insights from others' experiences"
          ].map((text) => (
            <div
              key={text}
              className="flex items-start gap-3 bg-white rounded-lg p-4 border"
            >
              <span className="text-emerald-500 mt-1">✔</span>
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          🚧 These features are being built collaboratively during Open Source Quest (OSQ). Join the fun!
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-500 flex justify-between">
          <span>EchoRoom</span>
          <span>Open Source Quest</span>
        </div>
      </footer>

    </main>
  );
}