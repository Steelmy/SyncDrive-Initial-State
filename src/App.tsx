import React, { useEffect, useState } from 'react';
import SetupWizard from './components/SetupWizard';
import Dashboard from './components/Dashboard';
import { AppConfig, Instance } from './types';

function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Load config and dark mode when component mounts
    loadConfig();
    window.electronAPI.getDarkMode().then((enabled: boolean) => setDarkMode(enabled));

    // Setup listeners for events from main process (with cleanup)
    const removeConfigListener = window.electronAPI.onConfigLoaded((data: AppConfig) => {
      setConfig(data);
      setIsLoading(false);
    });

    const removeSyncListener = window.electronAPI.onSyncCompleted(() => {
      // Reload config to get updated sync history
      loadConfig();
    });

    return () => {
      removeConfigListener();
      removeSyncListener();
    };
  }, []);
  
  const loadConfig = async () => {
    try {
      const configData = await window.electronAPI.getConfig();
      setConfig(configData);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load config:', error);
      setIsLoading(false);
    }
  };
  
  const handleDirectorySelected = async () => {
    await loadConfig();
  };

  const handleSwitchInstance = async (instanceId: string) => {
    try {
      await window.electronAPI.switchInstance(instanceId);
      await loadConfig();
    } catch (error) {
      console.error('Failed to switch instance:', error);
    }
  };

  const handleCreateInstance = async (name: string) => {
    try {
      await window.electronAPI.createInstance(name);
      await loadConfig();
    } catch (error) {
      console.error('Failed to create instance:', error);
    }
  };

  const handleToggleDarkMode = async (enabled: boolean) => {
    setDarkMode(enabled);
    await window.electronAPI.setDarkMode(enabled);
  };

  const handleDeleteInstance = async (instanceId: string) => {
    try {
      await window.electronAPI.deleteInstance(instanceId);
      await loadConfig();
    } catch (error) {
      console.error('Failed to delete instance:', error);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-blue-600 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium dark:text-gray-200">Loading application...</p>
        </div>
      </div>
    );
  }

  // Show setup wizard if no instances exist
  if (!config?.hasCompletedSetup) {
    return <SetupWizard onDirectorySelected={handleDirectorySelected} />;
  }

  // Find current instance
  const currentInstance = config.instances.find(
    instance => instance.id === config.currentInstanceId
  ) || config.instances[0] || null;

  // Show the main dashboard
  return (
    <Dashboard
      instances={config.instances}
      currentInstance={currentInstance}
      onSwitchInstance={handleSwitchInstance}
      onCreateInstance={handleCreateInstance}
      onDeleteInstance={handleDeleteInstance}
      darkMode={darkMode}
      onToggleDarkMode={handleToggleDarkMode}
    />
  );
}

export default App;