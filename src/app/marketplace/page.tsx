/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Star, User } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/app/_components/ui/button";

type ProfessionType = "therapist" | "doctor" | "consultant";
type SortByType = "rating" | "experience" | "price";

export default function MarketplacePage() {
  const [selectedProfession, setSelectedProfession] = useState<
    ProfessionType | undefined
  >();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortByType>("rating");

  const professions: ProfessionType[] = ["therapist", "doctor", "consultant"];

  // Get specialties/problem categories
  const { data: specialties } = api.expert.getSpecialties.useQuery();

  // Get experts based on filters
  const { data: expertsData, isLoading } = api.expert.getAll.useQuery({
    profession: selectedProfession,
    specialties:
      selectedSpecialties.length > 0 ? selectedSpecialties : undefined,
    sortBy,
  });

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty],
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900">
              Expert Marketplace
            </h1>
            <p className="mt-2 text-slate-600">
              Connect with qualified therapists, doctors, and consultants
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute top-3 left-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search experts or problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-10 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6 rounded-lg border border-slate-200 bg-white p-6">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <h3 className="font-semibold text-slate-900">Filters</h3>
                </div>
              </div>

              {/* Profession Filter */}
              <div>
                <h4 className="mb-3 font-medium text-slate-900">Profession</h4>
                <div className="space-y-2">
                  {professions.map((profession) => (
                    <label key={profession} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="profession"
                        value={profession}
                        checked={selectedProfession === profession}
                        onChange={(e) =>
                          setSelectedProfession(
                            e.target.checked ? profession : undefined,
                          )
                        }
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700 capitalize">
                        {profession}
                      </span>
                    </label>
                  ))}
                  {selectedProfession && (
                    <button
                      onClick={() => setSelectedProfession(undefined)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Specialties Filter */}
              <div>
                <h4 className="mb-3 font-medium text-slate-900">Specialties</h4>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {specialties &&
                    Array.isArray(specialties) &&
                    specialties.map(
                      (specialty: {
                        id: string;
                        name: string;
                        description: string | null;
                        icon: string | null;
                      }) => (
                        <label
                          key={specialty.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSpecialties.includes(
                              specialty.name,
                            )}
                            onChange={() =>
                              handleSpecialtyToggle(specialty.name)
                            }
                            className="rounded border-slate-300"
                          />
                          <span className="text-sm text-slate-700">
                            {specialty.name}
                          </span>
                        </label>
                      ),
                    )}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="mb-3 font-medium text-slate-900">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortByType)}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="price">Lowest Price</option>
                </select>
              </div>
            </div>
          </div>

          {/* Experts Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
              </div>
            ) : expertsData?.experts &&
              Array.isArray(expertsData.experts) &&
              expertsData.experts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {expertsData.experts.map((expert: any) => (
                  <Link
                    key={expert.id}
                    href={`/marketplace/${expert.id}`}
                    className="group rounded-lg border border-slate-200 bg-white p-6 transition-all hover:border-blue-400 hover:shadow-lg"
                  >
                    {/* Header with Image */}
                    <div className="mb-4 flex items-start gap-4">
                      {expert.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={expert.profileImage}
                          alt={expert.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-blue-200">
                          <User className="h-8 w-8 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                          {expert.name}
                        </h3>
                        <p className="text-sm text-slate-600 capitalize">
                          {expert.profession}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(expert.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">
                        ({expert.totalReviews} reviews)
                      </span>
                    </div>

                    {/* Bio */}
                    {expert.bio && (
                      <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                        {expert.bio}
                      </p>
                    )}

                    {/* Specialties */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {expert.specialties
                        .slice(0, 3)
                        .map((specialty: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                          >
                            {specialty}
                          </span>
                        ))}
                      {expert.specialties.length > 3 && (
                        <span className="text-xs text-slate-500">
                          +{expert.specialties.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Footer with Experience and Price */}
                    <div className="border-t border-slate-100 pt-4">
                      <div className="mb-3 flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                          {expert.yearsExperience} years experience
                        </span>
                        <span className="font-semibold text-slate-900">
                          ${(expert.hourlyRate / 100).toFixed(0)}/hr
                        </span>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        View Profile
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 py-12">
                <User className="h-12 w-12 text-slate-400" />
                <p className="mt-4 text-slate-600">
                  No experts found matching your criteria
                </p>
              </div>
            )}

            {/* Pagination Info */}
            {expertsData && (
              <div className="mt-8 text-center text-sm text-slate-600">
                Showing {expertsData.experts.length} of {expertsData.total}{" "}
                experts
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
