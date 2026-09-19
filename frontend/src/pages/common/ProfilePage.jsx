import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ProfilePage() {
  const { currentUser, role } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
        role: role || ''
      });
    }
  }, [currentUser, role]);

  const hasChanges = 
    currentUser && (
      formData.first_name !== (currentUser.first_name || '') ||
      formData.last_name !== (currentUser.last_name || '') ||
      formData.email !== (currentUser.email || '') ||
      formData.role !== (role || '')
    );

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage('');
    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-navy">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {saveMessage && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{saveMessage}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="First Name" 
              value={formData.first_name} 
              onChange={e => setFormData({...formData, first_name: e.target.value})} 
            />
            <Input 
              label="Last Name" 
              value={formData.last_name} 
              onChange={e => setFormData({...formData, last_name: e.target.value})} 
            />
          </div>
          <Input 
            label="Email Address" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
          <Input 
            label="Role" 
            value={formData.role} 
            onChange={e => setFormData({...formData, role: e.target.value})} 
          />
          
          {hasChanges && (
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
