import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, MessageCircle, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BuyerActionCards = () => {
  const navigate = useNavigate();
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow shadow-neu-sm">
        <CardHeader>
          <Rocket className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>Start New Quote</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => navigate("/quotes/new")}>
            Get Started
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow shadow-neu-sm">
        <CardHeader>
          <MessageCircle className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>Chat with Us</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => navigate("/chat")}>
            Start Chat
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow shadow-neu-sm">
        <CardHeader>
          <HelpCircle className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => navigate("/support")}>
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
