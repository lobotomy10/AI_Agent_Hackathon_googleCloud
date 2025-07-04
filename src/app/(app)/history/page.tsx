'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import type { AnalysisRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { Heart, Activity, ClipboardCheck, Lightbulb, ToyBrick, History as HistoryIcon, FileWarning, BookText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function AnalysisRecordCard({ record }: { record: AnalysisRecord }) {
  const analysisResult = record.analysis;
  
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="relative aspect-square w-full">
            <Image 
              src={record.imageUrl} 
              alt={`Analysis from ${format(record.createdAt.toDate(), 'PPP p')}`} 
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <CardHeader>
            <CardTitle>Analysis from {format(record.createdAt.toDate(), 'PPP p')}</CardTitle>
            <CardDescription>A summary of the baby's state at this time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>View Full Analysis</AccordionTrigger>
                <AccordionContent className="space-y-6 text-base pt-4">
                  <div className="flex items-start gap-4">
                      <div className="rounded-full bg-accent/50 p-2 text-primary">
                          <Heart className="h-6 w-6" />
                      </div>
                      <div>
                          <h4 className="font-semibold text-primary">赤ちゃんの今の気持ち</h4>
                          <p className="text-foreground/80">{analysisResult.mood}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-4">
                      <div className="rounded-full bg-accent/50 p-2 text-primary">
                          <Activity className="h-6 w-6" />
                      </div>
                      <div>
                          <h4 className="font-semibold text-primary">赤ちゃんの様子</h4>
                          <p className="text-foreground/80">{analysisResult.activity} ({analysisResult.isAsleep ? 'すやすや眠っています' : '起きています'})</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-4">
                      <div className="rounded-full bg-accent/50 p-2 text-primary">
                          <ClipboardCheck className="h-6 w-6" />
                      </div>
                      <div>
                          <h4 className="font-semibold text-primary">こころからのアドバイス</h4>
                          <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/80">
                              {analysisResult.needs.map((need, index) => <li key={index}>{need}</li>)}
                          </ul>
                      </div>
                  </div>
                  {analysisResult.parentingMethods && analysisResult.parentingMethods.length > 0 && (
                      <div className="flex items-start gap-4">
                          <div className="rounded-full bg-accent/50 p-2 text-primary">
                              <Lightbulb className="h-6 w-6" />
                          </div>
                          <div>
                              <h4 className="font-semibold text-primary">育児のヒント</h4>
                              <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/80">
                                  {analysisResult.parentingMethods.map((method, index) => <li key={index}>{method}</li>)}
                              </ul>
                          </div>
                      </div>
                  )}
                  {analysisResult.helpfulItems && analysisResult.helpfulItems.length > 0 && (
                      <div className="flex items-start gap-4">
                          <div className="rounded-full bg-accent/50 p-2 text-primary">
                              <ToyBrick className="h-6 w-6" />
                          </div>
                          <div>
                              <h4 className="font-semibold text-primary">おすすめグッズ</h4>
                              <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/80">
                                  {analysisResult.helpfulItems.map((item, index) => <li key={index}>{item}</li>)}
                              </ul>
                          </div>
                      </div>
                    )}
                  {analysisResult.suggestedResources && analysisResult.suggestedResources.length > 0 && (
                      <div className="flex items-start gap-4">
                          <div className="rounded-full bg-accent/50 p-2 text-primary">
                              <BookText className="h-6 w-6" />
                          </div>
                          <div>
                              <h4 className="font-semibold text-primary">おすすめの参考情報</h4>
                              <ul className="mt-2 space-y-2 text-foreground/80">
                                  {analysisResult.suggestedResources.map((resource, index) => (
                                    <li key={index}>
                                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline hover:text-primary">
                                        <span>{resource.title}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-70"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>
                                      </a>
                                    </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                    )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

export default function HistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecords() {
      try {
        if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
          setError("Firebase is not configured. Please add your Firebase project details to the .env file.");
          setLoading(false);
          return;
        }

        const q = query(collection(db, 'analyses'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedRecords = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as AnalysisRecord));
        setRecords(fetchedRecords);
      } catch (err) {
        console.error("Error fetching analysis records:", err);
        setError("Failed to fetch analysis history. Please ensure your Firebase configuration is correct and you have enabled Firestore.");
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
          <HistoryIcon className="w-8 h-8"/> Analysis History
        </h1>
        <p className="text-muted-foreground">
          Review past analyses to track your baby's patterns and progress over time.
        </p>
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <FileWarning className="h-4 w-4" />
          <AlertTitle>Error Loading History</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && records.length === 0 && (
         <Alert>
          <HistoryIcon className="h-4 w-4" />
          <AlertTitle>No History Found</AlertTitle>
          <AlertDescription>
            You haven't analyzed any photos yet. Go to the Agent page to get your first analysis!
          </AlertDescription>
        </Alert>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="space-y-4">
          {records.map(record => (
            <AnalysisRecordCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}
