import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };


  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-navy dark:text-white transition-colors">Settings</h1>
      <Card className="dark:bg-slate-900 dark:border-slate-800 transition-colors">
        <CardHeader>
          <CardTitle className="dark:text-white">Application Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 transition-colors">
            <div>
              <p className="font-medium text-navy dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Toggle dark mode appearance globally across the app</p>
            </div>
            <Button variant={isDarkMode ? "default" : "outline"} onClick={toggleDarkMode}>
              {isDarkMode ? "Disable" : "Enable"}
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 transition-colors">
            <div>
              <p className="font-medium text-navy dark:text-white">Email Notifications</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Receive updates about curriculum matches</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
