import React from 'react';
import { useParams } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';

const UserChat = () => {
  const { quoteId } = useParams();

  if (!quoteId) {
    return <div>No quote ID provided</div>;
  }

  return <ChatInterface quoteId={quoteId} />;
};

export default UserChat;