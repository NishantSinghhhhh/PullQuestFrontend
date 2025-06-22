// src/components/OrgSettingsView.tsx
"use client";

import { OrgGeneralSettings } from "./OrgGeneralSettings";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

const apiKeys = [
  {
    id: "1",
    name: "Production API Key",
    key: "cr_prod_••••••••••••••••",
    created: "2024-01-15",
    lastUsed: "2 hours ago",
  },
  {
    id: "2",
    name: "Development API Key",
    key: "cr_dev_••••••••••••••••",
    created: "2024-01-10",
    lastUsed: "1 day ago",
  },
];

export function OrgSettingsView() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-semibold text-gray-900">
            Organization Settings
          </h1>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* now just render our extracted component */}
          <TabsContent value="general">
            <OrgGeneralSettings />
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>API Keys</CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create API Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Key className="w-4 h-4 text-gray-600" />
                        <p className="font-medium text-gray-900">
                          {apiKey.name}
                        </p>
                      </div>
                      <p className="text-sm font-mono text-gray-600 mb-1">
                        {apiKey.key}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Created: {apiKey.created}</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* ...your existing security & danger-zone cards */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
