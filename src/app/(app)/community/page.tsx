
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { createCommunityPost } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { CommunityPost } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Loader2 } from 'lucide-react';

const initialPosts: CommunityPost[] = [
  {
    id: '1',
    author: { name: 'NewMom23', avatarUrl: 'https://placehold.co/40x40.png' },
    timestamp: '2 hours ago',
    content: "Sleep regression is hitting us hard this month! Any tips for a 4-month-old who suddenly hates naps?",
    likes: 12,
    comments: 5,
  },
  {
    id: '2',
    author: { name: 'DadOfTwo', avatarUrl: 'https://placehold.co/40x40.png' },
    timestamp: '5 hours ago',
    content: "Just introduced solids for the first time. Avocado was a huge hit! Messy, but a hit. What were your baby's first foods?",
    likes: 25,
    comments: 10,
  },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Post
    </Button>
  );
}

function PostCard({ post }: { post: CommunityPost }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Avatar>
          <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="parent baby" />
          <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">{post.timestamp}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{post.content}</p>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Heart className="h-4 w-4" /> {post.likes}
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" /> {post.comments}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function CommunityPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, dispatch] = useFormState(createCommunityPost, { error: undefined, post: undefined });

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Could not create post",
        description: state.error,
      });
    }
    if (state.post) {
      setPosts(prevPosts => [state.post!, ...prevPosts]);
      toast({
        title: "Success",
        description: "Your post has been added to the community feed.",
      });
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Community Forum</h1>
        <p className="text-muted-foreground">
          Share your experiences and connect with a community of parents.
        </p>
      </div>

      <Card>
        <form ref={formRef} action={dispatch}>
          <CardContent className="pt-6">
            <Textarea
              name="content"
              placeholder="What's on your mind?"
              rows={3}
              aria-label="New community post"
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <div className="space-y-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
