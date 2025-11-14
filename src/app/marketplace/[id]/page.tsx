/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/app/_components/ui/button";

export default function ExpertDetailPage() {
  const params = useParams();
  const expertId = params.id as string;
  const [showBookingForm, setShowBookingForm] = useState(false);

  const { data: expert, isLoading } = api.expert.getById.useQuery({
    id: expertId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-green-50">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
          </div>
          <p className="text-slate-600">Loading expert profile...</p>
        </div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-green-50">
        <User className="mb-4 h-12 w-12 text-slate-400" />
        <p className="mb-6 text-slate-600">Expert not found</p>
        <Link href="/marketplace">
          <Button variant="outline">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Header with Back Button */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Card */}
            <div className="mb-8 rounded-lg border border-slate-200 bg-white p-8">
              <div className="mb-6 flex items-start gap-6">
                {expert.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={expert.profileImage}
                    alt={expert.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-blue-200">
                    <User className="h-12 w-12 text-blue-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {expert.name}
                  </h1>
                  <p className="text-lg text-slate-600 capitalize">
                    {expert.profession}
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                              i < Math.round(expert.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">
                        {expert.rating.toFixed(1)} ({expert.totalReviews}{" "}
                        reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="mb-6 border-t border-slate-200 pt-6">
                <h2 className="mb-4 text-xl font-semibold text-slate-900">
                  About
                </h2>
                <p className="text-slate-700">{expert.bio}</p>
              </div>

              {/* Details Grid */}
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-slate-600">Experience</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {expert.yearsExperience}+ years
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-slate-600">Education</p>
                  <p className="truncate text-lg font-semibold text-slate-900">
                    {expert.education ?? "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-sm text-slate-600">Hourly Rate</p>
                  <p className="text-xl font-semibold text-slate-900">
                    ${(expert.hourlyRate / 100).toFixed(0)}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-50 p-4">
                  <p className="text-sm text-slate-600">License</p>
                  <p className="truncate text-lg font-semibold text-slate-900">
                    {expert.licenseNumber ?? "Verified"}
                  </p>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-slate-900">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {expert.specialties.map((specialty: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-6 border-t border-slate-200 pt-6">
                <h3 className="mb-4 font-semibold text-slate-900">Contact</h3>
                <div className="space-y-2">
                  <p className="text-slate-700">
                    <span className="font-medium">Email:</span> {expert.email}
                  </p>
                  {expert.phone && (
                    <p className="text-slate-700">
                      <span className="font-medium">Phone:</span> {expert.phone}
                    </p>
                  )}
                  {expert.websiteUrl && (
                    <p className="text-slate-700">
                      <span className="font-medium">Website:</span>{" "}
                      <a
                        href={expert.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {expert.websiteUrl}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="rounded-lg border border-slate-200 bg-white p-8">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Reviews
              </h2>
              {expert.reviews && expert.reviews.length > 0 ? (
                <div className="space-y-6">
                  {expert.reviews.map(
                    (
                      review: {
                        rating: number;
                        user: { name: string };
                        comment?: string;
                        createdAt: string | number | Date;
                      },
                      idx: number,
                    ) => (
                      <div
                        key={idx}
                        className="border-b border-slate-100 pb-6 last:border-b-0"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {review.user.name}
                              </p>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-slate-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="mt-3 text-slate-600">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-center text-slate-600">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Book a Consultation
              </h3>
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">60 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Flexible scheduling</span>
                </div>
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="text-2xl font-bold">
                    ${(expert.hourlyRate / 100).toFixed(0)}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => setShowBookingForm(!showBookingForm)}
                className="mb-4 w-full bg-blue-600 hover:bg-blue-700"
              >
                {showBookingForm ? "Cancel" : "Book Now"}
              </Button>

              {showBookingForm && (
                <BookingForm
                  expertId={expert.id}
                  expertName={expert.name}
                  hourlyRate={expert.hourlyRate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingForm({
  expertId,
  expertName,
  hourlyRate,
}: {
  expertId: string;
  expertName: string;
  hourlyRate: number;
}) {
  const [formData, setFormData] = useState({
    title: "",
    problem: "",
    description: "",
    scheduledDate: "",
    duration: 60,
  });

  const bookMutation = api.expert.bookConsultation.useMutation({
    onSuccess: () => {
      alert(`Consultation booked successfully with ${expertName}!`);
      setFormData({
        title: "",
        problem: "",
        description: "",
        scheduledDate: "",
        duration: 60,
      });
    },
    onError: () => {
      alert("Failed to book consultation");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookMutation.mutate({
      expertId,
      title: formData.title,
      problem: formData.problem,
      description: formData.description,
      scheduledDate: new Date(formData.scheduledDate),
      duration: formData.duration,
    });
  };

  const totalCost = (hourlyRate * formData.duration) / 60;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-900">
          What&rsquo;s your main concern?
        </label>
        <input
          type="text"
          value={formData.problem}
          onChange={(e) =>
            setFormData({ ...formData, problem: e.target.value })
          }
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="e.g., anxiety, depression, career guidance"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900">
          Consultation Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="e.g., Initial consultation"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900">
          Description (optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="Tell us more about your situation..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900">
          Preferred Date & Time
        </label>
        <input
          type="datetime-local"
          value={formData.scheduledDate}
          onChange={(e) =>
            setFormData({ ...formData, scheduledDate: e.target.value })
          }
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900">
          Duration (minutes)
        </label>
        <select
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: parseInt(e.target.value) })
          }
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="30">30 minutes</option>
          <option value="60">60 minutes</option>
          <option value="90">90 minutes</option>
          <option value="120">120 minutes</option>
        </select>
      </div>

      <div className="rounded-lg bg-slate-100 p-3">
        <div className="flex justify-between">
          <span className="text-sm text-slate-600">Total Cost:</span>
          <span className="font-semibold text-slate-900">
            ${(totalCost / 100).toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={bookMutation.isPending}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
      >
        {bookMutation.isPending ? "Booking..." : "Confirm Booking"}
      </Button>
    </form>
  );
}
