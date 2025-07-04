
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SettingsPage() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey) {
        toast({
            variant: 'destructive',
            title: 'API Key is empty',
            description: 'Please enter a valid Gemini API key.',
        });
        return;
    }
    localStorage.setItem('gemini_api_key', apiKey);
    toast({
      title: 'API Key Saved',
      description: 'Your Gemini API key has been saved in your browser.',
    });
  };

  const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
       <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and notification preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Set your Gemini API Key. This is stored securely in your browser&apos;s local storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <Input 
              id="api-key" 
              type="password"
              placeholder="Enter your API key" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveApiKey}>Save API Key</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
          <CardDescription>
            Check if your environment settings for Firebase and Gemini are configured correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {apiKey ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span>Gemini API Key</span>
            </div>
            {apiKey ? (
              <span className="font-medium text-green-600">Configured</span>
            ) : (
              <span className="font-medium text-destructive">Not Configured</span>
            )}
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                {isFirebaseConfigured ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <span>Firebase Configuration</span>
              </div>
              {isFirebaseConfigured ? (
                <span className="font-medium text-green-600">Configured</span>
              ) : (
                <span className="font-medium text-destructive">Not Configured</span>
              )}
            </div>
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="pt-2 text-xs text-muted-foreground hover:no-underline">
                  How to find your Firebase keys
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm prose-p:text-muted-foreground text-foreground/90 max-w-none space-y-2 pt-2 text-xs">
                    <p>
                      You can find all required keys at once in your Firebase project settings. These keys should be placed in the <code>.env</code> file in your project&apos;s root directory.
                    </p>
                    <ol className="list-decimal list-inside space-y-2 pl-2">
                      <li>
                        Go to the{' '}
                        <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                          Firebase Console
                        </a>{' '}
                        and select your project.
                      </li>
                      <li>
                        Click the <strong>gear icon (⚙️)</strong> in the top-left sidebar and select{' '}
                        <strong>Project settings</strong>.
                      </li>
                      <li>
                        Under the <strong>General</strong> tab, scroll down to the <strong>Your apps</strong> card.
                      </li>
                      <li>
                        Click on your web app. If you don&apos;t have one, create one by clicking &apos;Add app&apos; and selecting the web platform (the {'</>'} icon).
                      </li>
                      <li>
                        In the <strong>Firebase SDK snippet</strong> section, select the <strong>Config</strong> option.
                      </li>
                      <li>
                        You will see a block of code. Copy the corresponding values into your project&apos;s{' '}
                        <code>.env</code> file.
                      </li>
                    </ol>
                    <div className="rounded-md bg-muted p-4 font-mono text-xs">
                      <p>const firebaseConfig = &#123;</p>
                      <p className="pl-4">apiKey: "..." <span className="text-muted-foreground">// -&gt; NEXT_PUBLIC_FIREBASE_API_KEY</span></p>
                      <p className="pl-4">authDomain: "..." <span className="text-muted-foreground">// -&gt; NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</span></p>
                      <p className="pl-4">projectId: "..." <span className="text-muted-foreground">// -&gt; NEXT_PUBLIC_FIREBASE_PROJECT_ID</span></p>
                      <p className="pl-4">storageBucket: "..." <span className="text-muted-foreground">// -&gt; NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</span></p>
                      <p className="pl-4">messagingSenderId: "..." <span className="text-muted-foreground">// -&gt; NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</span></p>
                      <p className="pl-4">appId: "..." <span className="text-muted-foreground">// -&gt; NEXT_PUBLIC_FIREBASE_APP_ID</span></p>
                      <p>&#125;;</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose how you want to be notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
              <span>Push Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive real-time alerts on your device.
              </span>
            </Label>
            <Switch id="push-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="email-summary" className="flex flex-col space-y-1">
              <span>Email Summaries</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get a weekly summary of insights and activities.
              </span>
            </Label>
            <Switch id="email-summary" />
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account details and data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Log out from all devices</p>
            <Button variant="outline">Log Out</Button>
          </div>
          <Separator />
           <div className="flex items-center justify-between">
            <p className="text-sm text-destructive">Delete Account</p>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
