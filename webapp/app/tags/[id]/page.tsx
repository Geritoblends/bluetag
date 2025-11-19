'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Tag, Update, tagsAPI, updatesAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import styles from './tag-detail.module.css';

export default function TagDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tagId = Number(params.id);
  
  const { isAuthenticated, userId, token } = useAuthStore();
  const [tag, setTag] = useState<Tag | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      if (!userId || !token) return;
      
      try {
        const [tagData, updatesData] = await Promise.all([
          tagsAPI.getMyTag(userId, tagId, token),
          updatesAPI.getMyTagUpdates(userId, tagId, token),
        ]);
        setTag(tagData);
        setUpdates(updatesData);
      } catch (error) {
        console.error('Failed to fetch tag details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, userId, token, tagId, router]);

  if (!isAuthenticated || loading) {
    return null;
  }

  if (!tag) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Tag not found</h2>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>BlueTag</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.titleSection}>
          <div>
            <h2 className={styles.pageTitle}>
              {tag.icon && <span style={{ marginRight: '12px' }}>{tag.icon}</span>}
              {tag.alias || 'Unnamed Tag'}
            </h2>
            <p className={styles.pageDescription}>{tag.mac_address || 'No MAC address'}</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <Card>
            <CardHeader>
              <CardDescription>Last Distance</CardDescription>
              <CardTitle className={styles.statNumber}>
                {tag.last_distance ? `${tag.last_distance}m` : 'N/A'}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Last Seen</CardDescription>
              <CardTitle className={styles.statNumber}>
                {tag.last_date ? new Date(tag.last_date).toLocaleDateString() : 'Never'}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Updates</CardDescription>
              <CardTitle className={styles.statNumber}>{updates.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Update History</CardTitle>
            <CardDescription>Recent location updates for this tag</CardDescription>
          </CardHeader>
          <CardContent>
            {updates.length === 0 ? (
              <p className={styles.emptyText}>No updates yet</p>
            ) : (
              <div className={styles.updatesList}>
                {updates.map((update) => (
                  <div key={update.id} className={styles.updateItem}>
                    <div className={styles.updateInfo}>
                      <p className={styles.updateDistance}>{update.distance}m</p>
                      <p className={styles.updateTime}>
                        {new Date(update.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
