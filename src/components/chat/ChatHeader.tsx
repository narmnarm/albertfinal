import React from 'react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAlbertScore } from '@/context/AlbertScoreContext';

interface ChatHeaderProps {
  title: string;
  subtitle: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, subtitle }) => {
  const { score } = useAlbertScore();

  const getAlbertImage = () => {
    if (score >= 80) return "/images/best.png";
    if (score >= 40) return "/images/middle.png";
    return "/images/worst.png";
  };

  const getAlbertMood = () => {
    if (score >= 80) return "happy";
    if (score >= 40) return "alright";
    return "sad";
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-4">
          <AvatarImage src={getAlbertImage()} alt="Albert" />
        </Avatar>
        <div>
          <h3 className="font-medium leading-none mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">Albert Score: {score}</p>
        <p className="text-sm text-muted-foreground">Albert is {getAlbertMood()}</p>
      </div>
    </div>
  );
};

export default ChatHeader;
