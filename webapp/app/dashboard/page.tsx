'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useTagsStore } from '@/store/tags-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import { emitSound, scanAvailableTags } from '@/lib/mqtt-client';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, userId, token, logout } = useAuthStore();
  const { tags, loading, fetchTags, addTag, deleteTag } = useTagsStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<string[]>([]);
  const [selectedMac, setSelectedMac] = useState('');
  const [scanning, setScanning] = useState(false);
  const [newTag, setNewTag] = useState({
    alias: '',
    icon: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (userId && token) {
      fetchTags(userId, token);
    }
  }, [isAuthenticated, userId, token, router, fetchTags]);

  useEffect(() => {
    if (isDialogOpen && scanning) {
      setAvailableDevices([]);
      const unsubscribe = scanAvailableTags((macAddress) => {
        setAvailableDevices((prev) => {
          if (!prev.includes(macAddress)) {
            return [...prev, macAddress];
          }
          return prev;
        });
      });

      const timeout = setTimeout(() => {
        setScanning(false);
      }, 5000);

      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    }
  }, [isDialogOpen, scanning]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId && token && selectedMac) {
      await addTag(userId, { 
        ...newTag, 
        mac_address: selectedMac 
      }, token);
      setNewTag({ alias: '', icon: '' });
      setSelectedMac('');
      setAvailableDevices([]);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    if (userId && token && confirm('Are you sure you want to delete this tag?')) {
      await deleteTag(userId, tagId, token);
    }
  };

  const handleEmitSound = (macAddress: string | null) => {
    if (macAddress) {
      emitSound(macAddress);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>BlueTag</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.titleSection}>
          <div>
            <h2 className={styles.pageTitle}>My Tags</h2>
            <p className={styles.pageDescription}>Manage your Bluetooth tags</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Tag</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tag</DialogTitle>
                <DialogDescription>Scan and select an available device</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTag} className={styles.dialogForm}>
                <div className={styles.field}>
                  <Label>Available Devices</Label>
                  {!scanning && availableDevices.length === 0 && (
                    <Button 
                      type="button" 
                      onClick={() => setScanning(true)}
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      Scan for Devices
                    </Button>
                  )}
                  {scanning && (
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                      Scanning for devices...
                    </p>
                  )}
                  {availableDevices.length > 0 && (
                    <RadioGroup value={selectedMac} onValueChange={setSelectedMac}>
                      {availableDevices.map((mac) => (
                        <div key={mac} className={styles.deviceOption}>
                          <RadioGroupItem value={mac} id={mac} />
                          <Label htmlFor={mac} style={{ cursor: 'pointer', flex: 1 }}>
                            <div>
                              <p style={{ fontWeight: 500 }}>Device: ESP32</p>
                              <p style={{ fontSize: '13px', color: '#6b7280' }}>{mac}</p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  {availableDevices.length > 0 && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setScanning(true)}
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      Rescan
                    </Button>
                  )}
                </div>
                
                {selectedMac && (
                  <>
                    <div className={styles.field}>
                      <Label htmlFor="alias">Alias</Label>
                      <Input
                        id="alias"
                        placeholder="My Tag"
                        value={newTag.alias}
                        onChange={(e) => setNewTag({ ...newTag, alias: e.target.value })}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <Label htmlFor="icon">Icon</Label>
                      <Input
                        id="icon"
                        placeholder="📍"
                        value={newTag.icon}
                        onChange={(e) => setNewTag({ ...newTag, icon: e.target.value })}
                      />
                    </div>
                    <Button type="submit" style={{ width: '100%' }}>Create Tag</Button>
                  </>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading && <p className={styles.loading}>Loading tags...</p>}

        {!loading && tags.length === 0 && (
          <Card className={styles.emptyState}>
            <CardContent style={{ padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>📱</p>
              <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0' }}>No tags yet</h3>
              <p style={{ color: '#6b7280', margin: 0 }}>Create your first Bluetooth tag to get started</p>
            </CardContent>
          </Card>
        )}

        <div className={styles.grid}>
          {tags.map((tag) => (
            <Card key={tag.id} className={styles.tagCard}>
              <CardContent className={styles.cardContent}>
                <div className={styles.tagHeader}>
                  <span className={styles.tagIcon}>{tag.icon || '📍'}</span>
                  <div className={styles.tagInfo}>
                    <h3 className={styles.tagAlias}>{tag.alias || 'Unnamed Tag'}</h3>
                    <p className={styles.tagMac}>{tag.mac_address || 'No MAC'}</p>
                  </div>
                </div>

                <div className={styles.tagStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Battery</span>
                    <span className={styles.statValue}>{tag.battery ? `${tag.battery}%` : 'N/A'}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Last Distance</span>
                    <span className={styles.statValue}>
                      {tag.last_distance !== null ? `${tag.last_distance}m` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className={styles.tagActions}>
                  <Button 
                    variant="outline"
                    onClick={() => handleEmitSound(tag.mac_address)}
                    style={{ flex: 1 }}
                  >
                    Emit Sound
                  </Button>
                  <Link href={`/tags/${tag.id}/track`} style={{ flex: 1 }}>
                    <Button variant="default" style={{ width: '100%' }}>
                      Search
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
