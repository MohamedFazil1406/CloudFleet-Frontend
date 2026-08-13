const Settings = () => {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#091624]">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-cyan-400 text-sm font-medium">CONFIGURATION</p>

          <h1 className="text-3xl font-bold mt-1">Settings</h1>

          <p className="text-slate-400 mt-2">
            Manage your CloudFleet dashboard preferences.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* GitHub Projects */}
        <section className="bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800">
            <h2 className="text-lg font-semibold">GitHub Projects</h2>

            <p className="text-sm text-slate-500 mt-1">
              View the CloudFleet frontend and backend source code.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {/* Frontend */}
            <a
              href="https://github.com/MohamedFazil1406/cloudfleet-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-6 py-5 hover:bg-slate-800/40 transition"
            >
              <div>
                <h3 className="text-sm font-medium text-slate-200">
                  CloudFleet Frontend
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  React, TypeScript, Vite and Tailwind CSS
                </p>
              </div>

              <span className="text-cyan-400 text-sm">View GitHub →</span>
            </a>

            {/* Backend */}
            <a
              href="https://github.com/MohamedFazil1406/CloudFleet-Real-Time-Vehicle-Monitoring-Alert-Platform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-6 py-5 hover:bg-slate-800/40 transition"
            >
              <div>
                <h3 className="text-sm font-medium text-slate-200">
                  CloudFleet Backend
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Spring Boot, Spring Security, JWT and MySQL
                </p>
              </div>

              <span className="text-cyan-400 text-sm">View GitHub →</span>
            </a>
          </div>
        </section>

        {/* API Configuration */}
        <section className="mt-6 bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800">
            <h2 className="text-lg font-semibold">API Configuration</h2>

            <p className="text-sm text-slate-500 mt-1">
              Current CloudFleet backend configuration.
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                API URL
              </label>

              <div className="bg-[#07111f] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 font-mono break-all">
                {import.meta.env.VITE_API_URL}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                WebSocket URL
              </label>

              <div className="bg-[#07111f] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 font-mono break-all">
                {import.meta.env.VITE_WS_URL}
              </div>
            </div>
          </div>
        </section>

        {/* Environment */}
        <section className="mt-6 bg-[#0d1b2a] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800">
            <h2 className="text-lg font-semibold">Environment</h2>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">Production</p>

                <p className="text-sm text-slate-500 mt-1">
                  Connected to the production backend.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

interface SettingRowProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const SettingRow = ({
  title,
  description,
  enabled,
  onToggle,
}: SettingRowProps) => {
  return (
    <div className="px-6 py-5 flex items-center justify-between gap-6">
      <div>
        <h3 className="font-medium text-slate-200">{title}</h3>

        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        className={`relative w-12 h-6 rounded-full transition shrink-0 ${
          enabled ? "bg-cyan-500" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
            enabled ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

export default Settings;
