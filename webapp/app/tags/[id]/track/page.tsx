'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useTagsStore } from '@/store/tags-store';
import { useMQTTStore } from '@/store/mqtt-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { subscribeToDistance, emitSound } from '@/lib/mqtt-client';
import { updatesAPI } from '@/lib/api';
import styles from './track.module.css';

export default function TrackTagPage() {
  const router = useRouter();
  const params = useParams();
  const tagId = parseInt(params.id as string);
  
  const { isAuthenticated, userId, token } = useAuthStore();
  const { tags } = useTagsStore();
  const { addDistanceUpdate, getUpdates, clearUpdates } = useMQTTStore();
  
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);
  const [tag, setTag] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const foundTag = tags.find(t => t.id === tagId);
    if (foundTag) {
      setTag(foundTag);
    }
  }, [isAuthenticated, tagId, tags, router]);

  // Subscribe to MQTT distance updates
  useEffect(() => {
    if (!tag?.mac_address) return;

    const unsubscribe = subscribeToDistance(tag.mac_address, (distance) => {
      console.log('[v0] Received distance:', distance);
      setCurrentDistance(distance);
      addDistanceUpdate(tagId, distance);
    });

    return () => {
      unsubscribe();
    };
  }, [tag, tagId, addDistanceUpdate]);

  // Send updates to backend when leaving page
  useEffect(() => {
    return () => {
      if (userId && token) {
        const updates = getUpdates(tagId);
        if (updates.length > 0) {
          updatesAPI.postDistanceUpdates(userId, tagId, updates, token)
            .then(() => {
              console.log('[v0] Posted', updates.length, 'updates to backend');
              clearUpdates(tagId);
            })
            .catch(err => console.error('[v0] Failed to post updates:', err));
        }
      }
    };
  }, [userId, token, tagId, getUpdates, clearUpdates]);

  const handleEmitSound = () => {
    if (tag?.mac_address) {
      emitSound(tag.mac_address);
    }
  };

  const getDistanceColor = (distance: number | null): 'green' | 'yellow' | 'red' => {
    if (distance === null) return 'red';
    if (distance < 2) return 'green';
    if (distance < 5) return 'yellow';
    return 'red';
  };

  if (!isAuthenticated || !tag) {
    return null;
  }

  const distanceColor = getDistanceColor(currentDistance);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <h1 className={styles.logo}>BlueTag</h1>
          <div style={{ width: '72px' }} />
        </div>
      </header>

      <main className={styles.main}>
        <Card className={styles.trackCard}>
          <CardContent className={styles.cardContent}>
            <h2 className={styles.tagTitle}>{tag.alias || 'Unnamed Tag'}</h2>
            
            <div className={styles.iconContainer}>
              <div className={`${styles.pulsatingCircle} ${styles[distanceColor]}`}>
                <div className={styles.iconWrapper}>
                  <span className={styles.tagIcon}>{tag.icon || '📍'}</span>
                </div>
              </div>
            </div>

            <div className={styles.distanceDisplay}>
              {currentDistance !== null ? (
                <>
                  <span className={styles.distanceValue}>{currentDistance.toFixed(2)}</span>
                  <span className={styles.distanceUnit}>meters</span>
                </>
              ) : (
                <span className={styles.distanceWaiting}>Waiting for signal...</span>
              )}
            </div>

            <div className={styles.statusIndicator}>
              <div className={`${styles.statusDot} ${styles[distanceColor]}`} />
              <span className={styles.statusText}>
                {distanceColor === 'green' && 'Very Close'}
                {distanceColor === 'yellow' && 'Nearby'}
                {distanceColor === 'red' && 'Far Away'}
              </span>
            </div>

            <Button 
              onClick={handleEmitSound}
              className={styles.emitButton}
              size="lg"
            >
              Emit Sound
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
