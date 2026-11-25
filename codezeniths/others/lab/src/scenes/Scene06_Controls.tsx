import { useState } from 'react';
import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import { Check, ChevronDown, AlertCircle } from 'lucide-react';

export function Scene06_Controls() {
  const [checkboxState, setCheckboxState] = useState(true);
  const [radioState, setRadioState] = useState('option1');
  const [switchState, setSwitchState] = useState(true);
  const [sliderVal, setSliderVal] = useState(65);
  const [activeTab, setActiveTab] = useState('general');
  const [activeSegment, setActiveSegment] = useState('day');

  return (
    <section className="space-y-10">
      <SceneHeader
        number={6}
        title="Form Controls & Inputs"
        purpose="Verification of all form input states (rest, hover, focus, valid, invalid, disabled), custom checkboxes, radios, switches, range sliders, tabs, and segmented controls."
        tokens={[
          'bg-surface-input',
          'bg-surface-input-hover',
          'bg-surface-disabled',
          'border-line-strong',
          'border-line-hover',
          'border-line-disabled',
          'bg-surface-track',
          'bg-surface-well',
          'outline-focus',
        ]}
      />

      {/* Part 1: Text Inputs across all 6 states */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
          1. Text Inputs State Machine
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rest State */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-heading block">
              Rest State
            </label>
            <input
              type="text"
              defaultValue=""
              placeholder="Enter cluster name..."
              className="w-full px-3 py-2 rounded-lg text-xs bg-surface-input text-ink-base placeholder:text-ink-subtle border border-line-strong hover:border-line-hover focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus transition-colors"
            />
            <span className="text-[11px] text-ink-muted">Default rest appearance</span>
          </div>

          {/* Hover / Focused */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-heading block">
              Active Focus
            </label>
            <input
              type="text"
              defaultValue="production-db-01"
              className="w-full px-3 py-2 rounded-lg text-xs bg-surface-input text-ink-base border-2 border-primary outline-none ring-2 ring-focus transition-colors"
            />
            <span className="text-[11px] text-primary-ink font-mono">ring-focus visible</span>
          </div>

          {/* Invalid / Error State */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-destructive-ink flex items-center justify-between">
              <span>Validation Error</span>
              <AlertCircle className="w-3.5 h-3.5" />
            </label>
            <input
              type="text"
              defaultValue="invalid..cluster@name"
              className="w-full px-3 py-2 rounded-lg text-xs bg-surface-input text-destructive-ink border border-destructive focus:outline-none focus:ring-2 focus:ring-focus transition-colors"
            />
            <span className="text-[11px] text-destructive-ink">Must contain alphanumeric characters only</span>
          </div>

          {/* Validated State */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-success-ink flex items-center justify-between">
              <span>Valid State</span>
              <Check className="w-3.5 h-3.5" />
            </label>
            <input
              type="text"
              defaultValue="verified-cluster-node"
              className="w-full px-3 py-2 rounded-lg text-xs bg-surface-input text-ink-base border border-success focus:outline-none focus:ring-2 focus:ring-focus transition-colors"
            />
            <span className="text-[11px] text-success-ink">Domain name available</span>
          </div>

          {/* Select Dropdown Trigger */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-heading block">
              Select Trigger
            </label>
            <div className="w-full px-3 py-2 rounded-lg text-xs bg-surface-input text-ink-base border border-line-strong hover:border-line-hover flex items-center justify-between cursor-pointer transition-colors">
              <span>us-east-1 (N. Virginia)</span>
              <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
            </div>
            <span className="text-[11px] text-ink-muted">Dropdown control</span>
          </div>

          {/* Disabled Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-disabled block">
              Disabled Control
            </label>
            <input
              disabled
              type="text"
              defaultValue="read-only-immutable"
              className="w-full px-3 py-2 rounded-lg text-xs bg-surface-disabled text-ink-disabled border border-line-disabled cursor-not-allowed select-none"
            />
            <span className="text-[11px] text-ink-disabled">Locked by administrator</span>
          </div>
        </div>
      </div>

      {/* Part 2: Checkboxes, Radios, Switches, Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checkbox & Radio Matrix */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
            2. Checkboxes & Radios
          </h3>

          <div className="space-y-3">
            {/* Checkbox item */}
            <label
              onClick={() => setCheckboxState(!checkboxState)}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                  checkboxState
                    ? 'bg-primary text-primary-on border-primary'
                    : 'bg-surface-input border-line-strong group-hover:border-line-hover'
                }`}
              >
                {checkboxState && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-xs font-medium text-ink-base">
                Enable automatic failover replication
              </span>
            </label>

            {/* Disabled Checkbox */}
            <div className="flex items-center gap-3 opacity-60 cursor-not-allowed">
              <div className="w-4 h-4 rounded bg-surface-disabled border border-line-disabled flex items-center justify-center">
                <Check className="w-3 h-3 text-ink-disabled" />
              </div>
              <span className="text-xs text-ink-disabled">
                Enforce strict TLS 1.3 encryption (required)
              </span>
            </div>

            <div className="pt-3 border-t border-line-subtle space-y-2">
              <span className="text-xs font-semibold text-ink-heading block">
                Radio Group Selection:
              </span>
              <div className="space-y-2">
                {[
                  { id: 'option1', label: 'Rolling deployment (zero downtime)' },
                  { id: 'option2', label: 'Blue-green immediate swap' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setRadioState(opt.id)}
                    className="flex items-center gap-3 cursor-pointer select-none group"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        radioState === opt.id
                          ? 'border-primary'
                          : 'border-line-strong group-hover:border-line-hover bg-surface-input'
                      }`}
                    >
                      {radioState === opt.id && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-xs text-ink-base">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Switch & Range Slider */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
            3. Switches & Range Slider
          </h3>

          <div className="space-y-4">
            {/* Switch Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-ink-heading block">
                  High-Availability Mode
                </span>
                <span className="text-[11px] text-ink-muted">
                  Spans across multi-region availability zones
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSwitchState(!switchState)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-focus ${
                  switchState ? 'bg-primary' : 'bg-surface-track'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-surface shadow-md transition-transform ${
                    switchState ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Range Slider */}
            <div className="space-y-2 pt-2 border-t border-line-subtle">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-ink-heading font-semibold">Concurrency Limit</span>
                <span className="text-primary-ink font-bold">{sliderVal} threads</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                className="w-full accent-primary bg-surface-track h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: Navigation Tabs & Segmented Control */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
          4. Tabs & Segmented Control
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Navigation Tabs */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-ink-muted block">Navigation Tabs</span>
            <div className="flex items-center gap-1 border-b border-line pb-1">
              {[
                { id: 'general', label: 'General' },
                { id: 'security', label: 'Security' },
                { id: 'billing', label: 'Billing' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-surface-selected text-ink-heading font-semibold shadow-sm'
                      : 'text-ink-muted hover:text-ink-heading hover:bg-surface-hover'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-ink-muted">
              Active tab uses <code className="font-mono text-primary-ink">bg-surface-selected</code>.
            </p>
          </div>

          {/* Segmented Control */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-ink-muted block">Segmented Range</span>
            <div className="inline-flex p-1 rounded-xl bg-surface-well border border-line-subtle">
              {[
                { id: 'hour', label: '1H' },
                { id: 'day', label: '24H' },
                { id: 'week', label: '7D' },
                { id: 'month', label: '30D' },
              ].map((seg) => (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setActiveSegment(seg.id)}
                  className={`px-3.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeSegment === seg.id
                      ? 'bg-surface text-ink-heading shadow-float'
                      : 'text-ink-muted hover:text-ink-heading'
                  }`}
                >
                  {seg.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-ink-muted">
              Segmented trough uses <code className="font-mono text-primary-ink">bg-surface-well</code>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
