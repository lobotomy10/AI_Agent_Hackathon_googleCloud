'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Camera, Stethoscope, Loader2, Heart, Activity, ClipboardCheck, Lightbulb, ToyBrick, BookText } from 'lucide-react';
import { analyzeBabyStateAction, saveAnalysisResultAction } from '@/lib/actions';
import type { AnalyzeBabyStateOutput } from '@/ai/flows/analyze-baby-state';

export default function AgentPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeBabyStateOutput | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
      setAnalysisResult(null);
      setCapturedImage(null);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this app.',
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };
  
  const handleToggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleAnalyze = async () => {
    if (!isCameraOn || !videoRef.current || !canvasRef.current) {
      toast({
        variant: 'destructive',
        title: 'Camera is off',
        description: 'Please start the camera before analyzing.',
      });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const apiKey = localStorage.getItem('gemini_api_key');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUri);
      
      const result = await analyzeBabyStateAction({ photoDataUri: dataUri, apiKey: apiKey ?? undefined });
      
      setIsAnalyzing(false); // Stop loading indicator after analysis is complete

      if (result.error) {
          toast({ variant: 'destructive', title: 'Analysis Failed', description: result.error });
      } else if (result.data) {
          setAnalysisResult(result.data);

          // Save result to Firebase in the background
          saveAnalysisResultAction({ photoDataUri: dataUri, analysisResult: result.data })
            .then(saveResult => {
              if (!saveResult.success) {
                toast({
                  variant: 'destructive',
                  title: 'Failed to Save History',
                  description: saveResult.error,
                });
              }
            });
      }
    } else {
      setIsAnalyzing(false);
    }
  };

  // Stop camera on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Cocoro.Agent</h1>
        <p className="text-xl text-primary">AI育児支援エージェント</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/40">
            {capturedImage ? (
              <Image src={capturedImage} alt="Analyzed baby photo" fill className="object-cover rounded-lg" />
            ) : (
              <>
                <video ref={videoRef} className="h-full w-full object-cover data-[hidden=true]:hidden" data-hidden={!isCameraOn} autoPlay muted playsInline />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground data-[hidden=true]:hidden" data-hidden={isCameraOn}>
                  <Camera className="h-16 w-16" />
                  <p className="mt-4">カメラを開始してください</p>
                </div>
              </>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-4">
          <Button onClick={handleToggleCamera} variant={isCameraOn ? "secondary" : "default"} size="lg">
            <Camera className="mr-2 h-5 w-5" />
            {isCameraOn ? 'カメラを停止' : 'カメラを開始'}
          </Button>
          <Button onClick={handleAnalyze} disabled={!isCameraOn || isAnalyzing} variant="secondary" size="lg">
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Stethoscope className="mr-2 h-5 w-5" />
            )}
            赤ちゃんの状態を分析
          </Button>
        </CardFooter>
      </Card>
      
      {analysisResult && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="text-primary" />
              分析結果
            </CardTitle>
            <CardDescription>AI育児支援エージェント「こころ」からのメッセージです。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-base">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
