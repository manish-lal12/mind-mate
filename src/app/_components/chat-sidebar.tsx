"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "~/app/_components/ui/card";
import { Button } from "~/app/_components/ui/button";
import { MoodChart } from "~/app/_components/mood-chart";
import { Heart, Lightbulb, TrendingUp, ArrowRight } from "lucide-react";

export function ChatSidebar() {
  const copingActivities = [
    { icon: "🧘", name: "Meditation", duration: "10 min" },
    { icon: "🚶", name: "Take a Walk", duration: "15 min" },
    { icon: "📝", name: "Journaling", duration: "20 min" },
    { icon: "🎵", name: "Listen to Music", duration: "30 min" },
  ];

  return (
    <div className="border-border bg-muted/30 hidden w-80 flex-col overflow-y-auto border-l lg:flex">
      <div className="space-y-6 p-6">
        {/* Mood Tracking */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
            <TrendingUp className="text-primary h-5 w-5" />
            Your Mood Trend
          </h3>
          <MoodChart />
        </motion.div>

        {/* Coping Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
            <Lightbulb className="text-accent h-5 w-5" />
            Recommended Activities
          </h3>
          <div className="space-y-2">
            {copingActivities.map((activity, idx) => (
              <Card
                key={idx}
                className="bg-card/50 border-border/50 hover:border-primary/30 cursor-pointer p-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{activity.icon}</span>
                    <div>
                      <p className="text-foreground text-sm font-medium">
                        {activity.name}
                      </p>
                      <p className="text-foreground/60 text-xs">
                        {activity.duration}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Professional Support CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="from-primary/10 to-accent/10 border-primary/20 bg-linear-to-br p-4">
            <div className="mb-3 flex items-start gap-3">
              <Heart className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-foreground text-sm font-medium">
                  Want to talk to a professional?
                </p>
                <p className="text-foreground/70 mt-1 text-xs">
                  Connect with a licensed therapist for personalized support.
                </p>
              </div>
            </div>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full text-sm"
            >
              <Link
                href="/therapists"
                className="flex items-center justify-center gap-2"
              >
                Find a Therapist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-foreground mb-3 font-semibold">Quick Tips</h3>
          <ul className="text-foreground/70 space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Practice deep breathing when feeling overwhelmed</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent">•</span>
              <span>Keep a consistent sleep schedule</span>
            </li>
            <li className="flex gap-2">
              <span className="text-secondary">•</span>
              <span>Connect with friends and family regularly</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
