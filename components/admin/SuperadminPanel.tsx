'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Shield, Key, Users, Settings } from 'lucide-react';

export function SuperadminPanel() {
  const [masterKey, setMasterKey] = useState('');
  const [superadminKey, setSuperadminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const generateKey = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/superadmin/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ masterKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate key');
      }

      setSuperadminKey(data.key);
      setSuccess('Superadmin key generated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAccess = async () => {
    if (!superadminKey) {
      setError('Please generate a superadmin key first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/superadmin/access', {
        headers: {
          'x-superadmin-key': superadminKey,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Access denied');
      }

      setSuccess(`Access granted! Found ${data.data.length} profiles.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-600" />
          Superadmin Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ Security Warning</h3>
          <p className="text-red-700 text-sm">
            This panel provides unrestricted access to the system. Use only in secure environments.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Master Key</label>
          <Input
            type="password"
            placeholder="Enter master key"
            value={masterKey}
            onChange={(e) => setMasterKey(e.target.value)}
          />
        </div>

        <Button 
          onClick={generateKey} 
          disabled={loading || !masterKey}
          className="w-full"
        >
          <Key className="w-4 h-4 mr-2" />
          {loading ? 'Generating...' : 'Generate Superadmin Key'}
        </Button>

        {superadminKey && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Generated Key</label>
              <div className="bg-gray-100 p-3 rounded border font-mono text-sm break-all">
                {superadminKey}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Valid for 24 hours. Use as header: x-superadmin-key or query param: superadmin_key
              </p>
            </div>

            <Button 
              onClick={testAccess} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <Users className="w-4 h-4 mr-2" />
              Test Access
            </Button>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-sm bg-green-50 p-3 rounded border border-green-200">
            {success}
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Usage Examples:</h4>
          <div className="space-y-2 text-sm font-mono bg-gray-100 p-3 rounded">
            <div>Header: x-superadmin-key: {superadminKey || 'SUPER_ADMIN_...'}</div>
            <div>Query: /api/superadmin/access?superadmin_key={superadminKey || 'SUPER_ADMIN_...'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}