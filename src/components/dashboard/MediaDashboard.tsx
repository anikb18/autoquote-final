import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MediaDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Media Management</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage your vehicle photo gallery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Handle document uploads and management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marketing Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access your marketing materials
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}