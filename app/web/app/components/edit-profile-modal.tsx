import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, X } from "lucide-react";
import { apiClient } from "~/lib/axios";
import { uploadBanner } from "~/lib/profile-api";
import type { PublicProfile } from "~/lib/profile-api";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: PublicProfile;
}

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const MAX_BANNER_SIZE = 10 * 1024 * 1024;

function validateImage(file: File, maxSize: number): string | null {
  if (!file.type.startsWith("image/")) return "Please select an image file";
  if (file.size > maxSize) return `Image must be under ${maxSize / (1024 * 1024)}MB`;
  return null;
}

function revokeIfBlob(url: string | null) {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}

export function EditProfileModal({
  open,
  onOpenChange,
  profile,
}: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatarUrl);
  const [bannerPreview, setBannerPreview] = useState<string | null>(profile.bannerUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const initials = (name || profile.displayName)
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const profileMutation = useMutation({
    mutationFn: async () => {
      let newAvatarUrl: string | undefined;
      let newBannerUrl: string | undefined;

      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        const { data } = await apiClient.post("/api/users/me/avatar", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newAvatarUrl = data.avatarUrl as string;
      }

      if (bannerFile) {
        const { bannerUrl } = await uploadBanner(bannerFile);
        newBannerUrl = bannerUrl;
      } else if (bannerPreview === null && profile.bannerUrl !== null) {
        await apiClient.delete("/api/users/me/banner");
      }

      await apiClient.patch("/api/users/me", {
        displayName: name.trim() || undefined,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        website: website.trim() || undefined,
      });

      return { newAvatarUrl, newBannerUrl };
    },
    onSuccess: ({ newAvatarUrl, newBannerUrl }) => {
      if (newAvatarUrl) {
        setAvatarPreview((prev) => {
          revokeIfBlob(prev);
          return newAvatarUrl;
        });
        setAvatarFile(null);
      }
      if (newBannerUrl) {
        setBannerPreview((prev) => {
          revokeIfBlob(prev);
          return newBannerUrl;
        });
        setBannerFile(null);
      }
      queryClient.invalidateQueries({ queryKey: ["profile", profile.username] });
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex flex-col top-0 left-0 translate-x-0 translate-y-0 max-w-none w-full h-dvh rounded-none border-0 p-0 overflow-hidden gap-0 sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-lg sm:h-[85vh] sm:rounded-lg sm:border"
        showCloseButton={false}
      >

        {/* Header row: X | title | Save */}
        <div className="flex items-center gap-2 px-3 h-14 shrink-0 border-b">
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full shrink-0">
              <X className="size-4" />
            </Button>
          </DialogClose>
          <DialogTitle className="flex-1 text-base font-semibold">Edit profile</DialogTitle>
          <Button
            size="sm"
            className="rounded-full px-5 shrink-0"
            onClick={() => profileMutation.mutate()}
            disabled={profileMutation.isPending}
          >
            {profileMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* Banner */}
          <div className="relative h-32 shrink-0">
            {bannerPreview ? (
              <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-primary/25 to-muted" />
            )}

            {/* Banner icon buttons — always visible, centered */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/25">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="rounded-full bg-black/60 p-2.5 text-white hover:bg-black/80 transition-colors"
                  >
                    <Camera className="size-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Add photo</TooltipContent>
              </Tooltip>

              {bannerPreview && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        setBannerPreview((prev) => {
                          revokeIfBlob(prev);
                          return null;
                        });
                        setBannerFile(null);
                        setBannerError(null);
                      }}
                      className="rounded-full bg-black/60 p-2.5 text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="size-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Remove photo</TooltipContent>
                </Tooltip>
              )}
            </div>

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const error = validateImage(file, MAX_BANNER_SIZE);
                if (error) {
                  setBannerError(error);
                } else {
                  setBannerError(null);
                  setBannerFile(file);
                  setBannerPreview((prev) => {
                    revokeIfBlob(prev);
                    return URL.createObjectURL(file);
                  });
                }
                e.target.value = "";
              }}
            />
          </div>

          {/* Avatar — overlaps banner bottom */}
          <div className="relative h-12 px-4">
            <div className="absolute -top-10 left-4">
              <div className="relative size-20">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="size-20 rounded-full object-cover ring-4 ring-background"
                  />
                ) : (
                  <div className="flex items-center justify-center size-20 rounded-full bg-primary text-primary-foreground font-semibold text-xl ring-4 ring-background">
                    {initials}
                  </div>
                )}

                {/* Avatar icon button — centered, always visible */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/35">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
                      >
                        <Camera className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Add photo</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const error = validateImage(file, MAX_AVATAR_SIZE);
                  if (error) {
                    setAvatarError(error);
                  } else {
                    setAvatarError(null);
                    setAvatarFile(file);
                    setAvatarPreview((prev) => {
                      revokeIfBlob(prev);
                      return URL.createObjectURL(file);
                    });
                  }
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4 px-4 pt-2 pb-6">
            {(bannerError || avatarError) && (
              <div className="flex flex-col gap-1">
                {bannerError && <p className="text-xs text-destructive">{bannerError}</p>}
                {avatarError && <p className="text-xs text-destructive">{avatarError}</p>}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={100}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                placeholder="Tell people about yourself"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{bio.length}/160</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                maxLength={100}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="yoursite.com"
                maxLength={200}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
