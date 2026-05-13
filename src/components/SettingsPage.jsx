import { Settings, Bell, Shield, Globe, Moon } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={clsx(
        'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
        on ? 'bg-accent-indigo' : 'bg-white/10'
      )}
    >
      <span
        className={clsx(
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
          on ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [apiMode, setApiMode] = useState(false);

  const SETTINGS_GROUPS = [
    {
      title: 'Appearance',
      icon: Moon,
      items: [
        { label: 'Dark Mode', desc: 'Use dark theme throughout the app', value: darkMode, setter: setDarkMode },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Analysis Alerts', desc: 'Notify when high manipulation is detected', value: notifications, setter: setNotifications },
        { label: 'Auto-save Results', desc: 'Automatically save each analysis', value: autoSave, setter: setAutoSave },
      ],
    },
    {
      title: 'Advanced',
      icon: Globe,
      items: [
        { label: 'Live API Mode', desc: 'Connect to real AI backend (coming soon)', value: apiMode, setter: setApiMode },
      ],
    },
  ];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-accent-indigo-light" />
        <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
      </div>

      <div className="space-y-5">
        {SETTINGS_GROUPS.map(({ title, icon: Icon, items }) => (
          <div key={title} className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="w-4 h-4 text-accent-indigo-light" />
              <h3 className="font-semibold text-text-primary">{title}</h3>
            </div>
            <div className="space-y-4">
              {items.map(({ label, desc, value, setter }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{desc}</p>
                  </div>
                  <Toggle on={value} onChange={setter} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger zone */}
        <div className="card p-5 border border-risk-red/15">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-risk-red" />
            <h3 className="font-semibold text-text-primary">Data & Privacy</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Clear All History</p>
              <p className="text-xs text-text-muted mt-0.5">Permanently delete all analysis records</p>
            </div>
            <button className="text-xs font-semibold px-4 py-2 rounded-lg border border-risk-red/30 text-risk-red hover:bg-risk-red/10 transition-colors">
              Clear Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
