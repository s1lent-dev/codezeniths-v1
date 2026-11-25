import { useState } from 'react';
import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import {
  Compass,
  Server,
  Database,
  Terminal,
  Settings,
  MoreVertical,
} from 'lucide-react';

export function Scene07_NavigationAndLists() {
  const [selectedNav, setSelectedNav] = useState('clusters');
  const [selectedRow, setSelectedRow] = useState<number | null>(2);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Compass, count: '' },
    { id: 'clusters', label: 'Clusters', icon: Server, count: '12' },
    { id: 'databases', label: 'Databases', icon: Database, count: '4' },
    { id: 'terminals', label: 'Terminals', icon: Terminal, count: '1' },
    { id: 'settings', label: 'Settings', icon: Settings, count: '' },
  ];

  const tableData = [
    { id: 1, name: 'judge-worker-us-01', region: 'us-east-1', status: 'Healthy', ping: '12ms', cpu: '24%' },
    { id: 2, name: 'judge-worker-us-02', region: 'us-east-2', status: 'Healthy', ping: '18ms', cpu: '38%' },
    { id: 3, name: 'judge-worker-eu-01', region: 'eu-west-1', status: 'High Load', ping: '84ms', cpu: '88%' },
    { id: 4, name: 'judge-worker-ap-01', region: 'ap-south-1', status: 'Healthy', ping: '112ms', cpu: '19%' },
    { id: 5, name: 'judge-worker-sa-01', region: 'sa-east-1', status: 'Maintenance', ping: '145ms', cpu: '0%' },
  ];

  return (
    <section className="space-y-10">
      <SceneHeader
        number={7}
        title="Navigation & Lists"
        purpose="Application shell navigation showing background-hover/selected/active states, zebra-striped tables with hover and selected row styles, and divided lists."
        tokens={[
          'bg-background-shell',
          'bg-background-hover',
          'bg-background-selected',
          'bg-background-active',
          'bg-surface-stripe',
          'bg-surface-hover',
          'bg-surface-selected',
          'divide-line-subtle',
        ]}
      />

      {/* Part 1: Shell Navigation Bar & Sidebar */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
            1. Shell Navigation (background-hover / selected / active)
          </h3>
          <span className="text-xs font-mono text-ink-muted">
            Strict Rule: shell navigation uses background-* tokens
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mock Sidebar Chrome */}
          <div className="rounded-xl bg-background-shell border border-line p-4 space-y-1">
            <span className="text-[10px] font-mono text-ink-muted uppercase px-2 mb-2 block font-semibold">
              Sidebar [bg-background-shell]
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSel = selectedNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                    isSel
                      ? 'bg-background-selected text-ink-heading font-semibold shadow-sm'
                      : 'text-ink-base hover:bg-background-hover active:bg-background-active'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSel ? 'text-primary-ink' : 'text-ink-muted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-chip text-ink-muted">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive State Explanation */}
          <div className="md:col-span-2 p-5 rounded-xl bg-surface-well border border-line-subtle space-y-3 flex flex-col justify-center">
            <h4 className="text-xs font-bold font-mono text-ink-heading uppercase">
              Optical Separation on Chrome
            </h4>
            <p className="text-xs text-ink-body leading-relaxed">
              When an item is rendered directly on the application shell (<code className="font-mono text-primary-ink">bg-background-shell</code>), standard <code className="font-mono text-primary-ink">surface-hover</code> must not be used because its luminance is calibrated for cards. Instead, the shell tokens provide harmonious contrast:
            </p>
            <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-ink-muted pt-2 border-t border-line-subtle">
              <div className="p-2 rounded bg-background-hover text-ink-heading">
                Hover: <span className="font-semibold">bg-background-hover</span>
              </div>
              <div className="p-2 rounded bg-background-selected text-ink-heading">
                Selected: <span className="font-semibold">bg-background-selected</span>
              </div>
              <div className="p-2 rounded bg-background-active text-ink-heading">
                Active: <span className="font-semibold">bg-background-active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Data Table with Zebra Stripes & Selection */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
            2. Data Table with Zebra Alternation & Selection
          </h3>
          <span className="text-xs text-ink-muted">Click row to select</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-line-subtle">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-well text-ink-muted font-mono uppercase text-[10px] border-b border-line-subtle">
              <tr>
                <th className="px-4 py-3">Node Name</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ping</th>
                <th className="px-4 py-3 text-right">CPU</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle text-ink-base">
              {tableData.map((row) => {
                const isSelected = selectedRow === row.id;
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedRow(row.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-surface-selected'
                        : 'even:bg-surface-stripe hover:bg-surface-hover'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono font-medium text-ink-heading">
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{row.region}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${
                          row.status === 'Healthy'
                            ? 'bg-success-tint text-success-ink border-success-line'
                            : row.status === 'High Load'
                            ? 'bg-warning-tint text-warning-ink border-warning-line'
                            : 'bg-surface-chip text-ink-muted border-line-subtle'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-right text-ink-muted">{row.ping}</td>
                    <td className="px-4 py-3 font-mono text-right text-ink-heading">{row.cpu}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded hover:bg-surface-hover text-ink-muted hover:text-ink-heading"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
