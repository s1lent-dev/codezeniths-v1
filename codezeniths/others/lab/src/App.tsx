import { useState, useEffect } from 'react';
import { TopBar, type ViewMode } from './components/shell/TopBar.tsx';
import { LeftNav, SCENES } from './components/shell/LeftNav.tsx';
import { SplitPane } from './components/shell/SplitPane.tsx';

// All 12 Scenes
import { Scene01_TokenExplorer } from './scenes/Scene01_TokenExplorer.tsx';
import { Scene02_LayerStack } from './scenes/Scene02_LayerStack.tsx';
import { Scene03_TextOnLayers } from './scenes/Scene03_TextOnLayers.tsx';
import { Scene04_BrandAndButtons } from './scenes/Scene04_BrandAndButtons.tsx';
import { Scene05_StatusAndAccents } from './scenes/Scene05_StatusAndAccents.tsx';
import { Scene06_Controls } from './scenes/Scene06_Controls.tsx';
import { Scene07_NavigationAndLists } from './scenes/Scene07_NavigationAndLists.tsx';
import { Scene08_Overlays } from './scenes/Scene08_Overlays.tsx';
import { Scene09_GlassAndGlow } from './scenes/Scene09_GlassAndGlow.tsx';
import { Scene10_DataViz } from './scenes/Scene10_DataViz.tsx';
import { Scene11_RealCompositions } from './scenes/Scene11_RealCompositions.tsx';
import { Scene12_AccessibilityLab } from './scenes/Scene12_AccessibilityLab.tsx';

export default function App() {
  const [activeSceneId, setActiveSceneId] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [reducedTransparency, setReducedTransparency] = useState<boolean>(false);
  const [noBackdropFilter, setNoBackdropFilter] = useState<boolean>(false);

  // Sync global class on <html> for single mode
  useEffect(() => {
    const root = document.documentElement;
    if (viewMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [viewMode]);

  const activeSceneMeta = SCENES.find((s) => s.id === activeSceneId) || SCENES[0];

  const renderActiveScene = () => {
    switch (activeSceneId) {
      case 1: return <Scene01_TokenExplorer />;
      case 2: return <Scene02_LayerStack />;
      case 3: return <Scene03_TextOnLayers />;
      case 4: return <Scene04_BrandAndButtons />;
      case 5: return <Scene05_StatusAndAccents />;
      case 6: return <Scene06_Controls />;
      case 7: return <Scene07_NavigationAndLists />;
      case 8: return <Scene08_Overlays />;
      case 9: return <Scene09_GlassAndGlow />;
      case 10: return <Scene10_DataViz />;
      case 11: return <Scene11_RealCompositions />;
      case 12: return <Scene12_AccessibilityLab />;
      default: return <Scene01_TokenExplorer />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-ink-base flex flex-col font-sans selection:bg-primary-tint selection:text-primary-ink">
      {/* Top Shell Bar */}
      <TopBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        reducedTransparency={reducedTransparency}
        onToggleReducedTransparency={() => setReducedTransparency(!reducedTransparency)}
        noBackdropFilter={noBackdropFilter}
        onToggleNoBackdropFilter={() => setNoBackdropFilter(!noBackdropFilter)}
        activeSceneTitle={activeSceneMeta.title}
      />

      <div className="flex-1 flex min-w-0">
        {/* Left Navigation */}
        <LeftNav
          activeSceneId={activeSceneId}
          onSelectScene={setActiveSceneId}
        />

        {/* Main Viewport Container */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <SplitPane
            viewMode={viewMode}
            reducedTransparency={reducedTransparency}
            noBackdropFilter={noBackdropFilter}
          >
            {renderActiveScene()}
          </SplitPane>
        </main>
      </div>
    </div>
  );
}
