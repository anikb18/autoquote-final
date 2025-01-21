import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const BuyerActionCards = () => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* New Quote Card */}
      <Card>
        <CardHeader>
          <CardTitle>Start New Quote</CardTitle>
          <CardDescription>Get quotes from dealers for your next vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/quotes/new')}>
            Start Quote
          </Button>
        </CardContent>
      </Card>

      {/* Support Card */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Contact our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/support')}>
            Contact Support
          </Button>
        </CardContent>
      </Card>

      {/* Chat Card */}
      <Card>
        <CardHeader>
          <CardTitle>Chat with Us</CardTitle>
          <CardDescription>Get instant help from our AI assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/chat')}>
            Start Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};